# Product Domain Model & Ubiquitous Language

| Field   | Value                                               |
| ------- | --------------------------------------------------- |
| Product | Product Trust Platform (Working Name: AuthPrint AI) |
| Version | 0.1                                                 |
| Status  | Canonical Business Vocabulary                       |

---

# Purpose

This document defines the canonical business language of the Product Trust Platform.

Every business document, OpenSpec specification, API, database schema, UI, and AI coding agent must use the terminology defined here.

Avoid introducing synonyms for existing concepts.

One business concept should have one canonical name.

---

# Core Philosophy

The platform models **trust**, not files, images, or watermarks.

Technical implementations may change.

Business concepts should remain stable.

---

# Domain Hierarchy

```text
Organization
    │
    ├── Workspace
    │      │
    │      ├── Project
    │      │      │
    │      │      ├── Product
    │      │      │      │
    │      │      │      ├── Product Identity
    │      │      │      │       │
    │      │      │      │       ├── Authentication
    │      │      │      │       ├── Verification
    │      │      │      │       ├── Trust Events
    │      │      │      │       └── Trust Intelligence
```

---

# Core Business Entities

## Organization

Definition

A company or legal entity using the platform.

Examples

* Nestlé
* Pfizer
* Tata Consumer
* Samsung

Responsibilities

* Owns workspaces.
* Owns projects.
* Owns products.
* Owns cryptographic identities.

---

## Workspace

Definition

A logical boundary for organizing work inside an organization.

Examples

* India Business Unit
* Europe Operations
* Personal Sandbox

Purpose

Supports multi-team collaboration.

---

## Project

Definition

A business initiative that generates authenticated packaging for one product line.

Examples

"Coca-Cola 500ml PET"

"Dove Shampoo 200ml"

Project owns:

* Artwork
* Generation configuration
* Batch settings

---

## Product

Definition

A commercial product sold by a manufacturer.

Examples

Paracetamol 500mg

Premium Coffee Beans

Luxury Watch

A Product may have multiple manufacturing batches.

---

## Batch

Definition

A manufacturing batch of a product.

Contains:

* Manufacturing date
* Plant
* Quantity
* Batch identifier

A Batch produces many Product Identities.

---

## Product Identity

Definition

The permanent digital identity of one physical product.

This is the most important business entity.

A Product Identity exists independently of authentication technology.

It represents:

One physical product.

Never confuse Product Identity with:

* Barcode
* Watermark
* QR code
* RFID

These are merely ways of expressing or verifying the Product Identity.

---

## Authentication Method

Definition

A technology capable of proving a Product Identity.

Examples

* Invisible Watermark
* NFC
* RFID
* Secure QR
* Laser Marking
* PUF
* Future technologies

Authentication Methods are interchangeable.

---

## Authentication Token

Definition

A compact cryptographic proof associated with a Product Identity.

Purpose

Enable authenticity verification.

Characteristics

* Small
* Secure
* Opaque
* Technology independent

Never treat Authentication Tokens as metadata containers.

---

## Authentication

Definition

The process of generating an authenticity proof.

Occurs once.

Typically during packaging generation.

---

## Verification

Definition

The process of determining whether a Product Identity is authentic.

Occurs many times.

Every verification produces a Trust Event.

---

## Verification Session

Definition

A single verification attempt.

Includes

* Image
* Timestamp
* Device
* Confidence
* Result

---

## Trust Event

Definition

A permanent record describing something that happened to a Product Identity.

Examples

Authentication Generated

Verified

Clone Suspected

Revoked

Ownership Changed

Warranty Activated

Trust Events are immutable.

Never modify history.

Append new events.

---

## Trust Timeline

Definition

Chronological collection of Trust Events.

Represents the lifecycle of a Product Identity.

---

## Trust Score

Definition

A calculated confidence indicator representing the health and authenticity of a Product Identity.

Examples

95

Likely Genuine

42

Suspicious

5

High Risk

Trust Scores evolve over time.

---

## Clone Detection Event

Definition

A Trust Event indicating suspicious duplication behavior.

Examples

Same product verified:

India

Germany

Brazil

within ten minutes.

---

## Verification Result

Enumeration

* Authentic
* Suspicious
* Counterfeit
* Revoked
* Unknown

Only these values should be used.

---

## Product Registry

Definition

The authoritative database containing all Product Identities.

Think of it as the "source of truth" for products.

---

## Trust Intelligence

Definition

Aggregated insights derived from Trust Events.

Examples

Counterfeit hotspots

Verification trends

Product health

Clone patterns

Regional activity

---

## Organization Administrator

Definition

A user responsible for managing an Organization.

---

## Project Manager

Definition

User responsible for managing Projects.

---

## Inspector

Definition

User responsible for performing verification.

---

## Consumer

Future role.

Limited verification access.

---

# Business Relationships

```
Organization
    owns
        Projects

Project
    produces
        Products

Product
    contains
        Batches

Batch
    creates
        Product Identities

Product Identity
    has
        Authentication

Product Identity
    receives
        Trust Events

Trust Events
    create
        Trust Intelligence
```

---

# Canonical Vocabulary

Always use

Product Identity

Never use

Hidden Product

Invisible Product

Digital Product

---

Always use

Verification

Never use

Validation

Authentication Check

Image Scan

---

Always use

Authentication

Never use

Encoding

Embedding

Watermarking

The implementation may perform watermarking.

The business process is Authentication.

---

Always use

Trust Event

Never use

Verification Record

Audit Event

History Item

---

Always use

Authentication Method

Never use

Watermark Type

Security Method

Encoding Method

---

# Domain Rules

A Product Identity belongs to exactly one Product.

A Product can produce many Product Identities.

A Verification never changes a Product Identity.

Every Verification creates one Trust Event.

Trust Events are immutable.

Authentication Methods are replaceable.

Business workflows should never depend on a specific Authentication Method.

Every Product Identity should remain valid throughout its lifecycle.

---

# Ubiquitous Language

When discussing the platform:

Say

"This Product Identity has three Trust Events."

Not

"This barcode has three scans."

---

Say

"Authenticate the Product Identity."

Not

"Generate the watermark."

---

Say

"Verify the Product."

Not

"Decode the hidden image."

---

Say

"Authentication Method."

Not

"Steganography."

---

The business language should always abstract implementation details.

---

# Closing Statement

This document defines the language of the platform.

Technology will evolve.

Architectures will change.

Authentication methods will improve.

The vocabulary defined here should remain stable.

A shared language enables consistent product thinking, scalable engineering, and reliable AI-assisted development across the lifetime of the platform.
