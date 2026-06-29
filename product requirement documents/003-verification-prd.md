# PRD: Product Verification

## Document Control

| Field | Value |
|---|---|
| Capability ID | CAP-004 |
| Capability Name | Verification |
| Related Skill | `skills/verification` |
| Product Area | Core Platform / Verification |
| Status | Draft |
| Primary Audience | Product, Engineering, Design, QA, Customer Success |

## Overview

Verification is a core platform capability where different stakeholders in the ecosystem can take a picture of their physical product and upload it to the platform's verification page. The system evaluates the image to validate the authenticity of the product manufactured by the organization and ensures it is not a counterfeit. 

The verification engine relies on steganographic extraction, applying reverse Discrete Cosine Transform (DCT) and Reed-Solomon decoding to extract the embedded cryptographic hash. This hash is compared against the platform's database to definitively establish authenticity.

## Why this matters

The primary value proposition of the Product Trust Platform is protecting consumers and organizations from counterfeit goods. Without a reliable, fast, and explainable verification process, the generated product identities hold no real-world value. Verification closes the loop, allowing the physical product to be seamlessly authenticated in the digital realm.

## Product goal

Enable stakeholders to quickly and confidently verify the authenticity of a physical product by simply uploading an image, and provide a clear, explainable result along with the product's manufacturing details.

## Success metrics

The capability is successful when it optimizes the following metrics:

- **Verification Accuracy**: The percentage of true authentic/counterfeit determinations.
- **Verification Latency**: The end-to-end time taken from image upload to displaying the result (must be as minimal as possible).
- **False Positive Rate**: The rate at which counterfeit products are incorrectly identified as authentic.
- **False Negative Rate**: The rate at which authentic products are incorrectly identified as counterfeit.

## Problem statement

Stakeholders in the supply chain and end consumers need a reliable way to verify if a physical product is authentic. Currently, physical verification is manual, error-prone, and lacks real-time digital validation. Counterfeit products often mimic packaging perfectly, making visual inspection insufficient. 

We need an automated, image-based digital verification system that extracts cryptographic data embedded invisibly within the product packaging and provides an explainable result.

## Product principles

- **One-to-One Evaluation:** At any given time, exactly one verification session evaluates exactly one product identity.
- **Explainability First:** Verification results must be clear to the user. If a product fails verification, the reason (e.g., severe wear and tear, missing data, counterfeit) must be communicated in customer-friendly terms, not technical jargon.
- **Confidence Scoring:** If the system is unsure (e.g., partial data retrieved due to packaging damage), it must provide a confidence score rather than a binary result, guiding the user to physical verification.
- **Immutability:** Verification is a read-only process; it does not modify the underlying Product Identity.
- **Historical Traceability:** All verification events must be logged and searchable for historical reference.

## Scope

### In scope

#### 1. Image-Based Verification Workflow
- Image upload interface on the verification page.
- Extraction of cryptographic hash via reverse DCT steganography.
- Reed-Solomon decoding for error correction.
- Hash comparison against the database.

#### 2. Verification Results Display
- On Success: Display associated Product Identity details:
  - Serial number
  - Manufacturing plant/site
  - Manufacturing date
  - Product name
- On Failure/Counterfeit: Provide a clear, non-technical explanation (e.g., "We could not verify this product. It may be a counterfeit or the packaging might be damaged(only if the hash extraction fails due to packaging damage or any other reason).").
- On Uncertainty (Smart fallback): Display a "Confidence Score" and instruct the user to pursue manual physical verification if the system cannot make a definitive determination.

#### 3. Verification History & Search
- Store all verification events in the platform.
- Provide a dedicated verification page to view past historical events.
- Enable searching and filtering through events by `event result` or `verification result`.

### Out of scope

- Manual physical verification processes.
- Trust History (CAP-005) and advanced Fraud Analytics.
- Generation of the authentication tokens (covered under CAP-003).

## Users and roles

### Consumer / Stakeholder
- Can upload an image to verify a product.
- Can view the verification result, manufacturing details, and confidence score.

