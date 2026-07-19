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

export interface Stage1Payload {
  location: { channel: string; marker: string };
  waveform: string;
  metadataHint: string;
  channel: string;
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

type DropFlavor = {
  recon: string;
  crypto: string;
  core: string;
  terminal: string;
};

const DEFAULT_FLAVOR: DropFlavor = {
  recon:
    "An unidentified transmission has appeared inside Dragonfly. Trace the hidden fragment before the signal fades.",
  crypto:
    "Fragment A unlocks a cipher layer. Decode the scrambled node identifier using your Flight key.",
  core: "Reconstruct the source command inside the simulated terminal. Combine every fragment and your Flight signature.",
  terminal: "dragonfly@signal:~$ reconstruct --silent",
};

const DROP_FLAVORS: Record<string, DropFlavor> = {
  "drop-001": DEFAULT_FLAVOR,
  "drop-002": {
    recon:
      "A ghost carrier is bleeding through dead channels. Pull Fragment A out of the noise floor before the hop resets.",
    crypto:
      "The ghost left a scrambled node tag. Use your Flight key to reverse the substitution and name the phantom.",
    core: "Pin the ghost in the null terminal. Assemble FRAGA:FRAGB:tail:clue before the frequency collapses.",
    terminal: "dragonfly@ghost:~$ lock --frequency",
  },
  "drop-003": {
    recon:
      "Training nest online. Find Fragment A tucked in the transmission — beginner-friendly, still personal to your Flight.",
    crypto:
      "Warm up the cipher. Decode Fragment B with the printed Flight key; every nest uses a different shift.",
    core: "Graduate the nest. Enter the full reconstruct sequence and hatch your first Wing of the week.",
    terminal: "dragonfly@nest:~$ hatch --signal",
  },
  "drop-004": {
    recon:
      "The mirror shows the same signal twice — once true, once inverted. Locate the real Fragment A in the reflection.",
    crypto:
      "Cipher text is a mirror of Fragment B. Shift backward with your Flight key until the node identifier reads clean.",
    core: "Only the full reflection opens the protocol. Reconstruct the mirrored sequence in the terminal.",
    terminal: "dragonfly@mirror:~$ reflect --protocol",
  },
  "drop-005": {
    recon:
      "Embers pulse in short bursts. Snatch Fragment A from the relay metadata before the heat dies.",
    crypto:
      "The relay encrypts Fragment B under your Flight key. Decode fast — midweek windows don't wait.",
    core: "Stamp the relay log. Reconstruct the ember sequence and claim before the Drop cools.",
    terminal: "dragonfly@ember:~$ relay --claim",
  },
  "drop-006": {
    recon:
      "Null Harbor has no registry entry. Scan the berth channels for Fragment A left by the unregistered vessel.",
    crypto:
      "Harbor customs use a substitution seal. Decode Fragment B with your Flight key to prove you boarded.",
    core: "Dock silently. Reconstruct the harbor key sequence without publishing how you found it.",
    terminal: "dragonfly@harbor:~$ dock --null",
  },
  "drop-007": {
    recon:
      "The lattice is drifting out of phase. Capture Fragment A from the unstable waveform before the weekend window ends.",
    crypto:
      "Phase-lock the cipher. Decode Fragment B so the lattice can re-align to your Flight key.",
    core: "Stabilize the lattice. Enter the full sequence and lock the final Wing of the week.",
    terminal: "dragonfly@lattice:~$ stabilize --drift",
  },
};

function flavorFor(dropId?: string): DropFlavor {
  if (!dropId) return DEFAULT_FLAVOR;
  return DROP_FLAVORS[dropId] ?? DEFAULT_FLAVOR;
}

export function deriveStage1ExtractIndices(
  marker: string,
  waveformLength: number,
  count: number,
): number[] {
  let seed = 0;
  for (let i = 0; i < marker.length; i++) {
    seed = (seed * 31 + marker.charCodeAt(i)) >>> 0;
  }
  const indices: number[] = [];
  const used = new Set<number>();
  while (indices.length < count && used.size < waveformLength) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const index = seed % waveformLength;
    if (!used.has(index)) {
      used.add(index);
      indices.push(index);
    }
  }
  return indices;
}

function embedFragmentBody(
  noise: string,
  fragmentBody: string,
  indices: number[],
): string {
  const chars = noise.split("");
  for (let i = 0; i < fragmentBody.length; i++) {
    chars[indices[i]!] = fragmentBody[i]!;
  }
  return chars.join("");
}

export function decodeStage1Fragment(payload: Stage1Payload): string {
  const bodyLength = 6;
  const indices = deriveStage1ExtractIndices(
    payload.metadataHint,
    payload.waveform.length,
    bodyLength,
  );
  const body = indices.map((index) => payload.waveform[index]).join("");
  return `SIG-${body.toUpperCase()}`;
}

export function buildStage1(
  publicSeed: string,
  fragmentA: string,
  dropId?: string,
): StageContent {
  const location = RECON_LOCATIONS[seededIndex(publicSeed, RECON_LOCATIONS.length)];
  const fragmentBody = fragmentA.replace(/^SIG-/i, "");
  const noise = publicSeed.repeat(3).slice(0, 48);
  const indices = deriveStage1ExtractIndices(
    location.marker,
    noise.length,
    fragmentBody.length,
  );
  const waveform = embedFragmentBody(noise, fragmentBody, indices);
  const flavor = flavorFor(dropId);

  return {
    number: 1,
    title: "Recon",
    narrative: flavor.recon,
    objective: "Locate Fragment A inside the transmission interface.",
    hint: `Inspect the ${location.channel} channel for an anomaly (${location.marker}).`,
    payload: {
      location,
      waveform,
      metadataHint: location.marker,
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

  const fragmentA = `SIG-${randomHex(3).toUpperCase()}`;
  const cipherKey = deriveCipherKey(publicSeed);
  const plaintextB = `NODE-${publicSeed.slice(6, 12).toUpperCase()}`;
  const fragmentB = applySubstitution(plaintextB, cipherKey);
  const coreClue = CORE_CLUES[seededIndex(publicSeed, CORE_CLUES.length)];
  const stage3Answer = `${fragmentA}:${fragmentB}:${publicSeed.slice(-4)}:${coreClue}`;

  const stage1 = buildStage1(publicSeed, fragmentA, dropId);

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
  dropId?: string,
): StageContent {
  const cipherKey = deriveCipherKey(publicSeed);
  const plaintextB = `NODE-${publicSeed.slice(6, 12).toUpperCase()}`;
  const fragmentB = applySubstitution(plaintextB, cipherKey);
  const flavor = flavorFor(dropId);

  return {
    number: 2,
    title: "Cryptography",
    narrative: flavor.crypto,
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
  dropId?: string,
): StageContent {
  const coreClue = CORE_CLUES[seededIndex(publicSeed, CORE_CLUES.length)];
  const flavor = flavorFor(dropId);

  return {
    number: 3,
    title: "The Core",
    narrative: flavor.core,
    objective: "Enter the full signal sequence.",
    hint: `Format: FRAGA:FRAGB:tail:clue — clue is "${coreClue}".`,
    payload: {
      fragmentA,
      fragmentB,
      flightTail: publicSeed.slice(-4),
      coreClue,
      terminalPrompt: flavor.terminal,
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
