# TITAN Actor Identity Specification

## 1. Purpose

TITAN requires a stable architectural concept for identifying entities that may
participate in platform activities such as execution, signing, authorship,
validation, and provenance.

This specification defines the canonical identity of an actor and establishes
the semantic boundary between actor identity, actor classification, contextual
roles, authentication, authorization, cryptographic trust, and presentation.

The specification is intentionally small. It establishes a stable identity
foundation without requiring existing TITAN domains to migrate immediately.

## 2. Scope

This specification defines:

- the canonical `ActorIdentity` contract;
- the semantics of actor identity stability;
- the separation between identity and contextual participation;
- the relationship between actor identity and execution;
- the relationship between actor identity and signing/trust;
- the intended adoption model for existing and future domains.

This specification does not define a universal actor registry, actor taxonomy,
authentication system, authorization system, credential model, signing system,
or database representation.

## 3. Canonical Actor Identity

The canonical TITAN actor identity is:

ActorIdentity
└── id

The corresponding TypeScript contract is defined by `@titan/types`.

An actor identity identifies the underlying actor or entity itself. It does not
describe the actor's complete metadata, classification, roles, credentials,
trust relationships, or current activities.

## 4. Identity Semantics

### 4.1 `id`

`id` is the stable identifier of the actor or entity.

The identifier is opaque to the platform identity contract. TITAN does not impose
a universal identifier-generation mechanism.

The identifier must remain stable for the lifetime of the conceptual actor or
entity.

### 4.2 No semantic encoding requirement

The actor identifier must not require encoding of:

- actor type;
- role;
- organization;
- execution;
- timestamp;
- credential;
- signing key;
- database location.

These concerns remain outside the identity primitive.

## 5. Identity Stability

An actor identity must remain stable while the underlying conceptual actor or
entity remains the same.

Changes to presentation, metadata, organizational affiliation, roles,
credentials, or signing keys do not inherently require a new actor identity.

A distinct conceptual actor or entity requires a distinct identity.

## 6. Identity vs Classification

Actor identity answers:

"Which entity is this?"

Actor classification answers:

"What category does this entity belong to?"

Classification is deliberately separate from the canonical identity primitive.

Potential classifications such as Human, System, Organization, or Agent are
not frozen by this specification.

## 7. Identity vs Contextual Roles

An actor may participate in different contexts through different roles.

Examples include:

- Initiator
- Executor
- Signer
- Author
- Validator
- Owner

These roles must not be encoded into the actor identity itself.

One actor identity may participate through multiple roles.

## 8. Identity vs Execution

An execution represents an occurrence of computation or work.

Actor identity identifies an entity participating in that execution.

Therefore:

ActorIdentity ≠ Execution

An execution may eventually reference one or more actor identities through
contextual roles such as initiator or executor.

This specification does not define those execution-role fields.

## 9. Identity vs Cryptographic Trust

Cryptographic signing and trust are separate concerns from actor identity.

A signing system may associate a signer identifier and cryptographic key with
an entity, but signing credentials do not constitute the complete actor
identity contract.

Actor identity must therefore remain independent of:

- signing algorithms;
- public keys;
- private keys;
- key identifiers;
- signatures;
- trust state.

## 10. Identity vs Presentation

Display names, titles, descriptions, professional roles, and other presentation
properties are not canonical actor identity.

A display name may change without changing the actor identity.

## 11. Identity vs Organization

Organizational affiliation is contextual metadata or a relationship involving
an actor.

An organization name must not be embedded into the actor identifier.

This specification does not define organization membership or affiliation
semantics.

## 12. Identity vs Authentication and Authorization

Authentication establishes whether an actor can be associated with a claimed
identity.

Authorization determines what an authenticated actor may do.

Neither concern is part of the minimal `ActorIdentity` contract.

## 13. Existing TITAN Identity Concepts

Existing TITAN concepts such as platform identity, intelligence signer identity,
artifact authorship, and research provenance actors remain domain-specific.

They must not be silently replaced by this specification.

Future integrations may explicitly establish relationships between those
concepts and `ActorIdentity`.

## 14. Immutability

The identity identifier is stable.

Changes to actor metadata, classification, roles, credentials, or trust
relationships must not mutate the identity itself.

## 15. Non-Goals

This specification does not define:

- a universal actor taxonomy;
- Human/System/Agent/Organization enumeration;
- actor profiles;
- actor registry;
- organization model;
- authentication;
- authorization;
- credentials;
- cryptographic keys;
- signing;
- execution lifecycle;
- execution roles;
- provenance storage;
- database schema.

## 16. Design Principle

Actor identity should answer one question reliably:

"Which actor or entity is this?"

Everything else should be layered around that identity rather than embedded into
the identity primitive.
