# Engineering Principles & AI Development Guide

| Field   | Value                                               |
| ------- | --------------------------------------------------- |
| Product | Product Trust Platform (Working Name: AuthPrint AI) |
| Version | 0.1                                                 |
| Status  | Living Document                                     |

---

# Purpose

This document defines how the platform should be engineered.

It exists to ensure consistency across:

* Human engineers
* AI coding agents
* Code reviews
* Architecture decisions
* OpenSpec implementations

This document should be consulted before implementing any feature.

---

# Engineering Philosophy

The codebase should reflect the business architecture.

Business concepts should drive implementation.

Technology choices should support business capabilities rather than dictate them.

Always optimize for:

* Maintainability
* Clarity
* Modularity
* Testability
* Evolution

---

# AI-First Development

The platform is designed to be developed collaboratively by humans and AI coding agents.

Every implementation should be understandable without requiring prior conversation context.

Assume each coding task is executed independently.

Therefore:

* Every feature must have complete specifications.
* Every feature must have acceptance criteria.
* Every feature must reference the Product Context documents.
* No feature should rely on undocumented assumptions.

---

# OpenSpec-Driven Development

OpenSpec is the source of truth for implementation.

Code is an implementation of specifications.

Never allow code to become the primary documentation.

Feature lifecycle:

Proposal
→ Approved Spec
→ Tasks
→ Implementation
→ Review
→ Release

---

# Architectural Rules

Business logic must remain independent of:

* UI
* Database
* Framework
* Authentication technology
* Infrastructure

Implementation details should never leak into business models.

---

# Domain-Driven Design

Code organization should follow business capabilities.

Avoid organizing by technical layers.

Prefer bounded contexts such as:

* Administration
* Identity
* Authentication
* Verification
* Trust
* Intelligence
* Integration

Each context owns:

* Business rules
* Models
* APIs
* Events

---

# Product Identity is the Core Aggregate

Every implementation should recognize Product Identity as the central business entity.

Do not duplicate identity information across services.

All workflows should reference Product Identity.

---

# Modular Monolith First

The first implementation should be a modular monolith.

Benefits:

* Simpler deployment
* Faster development
* Easier debugging
* Lower operational overhead

The architecture should remain ready for future service extraction.

---

# Event-Oriented Thinking

Whenever possible, model important business actions as events.

Examples:

* ProductIdentityCreated
* AuthenticationGenerated
* VerificationCompleted
* TrustEventRecorded
* CloneDetected

Events represent business history.

---

# Simplicity Over Cleverness

Readable code is preferred over clever code.

Avoid unnecessary abstractions.

Optimize for future contributors.

---

# Security Principles

Never implement custom cryptography.

Use proven libraries.

Never expose secrets.

Never trust client input.

Fail securely.

Audit sensitive operations.

---

# Testing Philosophy

Every feature should include:

* Unit tests
* Integration tests
* Acceptance tests

Business rules are more important than implementation coverage.

Test behaviors, not implementation details.

---

# AI Coding Guidelines

Every AI-generated pull request should:

* Implement only the requested scope.
* Avoid speculative features.
* Preserve backward compatibility.
* Include documentation updates.
* Include tests.
* Follow naming conventions.
* Avoid introducing new dependencies without justification.

---

# Code Review Checklist

Before merging:

* Does it satisfy the OpenSpec?
* Does it follow Product Principles?
* Does it preserve Domain Model terminology?
* Are tests included?
* Are edge cases handled?
* Is documentation updated?
* Is the implementation modular?

---

# Definition of Done

A feature is complete only when:

* Specification is implemented.
* Tests pass.
* Documentation is updated.
* Acceptance criteria are met.
* Product terminology is preserved.
* Code review is completed.

Code alone does not constitute completion.
