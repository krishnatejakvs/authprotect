## Context

Currently, AuthProtect's batch generation worker relies on a mocked steganography implementation in `backend/app/utils/steganography.py`. It simulates embedding the authentication hash into a product image by merely copying the project's cover image and renaming it. To provide actual cryptographic security and verifiable anti-counterfeit protection, the image must be mathematically altered at the frequency level (Discrete Cosine Transform) so the hash is imperceptibly hidden within the image pixels. Furthermore, to make this robust against minor image compressions or damage during printing, we will apply Reed-Solomon Forward Error Correction (FEC) to the hash before embedding.

## Goals / Non-Goals

**Goals:**
- Implement mathematically sound DCT steganography that alters the frequency coefficients of JPEG images to embed binary data.
- Integrate Reed-Solomon (RS) encoding to add parity bytes to the cryptographic HMAC, providing error correction capabilities during the extraction phase.
- Ensure the modified image is visually identical (or nearly identical) to the naked eye.
- Perform the embedding synchronously within the Celery worker task `generate_batch_identities`.

**Non-Goals:**
- Implementing the *extraction* and *verification* flow (e.g., scanning the image via mobile app and decoding the hash). This change focuses only on the generation/embedding side.
- Building a custom Reed-Solomon implementation from scratch. We will use a vetted, off-the-shelf Python library (like `reedsolo`).

## Decisions

**1. Library Selection for Error Correction**
- We will use the `reedsolo` Python package for Reed-Solomon encoding. It is a pure Python implementation that is easy to install, lightweight, and standard for adding parity bytes to bytearrays.

**2. Steganography Algorithm**
- We will use **Discrete Cosine Transform (DCT)** over simpler methods like Least Significant Bit (LSB). DCT embedding operates in the frequency domain, which is inherently more robust against JPEG compression, filtering, and printing/scanning noise, which is essential for physical product packaging.

**3. Bit Embedding Strategy**
- The HMAC hash is 64 hex characters (256 bits). With RS encoding overhead (e.g., adding 10 parity bytes), the payload will be roughly ~42 bytes (336 bits). We will embed one bit per 8x8 DCT block by slightly altering the relationship between two mid-frequency coefficients to represent a 0 or 1.

## Risks / Trade-offs

- **Risk: Performance Overhead** → DCT transformations on large images take significantly longer than file copying.
  - *Mitigation:* We are already running this in a background Celery worker, so the user UI will not be blocked.
- **Risk: Image Quality Degradation** → Modifying DCT coefficients can introduce visible artifacts if the embedding strength is too high.
  - *Mitigation:* We will tune the embedding strength (alpha parameter) to balance robustness and imperceptibility.
- **Risk: Payload Size Limits** → Small images may not have enough 8x8 blocks to embed the entire payload plus parity.
  - *Mitigation:* We will enforce a minimum image resolution (e.g., 512x512) for the project cover images.
