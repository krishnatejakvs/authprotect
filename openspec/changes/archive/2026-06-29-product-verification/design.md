## Context

Currently, physical product verification relies on manual visual checks which are susceptible to highly convincing counterfeit packaging. The Product Trust Platform requires a robust, scalable digital verification engine. The platform has already implemented generation of Authentication Tokens and steganographic embedding using Reed-Solomon encoding and Discrete Cosine Transform (DCT) during the batch generation process. This design addresses the missing "verification" half of the equation, enabling stakeholders to upload images and validate authenticity in real-time.

## Goals / Non-Goals

**Goals:**
- Provide a responsive verification endpoint that accepts image uploads.
- Implement a steganographic decoding pipeline that robustly handles minor image degradation using Reed-Solomon forward error correction.
- Definitively verify a product identity against the database using the extracted hash.
- Calculate and expose a "Confidence Score" for marginal verifications where the packaging might be degraded.
- Record verification events for historical auditing and analytics.

**Non-Goals:**
- Handling advanced fraud analytics based on verification history.
- Real-time mobile on-device scanning apps (this focuses on web-based image uploads).
- Modification of existing product identities.

## Decisions

**1. Synchronous vs Asynchronous Verification:**
- *Decision:* Verification will be synchronous.
- *Rationale:* End-consumers expect an immediate response when checking authenticity. While image processing (DCT and RS) can be slightly CPU-intensive, it typically completes in under 500ms for standard images. If latency issues arise at scale, the process can be moved to background workers with a polling mechanism, but initially, a direct HTTP request/response model is preferred for simplicity and better UX.

**2. Confidence Scoring Algorithm:**
- *Decision:* The confidence score will be based on the number of Reed-Solomon parity bytes used to correct the payload.
- *Rationale:* Since `reedsolo` can report if data was corrected, zero errors implies 100% confidence. Significant errors requiring maximum parity correction decrease the score. Uncorrectable data implies either a counterfeit or severely damaged image (yielding a 0% confidence, or a specific "Uncertain" status if some bits match).

**3. Event Logging Approach:**
- *Decision:* A new `VerificationSession` model will track the upload attempt, and a `VerificationResult` model will store the final outcome (Authentic, Counterfeit, Uncertain).
- *Rationale:* This normalizes the data, separating the act of verifying (which may be abandoned or failed at the file level) from the steganographic outcome.

## Risks / Trade-offs

- **Risk: High latency on large image uploads.**
  - *Mitigation:* The frontend will downsample or compress images heavily before upload, ensuring they meet the 512x512 minimum resolution without being multi-megabyte payloads.
- **Risk: False Negatives due to image compression (e.g. WhatsApp forwarding).**
  - *Mitigation:* The confidence score will instruct users to perform physical verification if the system cannot definitively read the hash but detects some signature activity. We heavily rely on the Reed-Solomon parity to handle minor corruptions.
