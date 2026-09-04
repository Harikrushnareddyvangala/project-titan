# TITAN Resource Identity Specification

## 1. Purpose

TITAN requires a stable architectural concept for identifying resources across
research, intelligence, data, machine learning, and future platform domains.

This specification defines the canonical identity of a TITAN resource and
establishes the semantic boundaries between resource identity, revision,
domain classification, provenance, lineage, execution, persistence, and
presentation.

The specification is intentionally small. It establishes a stable foundation
without requiring every existing TITAN domain to be migrated immediately.

## 2. Scope

This specification defines:

- the canonical `ResourceIdentity` contract;
- the semantics of `id`, `type`, and `namespace`;
- the separation between resource identity and resource revision;
- invariants governing resource identity;
- the relationship between resource identity and other TITAN concepts;
- the intended adoption model for existing and future domains.

This specification does not define a universal resource schema, universal
resource registry, execution model, provenance storage model, lineage storage
model, or database representation.

## 3. Canonical Resource Identity

The canonical TITAN resource identity is:

```text
ResourceIdentity
├── id
├── type
└── namespace
```

The corresponding TypeScript contract is defined by `@titan/types`.

A resource identity identifies the conceptual resource itself. It does not
describe the complete structure, state, storage representation, or revision
history of that resource.

## 4. Identity Semantics

### 4.1 `namespace`

`namespace` identifies the semantic domain that owns or defines the resource
type.

The namespace is a semantic boundary, not a database schema name, table name,
application route, UI category, or storage location.

Examples include:

```text
research
intelligence
data
ml
github
```

### 4.2 `type`

`type` identifies the canonical kind of resource within its namespace.

The value is intentionally represented as a string rather than a platform-wide
enumeration.

Examples include:

```text
namespace = research
type      = investigation

namespace = research
type      = experiment

namespace = research
type      = evidence

namespace = research
type      = finding

namespace = research
type      = conclusion

namespace = intelligence
type      = artifact

namespace = data
type      = dataset

namespace = ml
type      = model

namespace = github
type      = repository-snapshot
```

Resource types remain extensible as TITAN grows.

Domain-specific classifications must not be assumed to be universal TITAN
resource types.

For example, a research evidence classification such as `Repository`,
`Commit`, `File`, `Metric`, or `Analysis` is not automatically a TITAN
resource type.

Likewise, provenance entity classifications and intelligence artifact
classifications remain domain concepts unless explicitly promoted through a
future architectural decision.

### 4.3 `id`

`id` identifies the canonical resource within the identity namespace established
by the combination of `namespace` and `type`.

The mechanism used to generate and enforce identifier uniqueness is
domain- or platform-specific and is outside this specification.

The identity must remain stable for the lifetime of the conceptual resource.

A change to the resource's state, representation, or revision must not by
itself require a new conceptual resource identity.

## 5. Resource Revision

Resource identity and resource revision are separate concepts.

The canonical revision contract is:

ResourceRevision
├── resource
│   ├── id
│   ├── type
│   └── namespace
├── version
└── createdAt

`resource` references the complete stable conceptual resource identity.

This deliberately preserves the full identity scope of `namespace`, `type`, and
`id`. A revision must not rely on `id` alone being globally unique.

`version` identifies a particular revision of that resource and is treated by
the platform as opaque.

TITAN does not impose a universal versioning scheme at this layer.

For example, both of the following may be valid:

1

and:

1.0.0

The interpretation of a revision belongs to the resource domain unless a
future platform-level versioning specification establishes otherwise.

## 6. Identity Invariants

The following invariants apply to the canonical resource identity.

### 6.1 Stability

A resource identity must remain stable across revisions of the same
conceptual resource.

### 6.2 Semantic ownership

A namespace identifies the semantic owner of a resource type.

### 6.3 Canonical type

A type identifies the canonical kind of resource within its namespace.

### 6.4 No database coupling

A resource identity must not depend on a particular database table,
persistence technology, storage engine, or physical location.

