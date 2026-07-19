import {
  computeCredentialCommitment,
  normalizeAnswer,
  randomHex,
  type StageContent,
} from "@dragonfly/shared";

export interface DropManifest {
  id: string;
  name: string;
  story: string;
  opensAt: string;
  closesAt: string;
  difficulty: string;
  badgeTheme: string;
}

export interface GeneratedFlight {
  publicSeed: string;
  completionCredential: string;
  credentialCommitment: string;
  privatePlayerSecret: string;
  stage1: StageContent;
  stage1Answer: string;
  stage2Answer: string;
  stage3Answer: string;
  fragmentA: string;
  fragmentB: string;
}

function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

function deriveCipherKey(publicSeed: string): string {
  return publicSeed.slice(0, 8).toUpperCase();
}

function applySubstitution(input: string, key: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shift = key.charCodeAt(0) % 26;
  return input
    .toUpperCase()
    .split("")
    .map((char) => {
      const idx = alphabet.indexOf(char);
      if (idx === -1) return char;
      return alphabet[(idx + shift) % 26];
    })
    .join("");
}

function reverseSubstitution(cipher: string, key: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shift = key.charCodeAt(0) % 26;
  return cipher
    .split("")
    .map((char) => {
      const idx = alphabet.indexOf(char);
      if (idx === -1) return char;
      return alphabet[(idx - shift + 26) % 26];
    })
    .join("");
}

const RECON_LOCATIONS = [
  { channel: "waveform", marker: "phase-7" },
  { channel: "metadata", marker: "exif:comment" },
  { channel: "response", marker: "x-signal-fragment" },
  { channel: "source", marker: "line-42" },
];

const CORE_CLUES = ["trace", "origin", "vector", "pulse"];

export function buildStage1(publicSeed: string, fragmentA: string): StageContent {
  const location = RECON_LOCATIONS[seededIndex(publicSeed, RECON_LOCATIONS.length)];

  return {
    number: 1,
    title: "Recon",
    narrative:
      "An unidentified transmission has appeared inside Dragonfly. Trace the hidden fragment before the signal fades.",
    objective: "Locate Fragment A inside the transmission interface.",
    hint: `Inspect the ${location.channel} channel for an anomaly.`,
    payload: {
      location,
      waveform: publicSeed.repeat(3).slice(0, 48),
      metadataHint: location.marker,
      fragmentPreview: fragmentA.slice(0, 4),
      hiddenFragment: fragmentA,
      channel: location.channel,
    },
  };
}

export function generateFlight(
  dropId: string,
  flightId: string,
): GeneratedFlight {
  const publicSeed = randomHex(16);
  const completionCredential = randomHex(32);
  const privatePlayerSecret = randomHex(32);
  const credentialCommitment = computeCredentialCommitment(
    dropId,
    flightId,
    completionCredential,
  );

  const fragmentA = `SIG-${publicSeed.slice(0, 6).toUpperCase()}`;
  const cipherKey = deriveCipherKey(publicSeed);
  const plaintextB = `NODE-${publicSeed.slice(6, 12).toUpperCase()}`;
  const fragmentB = applySubstitution(plaintextB, cipherKey);
  const coreClue = CORE_CLUES[seededIndex(publicSeed, CORE_CLUES.length)];
  const stage3Answer = `${fragmentA}:${fragmentB}:${publicSeed.slice(-4)}:${coreClue}`;

  const stage1 = buildStage1(publicSeed, fragmentA);

  return {
    publicSeed,
    completionCredential,
    credentialCommitment,
    privatePlayerSecret,
    stage1,
    stage1Answer: fragmentA,
    stage2Answer: plaintextB,
    stage3Answer: normalizeAnswer(stage3Answer),
    fragmentA,
    fragmentB,
  };
}

export function buildStage2(
  publicSeed: string,
  fragmentA: string,
): StageContent {
  const cipherKey = deriveCipherKey(publicSeed);
  const plaintextB = `NODE-${publicSeed.slice(6, 12).toUpperCase()}`;
  const fragmentB = applySubstitution(plaintextB, cipherKey);

  return {
    number: 2,
    title: "Cryptography",
    narrative:
      "Fragment A unlocks a cipher layer. Decode the scrambled node identifier using your Flight key.",
    objective: "Decode Fragment B from the cipher grid.",
    hint: `Your Flight key is ${cipherKey}. Shift each letter backward through the alphabet.`,
    payload: {
      fragmentA,
      cipherKey,
      cipherText: fragmentB,
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    },
  };
}

export function buildStage3(
  publicSeed: string,
  fragmentA: string,
  fragmentB: string,
): StageContent {
  const coreClue = CORE_CLUES[seededIndex(publicSeed, CORE_CLUES.length)];

  return {
    number: 3,
    title: "The Core",
    narrative:
      "Reconstruct the source command inside the simulated terminal. Combine every fragment and your Flight signature.",
    objective: "Enter the full signal sequence.",
    hint: `Format: FRAGA:FRAGB:tail:clue — clue is "${coreClue}".`,
    payload: {
      fragmentA,
      fragmentB,
      flightTail: publicSeed.slice(-4),
      coreClue,
      terminalPrompt: "dragonfly@signal:~$ reconstruct --silent",
    },
  };
}

export function validateStageAnswer(
  stage: number,
  answer: string,
  generated: Pick<
    GeneratedFlight,
    "stage1Answer" | "stage2Answer" | "stage3Answer" | "publicSeed" | "fragmentA"
  >,
): boolean {
  const normalized = normalizeAnswer(answer);

  if (stage === 1) {
    return normalized === normalizeAnswer(generated.stage1Answer);
  }

  if (stage === 2) {
    return normalized === normalizeAnswer(generated.stage2Answer);
  }

  if (stage === 3) {
    return normalized === generated.stage3Answer;
  }

  return false;
}

export { reverseSubstitution, deriveCipherKey };
