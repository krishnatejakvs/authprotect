# CAP-003 Authentication

Metadata

ID: CAP-003

Engine: Authentication Engine

Maturity: L0

Depends On:

* CAP-002

Related ADRs:

* ADR-004 Authentication Philosophy

---

## Purpose

Generate authenticity proofs for Product Identities.

---

## Business Outcome

Enable manufacturers to prove that a product originated from an authorized source.

---

## In Scope

* Authentication Tokens
* Authentication Policies
* Authentication Methods

---

## Out of Scope

* Verification
* Trust Analytics

---

## Domain Objects

* Authentication Token
* Authentication Method

---

## Business Rules

BR-001

Authentication Tokens must never contain business metadata.

BR-002

Authentication Tokens must be derived from Product Identity data.

BR-003

Authentication Methods are replaceable.

BR-004

Authentication Tokens must be cryptographically verifiable.

BR-005

Authentication generation occurs once per Product Identity.

---

## Inputs

* Product Identity
* Authentication Policy

---

## Outputs

* Authentication Token

---

## Produces Events

* AuthenticationGenerated

---

## Consumes Events

* ProductIdentityCreated

---

## Upstream

* CAP-002 Identity

---

## Downstream

* CAP-004 Verification

---

## Success Metrics

* Tokens Generated
* Generation Success Rate
* Authentication Latency

---

## Current State

L0

Not Implemented

---

## Roadmap

L1

* HMAC Authentication

L2

* Key Rotation

L3

* Multiple Authentication Methods

L4

* NFC
* RFID
* Secure QR

L5

* Adaptive Authentication Policies