### 6.5 No presentation coupling

A resource identity must not depend on a UI component, route, display label,
or presentation-specific classification.

### 6.6 Revision separation

Revision information must remain conceptually separate from the stable
resource identity.

### 6.7 Extensibility

The identity model must permit future TITAN resource domains without requiring
a modification to a central resource-type enumeration.

## 7. Resource Identity vs Other TITAN Concepts

Resource Identity is deliberately distinct from several related concepts.

### 7.1 Domain classification

A domain classification describes how a domain understands a resource.

It is not automatically equivalent to a TITAN resource type.

### 7.2 Database representation

A database table represents persisted state.

A table name is not a canonical resource identity.

Multiple persistence mechanisms may represent the same conceptual resource
without changing its identity.

### 7.3 Provenance

Provenance describes how or why a resource or state came to exist.

Provenance is not the identity of the resource.

### 7.4 Lineage

Lineage connects resources and executions through relationships.

Lineage is not itself a resource identity.

### 7.5 Execution

An execution or run represents an occurrence of computation or work.

Executions may consume and produce resources and may emit observations,
metrics, or events.

Execution identity is therefore distinct from resource identity.

### 7.6 Presentation

A UI representation may display, group, or label a resource differently
without changing its canonical identity.

## 8. Existing TITAN Domains

Existing TITAN domains retain ownership of their domain models.

Resource Identity is a bridge and architectural projection rather than an
immediate replacement for existing domain interfaces.

For example:

```text
Research Investigation
        ↓
ResourceIdentity
research / investigation / <stable-id>
```

and:

```text
Intelligence Artifact
        ↓
ResourceIdentity
intelligence / artifact / <stable-id>
```

The existence of a `ResourceIdentity` contract does not require immediate
retrofit of every existing interface.

Existing domain identifiers remain authoritative within their domains until
an explicit adoption milestone migrates them.

## 9. Future Resource Domains

The model is intended to support future TITAN domains including, but not
limited to:

- datasets;
- documents;
- repositories and repository snapshots;
- machine-learning models;
- model versions;
- experiments;
- analytical artifacts;
- scientific resources;
- external data resources;
- future platform resources.

Adding a new resource domain should not require changing the fundamental
`ResourceIdentity` structure.

## 10. Adoption Strategy

Adoption should occur incrementally.

The initial platform contract is implemented in:

```text
packages/types/src/resource.ts
```

The canonical public exports are provided through:

```text
packages/types/src/index.ts
```

Existing domains should adopt the identity contract when a concrete
cross-domain requirement justifies doing so.

Adoption should prioritize resources that participate in:

- cross-domain relationships;
- provenance;
- lineage;
- execution inputs or outputs;
- durable artifacts;
- scientific measurement;
- analytical or operational workflows.

A domain should not be migrated merely for consistency if no architectural
benefit exists.

## 11. Non-Goals

This specification does not introduce:

- a universal `ResourceType` enum;
- a universal `ResourceReference` structure;
- a universal `TitanRegistry`;
- a universal execution identity;
- a universal provenance identity;
- a universal lineage storage implementation;
- a graph database;
- database views or materialized views;
- a universal resource payload schema;
- immediate migration of existing domain models;
- a requirement that every database table correspond to a resource;
- a requirement that every resource have a dedicated database table.

These concerns may be addressed by future architectural specifications when
actual platform requirements justify them.

## 12. Architectural Principle

TITAN should treat resource identity as a stable semantic foundation rather
than as a storage or presentation mechanism.

The intended conceptual architecture is:

```text
Resource Identity
       ↓
    Resource
       ↓
 Relationships
       ↓
   Provenance
       ↓
    Lineage
       ↓
 Derived Graph / Query
```

Execution provides an additional temporal and computational dimension:

```text
Resource
       ↓
Execution / Run
       ↓
consumes / produces
       ↓
Resource
```

The identity layer therefore remains deliberately small while providing a
stable foundation for increasingly sophisticated TITAN systems.
