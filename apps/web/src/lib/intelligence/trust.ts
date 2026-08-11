import type {
  IntelligenceSignerType,
} from "@/types/intelligence";

/* -------------------------------------------------------------------------- */
/*                         Intelligence Signer                                */
/* -------------------------------------------------------------------------- */

export interface IntelligenceSigner {
  signerId: string;

  signerName: string;

  signerType: IntelligenceSignerType;
}

/* -------------------------------------------------------------------------- */
/*                         Primary TITAN Signer                               */
/* -------------------------------------------------------------------------- */

export const TITAN_PRIMARY_SIGNER:
  IntelligenceSigner = {
  signerId:
    "titan-harikrushnareddy",

  signerName:
    "Harikrushnareddy Vangala",

  signerType:
    "Human",
};