## Why

Stakeholders in the supply chain and end consumers need a reliable way to verify if a physical product is authentic. Currently, visual inspection is insufficient as counterfeit products often perfectly mimic packaging. Implementing a digital verification process that extracts embedded cryptographic data (via reverse DCT steganography) allows users to conclusively validate a product's authenticity and provides explainable results in a self-serve manner.

## What Changes

- Add an image upload interface for product verification on the frontend.
- Implement the Verification Engine backend logic to perform reverse DCT and Reed-Solomon decoding on uploaded images.
- Query the platform database to match extracted hashes against stored product identities.
- Display detailed product identity context (serial number, plant, date, product name) upon successful verification.
- Provide explainable, non-technical results and confidence scores for failed or uncertain verifications (e.g. damaged packaging).
- Create a Verification History page and logging system to store and search past verification events.

## Capabilities

### New Capabilities

- `verification`: Product verification via image upload, steganographic hash extraction, confidence scoring, results display, and history logging.

### Modified Capabilities

- 

## Impact

- **Frontend**: New verification page UI, new history/search UI for admins.
- **Backend API**: New endpoints for uploading verification images and querying history.
- **Worker / Engine**: Verification processing tasks involving OpenCV, image processing (inverse DCT), and `reedsolo`.
- **Database**: New schemas for `VerificationSession` and `VerificationResult`.
- **Systems**: Modest increase in CPU usage during synchronous or asynchronous image processing during verification.
