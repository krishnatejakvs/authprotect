# Product Authentication Spec

## Purpose
TBD (To Be Determined) - Covers the generation and management of cryptographic steganographic authentication tokens for product identities.

## Requirements

### Requirement: Steganographic Authentication Generation
The system SHALL generate an Authentication Token for every newly created Product Identity in a Batch. The generation MUST cryptographically derive an HMAC-based signature using the organization's unique encryption key as the HMAC secret. The signature is derived by hashing the concatenated string of the batch name, project/product name, site name, generation date/time, and the product's sequential serial number. Before embedding, the system MUST apply Reed-Solomon Forward Error Correction (FEC) encoding to the cryptographic hash payload to provide resilience against data corruption. This encoded token SHALL then be embedded into a copy of the project's cover image via an active, mathematical Discrete Cosine Transform (DCT) based steganography algorithm that alters the frequency coefficients of the image.

#### Scenario: Cryptographic generation succeeds
- **WHEN** a Product Identity is created during batch processing
- **THEN** the system generates an HMAC token using the organization's encryption key and the concatenated batch, site, date, and serial number data, applies Reed-Solomon encoding to this token, embeds the encoded data mathematically into the project cover image's DCT coefficients, saves the modified image, and records the Authentication Token in the database.

### Requirement: Asynchronous Processing
The system SHALL perform the steganographic embedding process asynchronously via a task queue to prevent blocking user requests.

#### Scenario: Batch generation requested
- **WHEN** a batch generation request is accepted
- **THEN** the API returns immediately with a task/batch ID, and the image generation runs in background workers.

### Requirement: Token-Identity Linkage
The system SHALL strictly link one Authentication Token (the steganographic image record) to exactly one Product Identity.

#### Scenario: Token retrieval
- **WHEN** the system looks up an Authentication Token
- **THEN** it resolves to a single unique Product Identity.