### Organization Admin / Site Manager
- Can view historical verification events related to their organization/site.
- Can search and filter past verification events.

## User stories

| ID | User Story |
|---|---|
| US-001 | As a stakeholder, I want to upload a picture of my physical product so that the system can verify its authenticity. |
| US-002 | As a stakeholder, I want to see the product's serial number, manufacturing plant, date, and product name upon successful verification, so that I have complete context about the item. |
| US-003 | As a stakeholder, if my product is counterfeit or unreadable, I want a clear, non-technical explanation so that I understand why the verification failed. |
| US-004 | As a stakeholder, if the packaging is damaged and the system is unsure, I want to see a confidence score and next steps so that I know how to proceed with physical verification. |
| US-005 | As an Admin, I want to view and search through past verification events by their result so that I can monitor counterfeiting attempts and system performance. |

## Functional requirements

### 1. Verification Session
- The system MUST initiate a unique Verification Session for each uploaded image.
- A session MUST evaluate exactly one Product Identity (BR-001).
- A session MUST produce exactly one Verification Result (BR-002).
- The verification process MUST NOT modify the Product Identity (BR-004).

### 2. Hash Extraction & Validation
- The system MUST process the uploaded image using reverse DCT steganography to extract the embedded payload.
- The system MUST apply Reed-Solomon decoding to correct any data corruption (e.g., from minor image degradation).
- The system MUST extract the hash and compare it against the securely stored hashes in the database.

### 3. Verification Explainability & UI (BR-003)
- **Authentic Match:** If the hash exists, display the serial number, plant, manufacturing date, and product name.
- **Counterfeit/Failure:** If the hash is missing or cannot be extracted, display a customer-friendly error message indicating a potential counterfeit or damaged packaging.
- **Uncertainty / Confidence Score (BR-005):** If partial data is recovered but verification is not definitive, the system MUST display a Confidence Score (e.g., 60%) and prompt the user to fall back to physical verification.

### 4. Event Logging & Search
- The system MUST log a `VerificationCompleted` or `VerificationFailed` event upon session completion.
- The platform MUST provide a verification history interface.
- Users MUST be able to search and filter these historical events by the verification result.

## Domain model

### Verification Session
| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| timestamp | When the session was initiated |
| image_url | Link to the uploaded artifact |
| status | In Progress / Completed / Failed |

### Verification Result
| Field | Type / Notes |
|---|---|
| id | Unique identifier |
| session_id | FK -> Verification Session |
| product_identity_id | FK -> Product Identity (Nullable if counterfeit) |
| outcome | Authentic / Counterfeit / Uncertain |
| confidence_score | Percentage (0-100) |
| explanation | Customer-friendly reasoning |

## Business rules

| ID | Rule |
|---|---|
| BR-001 | Every Verification Session evaluates exactly one Product Identity. |
| BR-002 | Every Verification Session produces one Verification Result. |
| BR-003 | Verification must be explainable in non-technical terms. |
| BR-004 | Verification does not modify Product Identity. |
| BR-005 | Confidence Scores must accompany every verification. |

## Key workflows

### 1. Product Authenticity Verification
1. User navigates to the verification page and uploads an image.
2. System creates a `Verification Session`.
3. System applies reverse DCT and Reed-Solomon decoding.
4. System looks up the extracted hash.
5. System generates a `Verification Result` (and Confidence Score).
6. System displays the result and explanation to the user.
7. System logs the `VerificationCompleted` or `VerificationFailed` event.

### 2. Historical Event Search
1. Admin navigates to the verification history page.
2. Admin filters by `outcome = Counterfeit`.
3. System displays a list of failed verification attempts, including uploaded images and confidence scores.

## Release definition of done
- Image upload and extraction pipeline (reverse DCT + RS) is fully functional with minimal latency.
- Successful verification accurately retrieves and displays product identity data.
- Unsuccessful verifications provide clear, non-technical explanations.
- Confidence scoring correctly identifies marginal cases (e.g., wear and tear).
- Verification history page allows searching and filtering of events.
