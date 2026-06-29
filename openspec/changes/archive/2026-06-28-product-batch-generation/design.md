## Context

The AuthProtect platform manages Products, Batches, and Authentication methods. To actually secure physical products, the system must generate unique identities (CAP-002) and cryptographically verifiable authentication tokens (CAP-003) for a bulk batch of items. This design outlines how the batch generation process will be architected to ensure scalability, security, and traceability. 

Currently, projects can be created and cover images can be uploaded, but the core batch generation functionality is missing.

## Goals / Non-Goals

**Goals:**
- Provide a robust API and UI for generating a batch of Product Identities.
- Integrate Steganography-based authentication token embedding securely into product cover images.
- Handle bulk generation asynchronously to prevent API timeouts on large batches.

**Non-Goals:**
- Generating tokens for anything other than physical products in a batch.
- Real-time synchronous generation of millions of items (this will be purely asynchronous).
- Verification flows (covered by CAP-004 later).

## Decisions

**1. Asynchronous Task Queue for Batch Generation**
- *Rationale*: Generating steganographic images for thousands of products in a batch is CPU intensive. Performing this synchronously within a FastAPI request cycle will lead to timeouts and poor UX. We will use a Celery task queue with a Redis broker to process batch generation in the background.
- *Alternatives*: Using FastAPI `BackgroundTasks`. Rejected because `BackgroundTasks` run in the same event loop/process and can block other requests or get lost if the server restarts.

**2. Relational Model for Identities and Tokens**
- *Rationale*: We will create a `batches` table, a `product_identities` table, and an `authentication_tokens` table. `ProductIdentity` records will be generated first, which acts as the source for `AuthenticationToken` generation (as per CAP-003 BR-002).
- *Alternatives*: Storing everything in JSON or NoSQL. Rejected because we need strong relational integrity to link tokens -> identities -> batches -> products -> projects.

**3. Steganography Embedding Approach**
- *Rationale*: The base cover image associated with the project will be retrieved. For each product identity in the batch, a sequential product serial number (e.g. 1, 2, 3...) is generated. An HMAC-SHA256 signature is calculated by hashing the concatenated string of: `[batch_name] + [product_name] + [site_name] + [date] + [serial_number]`, using the organization's unique encryption key as the HMAC secret. This signature is then embedded into a unique copy of the cover image using a DCT (Discrete Cosine Transform) based steganography algorithm for higher robustness against compression and tampering, replacing the traditional fragile LSB approach. The resulting image is saved to secure storage (e.g., S3/local storage) and linked to the `AuthenticationToken` record. The authentication token is stored in the products database table.

**4. Organization-Level Encryption Keys**
- *Rationale*: To securely isolate token generation across tenants, each organization will automatically generate and store a secure, unique cryptographic key upon creation. This key is stored in the `organizations` table and guarantees that even if a product's batch parameters are identical, the resulting authentication tokens will be unique to the generating organization.

## Risks / Trade-offs

- **[Risk] Storage Costs**: Generating thousands of unique images per batch could lead to high storage costs.
  *Mitigation*: Optimize output image compression and consider offloading to cheap object storage like AWS S3 or R2 immediately.
- **[Risk] CPU Bottlenecking**: High concurrency of batch generation could starve the server of CPU resources.
  *Mitigation*: Run Celery workers on dedicated nodes separate from the API server in production.
