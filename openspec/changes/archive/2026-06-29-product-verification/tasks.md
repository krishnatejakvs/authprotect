## 1. Database and Models

- [x] 1.1 Create `VerificationSession` model (id, timestamp, image_url, status).
- [x] 1.2 Create `VerificationResult` model (id, session_id, product_identity_id, outcome, confidence_score, explanation).
- [x] 1.3 Generate and apply Alembic migration for the new models.

## 2. Steganography Extraction Logic

- [x] 2.1 Implement `decode_payload(encoded_bytes: bytes)` in `backend/app/utils/steganography.py` using `reedsolo` to extract the hash and parity error count.
- [x] 2.2 Implement `extract_hmac_dct(image_path: str)` to read the image, perform inverse DCT on 8x8 blocks, and extract the binary payload.
- [x] 2.3 Implement confidence score calculation based on `reedsolo` error correction metrics.

## 3. Backend Verification API

- [x] 3.1 Create POST `/api/verify` endpoint in a new `verifications.py` router.
- [x] 3.2 Implement image upload handling and session creation.
- [x] 3.3 Integrate `extract_hmac_dct` within the endpoint to retrieve the hash.
- [x] 3.4 Query the database for the extracted hash in `AuthenticationToken` to resolve the `ProductIdentity`.
- [x] 3.5 Construct and save the `VerificationResult` with appropriate outcomes (Authentic, Counterfeit, Uncertain) and explanations.
- [x] 3.6 Create GET `/api/verifications` endpoint to list history for admins.

## 4. Frontend Integration

- [x] 4.1 Create a new `/verify` route and page component with an image upload interface.
- [x] 4.2 Integrate the POST `/api/verify` API call on image submission.
- [x] 4.3 Build a results display component showing Product Identity details or clear error/uncertainty messages based on the outcome.
- [x] 4.4 Create a Verification History page for Admins to search and filter past verification events.
