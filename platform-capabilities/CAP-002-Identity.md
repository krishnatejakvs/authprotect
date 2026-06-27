# CAP-002 Identity

Metadata

ID: CAP-002

Engine: Identity Engine

Maturity: L0

Depends On:

* CAP-001

Related ADRs:

* ADR-005 Product Identity

---

## Purpose

Create and manage Product Identities.

---

## Business Outcome

Every physical product receives a trusted digital identity.

---

## In Scope

* Products
* Batches
* Product Identities

---

## Out of Scope

* Authentication
* Verification

---

## Domain Objects

* Product
* Batch
* Product Identity

---

## Business Rules

BR-001

A Product may have many Batches.

BR-002

A Batch may create many Product Identities.

BR-003

A Product Identity belongs to exactly one Product.

BR-004

Product Identities are immutable.

---

## Inputs

* Product Metadata
* Batch Metadata

---

## Outputs

* Product Identity

---

## Produces Events

* ProductCreated
* BatchCreated
* ProductIdentityCreated

---

## Consumes Events

* ProjectCreated

---

## Upstream

* CAP-001 Administration

---

## Downstream

* CAP-003 Authentication

---

## Success Metrics

* Product Identities Created
* Identity Lookup Success Rate

---

## Current State

L0

Not Implemented

---

## Roadmap

L1

* Product Registry

L2

* Batch Management

L3

* Product Genealogy

L4

* Product Passport
