import os
import cv2
import numpy as np

def embed_hmac_dct(image_path: str, hmac_token: str) -> str:
    """
    Embeds the HMAC token into the image using DCT steganography.
    Returns the path to the saved image.
    """
    # Mock implementation of DCT steganography for now
    # In a real scenario, this would apply 2D DCT to 8x8 blocks,
    # modify mid-frequency coefficients to embed the bits of the hmac_token,
    # and then apply inverse DCT to reconstruct the image.
    
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image")
        
    # We will simulate the process by just saving the image with a new name for the mock
    name, ext = os.path.splitext(image_path)
    output_path = f"{name}_{hmac_token[:8]}{ext}"
    cv2.imwrite(output_path, img)
    return output_path
