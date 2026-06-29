## Why

Manufacturers require the ability to securely generate and assign verifiable digital identities and cryptographic proofs to their physical products at scale. This change introduces the batch generation system, which allows users to generate bulk product identities for a project and embeds authentication tokens into product cover images using steganography, directly fulfilling the core goal of combating counterfeiting.

## What Changes

- **Product Batch Generation UI**: A new interface within a Project's view to configure and trigger the creation of a new batch of products. The user provides a batch name, linked site, date and time, and the quantity.
- **Global Products Page**: A new primary navigation item ("Products") alongside Organizations, Sites, and Projects to browse and search generated batches/products by name, batch number, or site.
- **Identity Generation (Backend)**: Integration with the Identity Engine (CAP-002) to bulk-generate immutable `Product Identity` records for the batch, leveraging a generated sequential serial number for each product.
- **Organization-Specific Encryption Keys**: Updating the Organization model to automatically generate and securely store a unique cryptographic key upon creation.
- **Steganographic Authentication**: Integration with the Authentication Engine (CAP-003) to generate cryptographic HMAC tokens using the organization's specific encryption key as the secret. The tokens are derived from concatenated data (batch + product + site + date + product serial number) and embedded securely within the project's cover image.
- **Asynchronous Processing**: Background workers (Celery) to handle the bulk generation process asynchronously without blocking the user interface.

## Capabilities

### New Capabilities
- `product-identities`: Batch creation, registry, and management of Product Identities (implementing CAP-002 requirements).
- `product-authentication`: Generation of cryptographic authenticity proofs and their steganographic embedding into project cover images (implementing CAP-003 requirements).

### Modified Capabilities
- `administration`: Modifying the main application layout and navigation to include access to a new global Products page. Also updating Organization creation to generate an encryption key.

## Impact

- **Frontend**: Adds a new primary global "Products" view, plus complex views for Batch creation and progress tracking under the Projects domain.
- **Backend**: Introduces new API endpoints for `Batch` and `ProductIdentity` generation. Updates Organization creation logic.
- **Background Tasks**: Requires a Celery worker setup to handle CPU-intensive steganography operations for large batches to avoid API timeouts.
- **Database**: Introduces new tables (`batches`, `product_identities`, `authentication_tokens`) and adds an `encryption_key` column to the `organizations` table.
