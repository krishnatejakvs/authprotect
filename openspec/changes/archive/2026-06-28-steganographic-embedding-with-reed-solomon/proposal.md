## Why

The current steganographic embedding implementation is merely a mock that simulates embedding by renaming files. To fulfill the core value proposition of AuthProtect—secure, verifiable anti-counterfeiting identities—we must implement the actual mathematical embedding process. Additionally, Reed-Solomon encoding provides error correction, ensuring the cryptographic hash can be successfully recovered from the image even if the physical image undergoes minor wear, tear, or compression. 

## What Changes

- Replace the simulated steganography mock with an actual Discrete Cosine Transform (DCT) based embedding algorithm.
- Introduce Reed-Solomon encoding to apply Forward Error Correction (FEC) to the cryptographic hash *before* it is embedded into the image's DCT coefficients.
- The `steganography.py` utility will be overhauled to perform mathematical manipulations on the image frequencies instead of filesystem renames.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `product-authentication`: Modify the "Steganographic Authentication Generation" requirement to mandate the use of Reed-Solomon Encoding for error correction and real DCT algorithm embedding instead of the mock implementation.

## Impact

- `backend/app/utils/steganography.py`: Will undergo significant algorithm changes to support Reed-Solomon encoding and DCT mathematical transformations.
- Will likely require new Python dependencies for image processing and error correction (e.g., `reedsolo`).
- `backend/app/worker.py`: Will call the updated embedding function, possibly handling more complex return structures or longer processing times.
