# TITAN Resource Relationship

## 1. Purpose

`ResourceRelationship` is the canonical TITAN primitive for representing a
directed relationship assertion between two conceptual resources.

It connects existing `ResourceIdentity` objects without becoming a replacement
for resources, revisions, provenance, lineage, or domain-specific graph models.

## 2. Canonical Contract

```ts
interface ResourceRelationship {
  id: string;
  source: ResourceIdentity;
  target: ResourceIdentity;
  namespace: string;
  type: string;
  createdAt: string;
}
```

## 3. Relationship Identity

The relationship has its own stable `id`.

The relationship identifier represents the relationship assertion itself. It is
distinct from the identities of the source and target resources.

Relationship identifier generation is intentionally opaque to this contract.
The contract does not prescribe UUIDs, ULIDs, hashes, database sequences, or
another identifier-generation strategy.

## 4. Resource Endpoints

Both endpoints are complete `ResourceIdentity` values.

A resource identity consists of:

- `namespace`
- `type`
- `id`

An endpoint must not be reduced to an `id` alone.

Source and target resources may belong to different namespaces and types.

## 5. Directionality

Relationships are directed:

```text
source ── relationship ──> target
```

Reversing the source and target represents a different relationship assertion.

The canonical primitive does not assume that a relationship is symmetric.

## 6. Self Relationships

A relationship may connect a resource to itself:

```text
resource ── relationship ──> resource
```

The canonical primitive does not prohibit self-referential relationships.

A specific relationship vocabulary may impose stricter domain semantics.

## 7. Relationship Vocabulary

Relationship semantics are identified by the pair:

```text
namespace + type
```

The `namespace` identifies the vocabulary responsible for defining the
relationship semantics.

The `type` identifies a member of that vocabulary.

The canonical primitive does not require a globally closed relationship
vocabulary.

## 8. Vocabulary Semantics

The canonical primitive does not encode higher-order vocabulary semantics such
as:

- inverse relationships
- symmetry
- relationship hierarchy
- transitivity
- domain constraints
- range constraints

These may be represented by a future relationship vocabulary or ontology
capability.

## 9. Immutability

A `ResourceRelationship` represents an immutable relationship assertion.

Changing the source, target, namespace, or type represents a different
relationship assertion rather than an update to the existing assertion.

## 10. Temporal Semantics

`createdAt` records the time at which TITAN established or recorded the
relationship assertion.

It does not represent the time at which the underlying real-world relationship
necessarily became true.

Effective-time, validity intervals, observation time, and other temporal
semantics remain future capabilities.

## 11. Revisions

Relationships initially connect conceptual resources through `ResourceIdentity`.

They do not directly reference `ResourceRevision`.

A resource revision therefore does not inherently create a new relationship
identity.

Revision-aware relationship semantics may be introduced later if required.

## 12. Duplicate Assertions

Two relationship assertions with identical source, target, namespace, and type
are not automatically required to share the same relationship identity.

Independent systems or observations may establish semantically equivalent
assertions while retaining distinct identities and provenance.

Deduplication or semantic-equivalence analysis belongs to a higher-level
capability.

## 13. Separation of Concerns

`ResourceRelationship` does not contain:

- provenance
- lineage history
- validation
- status
- metadata
- confidence
- effective dates
- revision information
- execution information

Those concerns remain separate platform capabilities.

The intended conceptual structure is:

```text
ResourceIdentity
      │
      ▼
ResourceRelationship
      │
      ├── Provenance
      ├── Lineage
      ├── Validation
      ├── Temporal interpretation
      └── Derived graph/query models
```

## 14. Architectural Role

`ResourceRelationship` is a platform-level primitive.

Research lineage, artifact lineage, execution dependencies, data derivation,
model relationships, and future cross-domain graph structures may eventually
use this primitive.

Existing domain-specific relationship and lineage implementations should not
be mechanically replaced by this type.

Adoption should occur incrementally as each domain's semantics are understood.

## 15. Non-Goals

This foundation does not attempt to establish:

- a universal ontology
- a universal graph database
- a universal provenance schema
- temporal knowledge representation
- relationship inference
- automatic inverse generation
- relationship deduplication
- domain-specific relationship semantics

Those capabilities remain candidates for later architectural milestones.

## 16. Design Principle

The canonical relationship primitive should remain small.

TITAN should add richer semantics through explicit platform layers rather than
continuously expanding the foundational relationship object.

This preserves extensibility while preventing the canonical model from becoming
a premature universal ontology.
