import os
import cv2
import numpy as np
import reedsolo

def encode_payload(hash_string: str) -> bytes:
    """Encode the 64-character hex hash into a byte array with RS parity bytes."""
    rs = reedsolo.RSCodec(10) # 10 ECC symbols (parity bytes)
    payload_bytes = bytes.fromhex(hash_string)
    encoded = rs.encode(payload_bytes)
    return encoded

def _embed_bit(block, bit, alpha=25.0):
    """
    Embed a bit in a DCT block by modifying mid-frequency coefficients.
    We will compare block[4, 5] and block[5, 4].
    If bit == 1: block[4, 5] > block[5, 4]
    If bit == 0: block[4, 5] < block[5, 4]
    alpha is the embedding strength.
    """
    c1, c2 = 4, 5
    c3, c4 = 5, 4
    
    val1 = block[c1, c2]
    val2 = block[c3, c4]
    diff = val1 - val2
    
    if bit == 1:
        if diff < alpha:
            # Need val1 > val2 + alpha
            avg = (val1 + val2) / 2.0
            block[c1, c2] = avg + (alpha / 2.0)
            block[c3, c4] = avg - (alpha / 2.0)
    else: # bit == 0
        if diff > -alpha:
            # Need val1 < val2 - alpha
            avg = (val1 + val2) / 2.0
            block[c1, c2] = avg - (alpha / 2.0)
            block[c3, c4] = avg + (alpha / 2.0)
            
    return block

def embed_hmac_dct(image_path: str, hmac_token: str) -> str:
    """
    Embeds the HMAC token into the image using DCT steganography.
    Returns the path to the saved image.
    """
    # 1. Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image")
        
    # 2. Encode payload (HMAC) with Reed-Solomon
    encoded_bytes = encode_payload(hmac_token)
    
    # Convert payload to bits
    bits = []
    for b in encoded_bytes:
        for i in range(8):
            bits.append((b >> i) & 1)
            
    # 3. Convert image to YCrCb and get Y channel
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    Y, Cr, Cb = cv2.split(ycrcb)
    
    h, w = Y.shape
    
    # 4. Process image in 8x8 blocks
    bit_idx = 0
    total_bits = len(bits)
    
    # Pad if necessary
    h_pad = (8 - h % 8) % 8
    w_pad = (8 - w % 8) % 8
    
    if h_pad != 0 or w_pad != 0:
        Y = np.pad(Y, ((0, h_pad), (0, w_pad)), mode='edge')
        Cr = np.pad(Cr, ((0, h_pad), (0, w_pad)), mode='edge')
        Cb = np.pad(Cb, ((0, h_pad), (0, w_pad)), mode='edge')
        
    h_padded, w_padded = Y.shape
    
    max_blocks = (h_padded // 8) * (w_padded // 8)
    if total_bits > max_blocks:
        raise ValueError(f"Image too small to embed {total_bits} bits. Max blocks: {max_blocks}")
        
    Y_modified = np.zeros_like(Y, dtype=np.float32)
    
    for i in range(0, h_padded, 8):
        for j in range(0, w_padded, 8):
            # Extract block
            block = Y[i:i+8, j:j+8].astype(np.float32)
            # Apply DCT
            dct_block = cv2.dct(block)
            
            if bit_idx < total_bits:
                # Embed a bit
                dct_block = _embed_bit(dct_block, bits[bit_idx], alpha=25.0)
                bit_idx += 1
                
            # Apply Inverse DCT
            idct_block = cv2.idct(dct_block)
            Y_modified[i:i+8, j:j+8] = idct_block
            
    # Clip and convert back to uint8
    Y_modified = np.clip(Y_modified, 0, 255).astype(np.uint8)
    
    # 5. Merge channels and convert back to BGR
    ycrcb_modified = cv2.merge([Y_modified, Cr, Cb])
    img_modified = cv2.cvtColor(ycrcb_modified, cv2.COLOR_YCrCb2BGR)
    
    # Crop back to original size if we padded
    if h_pad != 0 or w_pad != 0:
        img_modified = img_modified[:h, :w]
        
    # 6. Save modified image
    name, ext = os.path.splitext(image_path)
    output_path = f"{name}_{hmac_token[:8]}{ext}"
    cv2.imwrite(output_path, img_modified)
    
    return output_path

def decode_payload(encoded_bytes: bytes) -> tuple[str, int]:
    """Decode the byte array with RS parity bytes to retrieve the hex hash.
    Returns (hash_string, errata_count).
    """
    rs = reedsolo.RSCodec(10) # 10 ECC symbols
    try:
        decoded, decoded_full, errata_pos = rs.decode(encoded_bytes)
        # convert back to hex string
        hash_string = decoded.hex()
        errata_count = len(errata_pos) if errata_pos else 0
        return hash_string, errata_count
    except reedsolo.ReedSolomonError:
        # Cannot decode
        return "", -1

def _extract_bit(block):
    """
    Extract a bit from a DCT block by comparing mid-frequency coefficients.
    """
    c1, c2 = 4, 5
    c3, c4 = 5, 4
    
    val1 = block[c1, c2]
    val2 = block[c3, c4]
    
    return 1 if val1 > val2 else 0

def extract_hmac_dct(image_path: str) -> tuple[str, float]:
    """
    Extracts the HMAC token from the image using DCT steganography.
    Returns (hash_string, confidence_score).
    If confidence_score is 0.0, the hash is likely invalid/uncorrectable.
    """
    # 1. Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image")
        
    # 2. Convert to YCrCb
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    Y, _, _ = cv2.split(ycrcb)
    
    h, w = Y.shape
    
    # Pad if necessary (same as embedding)
    h_pad = (8 - h % 8) % 8
    w_pad = (8 - w % 8) % 8
    
    if h_pad != 0 or w_pad != 0:
        Y = np.pad(Y, ((0, h_pad), (0, w_pad)), mode='edge')
        
    h_padded, w_padded = Y.shape
    
    # We know the payload length: 32 bytes hash + 10 bytes ECC = 42 bytes.
    # Total bits = 42 * 8 = 336
    total_bits = 336
    
    max_blocks = (h_padded // 8) * (w_padded // 8)
    if total_bits > max_blocks:
        raise ValueError(f"Image too small to contain {total_bits} bits.")
        
    bits = []
    bit_idx = 0
    
    for i in range(0, h_padded, 8):
        for j in range(0, w_padded, 8):
            if bit_idx >= total_bits:
                break
                
            block = Y[i:i+8, j:j+8].astype(np.float32)
            dct_block = cv2.dct(block)
            
            bit = _extract_bit(dct_block)
            bits.append(bit)
            bit_idx += 1
            
        if bit_idx >= total_bits:
            break
            
    # Convert bits to bytes
    byte_array = bytearray()
    for i in range(0, len(bits), 8):
        byte_val = 0
        for j in range(8):
            byte_val |= (bits[i+j] << j)
        byte_array.append(byte_val)
        
    # Decode
    hash_string, errata_count = decode_payload(bytes(byte_array))
    
    # Confidence score calculation
    if errata_count == -1:
        confidence = 0.0
    else:
        # Max errors we can correct with 10 ECC symbols is 5 (without erasures)
        # So 0 errors = 100%, 5 errors = 0%
        max_errors = 5
        confidence = max(0.0, 100.0 * (1.0 - (errata_count / max_errors)))
        
    return hash_string, confidence
