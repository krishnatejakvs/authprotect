## 1. Environment Setup

- [x] 1.1 Add `reedsolo` and `numpy` (if not already present for image manipulation) to `backend/requirements.txt`.
- [x] 1.2 Update the Dockerfile or local environment instructions to install the new dependencies.

## 2. Reed-Solomon Implementation

- [x] 2.1 Implement `encode_payload(hash_string: str) -> bytes` in `backend/app/utils/steganography.py` using `reedsolo` to convert the 64-char HMAC hash to a bytearray with appended parity bytes.

## 3. DCT Steganography Algorithm

- [x] 3.1 Implement a function to convert the cover image from RGB to YCrCb color space, as DCT is most effectively applied to the Y (luminance) channel.
- [x] 3.2 Implement the 2D Discrete Cosine Transform (DCT) splitting the Y channel into 8x8 blocks.
- [x] 3.3 Implement the embedding logic to alter mid-frequency coefficients of the 8x8 blocks to encode the bits of the Reed-Solomon encoded payload.
- [x] 3.4 Implement the inverse DCT to convert the modified frequency blocks back to spatial domain pixels.
- [x] 3.5 Merge the modified Y channel with Cr and Cb channels and convert back to RGB.

## 4. Worker Integration

- [x] 4.1 Update `generate_batch_identities` in `backend/app/worker.py` to call the new steganography functions instead of the mock file copying logic.
- [x] 4.2 Verify that the Celery worker correctly processes the batch and outputs visually intact modified JPEG images.
