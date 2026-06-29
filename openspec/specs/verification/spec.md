## ADDED Requirements

### Requirement: Unique Verification Session
The system SHALL initiate a unique Verification Session for each uploaded product image. A session MUST evaluate exactly one Product Identity and produce exactly one Verification Result. The process MUST be read-only and MUST NOT modify the underlying Product Identity.

#### Scenario: User initiates a verification session
- **WHEN** a user uploads an image to the verification page
- **THEN** the system creates a new Verification Session for the image and evaluates the single corresponding Product Identity

### Requirement: Steganographic Hash Extraction & Validation
The system MUST process the uploaded image using reverse Discrete Cosine Transform (DCT) steganography and Reed-Solomon decoding to extract the embedded payload. The extracted hash MUST be compared against the platform database.

#### Scenario: Hash extraction succeeds
- **WHEN** the image contains an embedded payload
- **THEN** the system successfully decodes the Reed-Solomon data, extracts the hash, and queries the database for a matching Product Identity

### Requirement: Explainable Verification Results
The system MUST display clear, non-technical verification results to the user.
- On authentic match, it SHALL display the serial number, manufacturing plant, date, and product name.
- On counterfeit or complete failure, it SHALL display a customer-friendly message indicating a potential counterfeit or damaged packaging (only if extraction fails).
- On uncertainty, it SHALL display a Confidence Score and recommend physical verification.

#### Scenario: Authentic match
- **WHEN** the extracted hash matches a Product Identity in the database
- **THEN** the system displays the product's serial number, manufacturing plant, date, and product name

#### Scenario: Counterfeit or damaged packaging
- **WHEN** the hash cannot be extracted or does not match
- **THEN** the system displays a clear, non-technical explanation that it may be a counterfeit or the packaging might be damaged

#### Scenario: Uncertain verification
- **WHEN** partial data is recovered but the result is not definitive
- **THEN** the system displays a Confidence Score (e.g., 60%) and instructs the user to pursue manual physical verification

### Requirement: Event Logging and Search
The system MUST log a `VerificationCompleted` or `VerificationFailed` event upon session completion. The platform MUST provide a dedicated verification history interface for admins to search and filter these events.

#### Scenario: Admin searches verification history
- **WHEN** an Admin navigates to the verification history page and filters by outcome
- **THEN** the system displays a list of past verification events matching the filter criteria (e.g. Counterfeit)
