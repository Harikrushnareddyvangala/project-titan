import type {
    IntelligenceArtifact,
    IntelligenceArtifactTrustAssessment,
} from "@/types/intelligence";

import {
    verifyIntelligenceArtifact,
} from "./artifactRegistry";

import {
    verifyArtifactTrust,
} from "./trustService";

import {
    getTrustedPublicKey,
} from "./trustStore";

import {
    evaluateArtifactTrust,
} from "./artifactTrustPolicy";

/* -------------------------------------------------------------------------- */
/*                         Artifact Trust Assessment                          */
/* -------------------------------------------------------------------------- */

export async function assessArtifactTrust(
    artifact: IntelligenceArtifact,
): Promise<IntelligenceArtifactTrustAssessment> {
    /*
     * Integrity is evaluated first.
     */
    const integrityVerified =
        artifact.integrity
            ? await verifyIntelligenceArtifact(
                  artifact.artifactId,
              )
            : false;

    /*
     * No signature means the artifact cannot
     * be cryptographically trusted.
     */
    if (!artifact.signature) {
        return evaluateArtifactTrust({
            artifact,
            integrityVerified,
            signatureVerified: false,
            trustedKeyAvailable: false,
        });
    }

    /*
     * Preserve the signer identity and key identity.
     *
     * The trust store expects this object rather
     * than a raw keyId string.
     */
    const signatureIdentity = {
        signerId:
            artifact.signature.signerId,

        ...(artifact.signature.keyId
            ? {
                  keyId:
                      artifact.signature.keyId,
              }
            : {}),
    };

    /*
     * Resolve the trusted public key.
     */
    const publicKey =
        await getTrustedPublicKey(
            signatureIdentity,
        );

    /*
     * A signature can exist while its signer/key
     * is no longer trusted.
     */
    if (!publicKey) {
        return evaluateArtifactTrust({
            artifact,
            integrityVerified,
            signatureVerified: false,
            trustedKeyAvailable: false,
        });
    }

    /*
     * Cryptographically verify the signature.
     */
    const signatureVerified =
        await verifyArtifactTrust(
            artifact,
            publicKey,
        );

    /*
     * Convert the raw verification results
     * into the TITAN trust-policy state.
     */
    return evaluateArtifactTrust({
        artifact,
        integrityVerified,
        signatureVerified,
        trustedKeyAvailable: true,
    });
}