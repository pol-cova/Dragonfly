export const copy = {
  presenters: ["Paul Contreras", "Manuel Contreras"],
  hackathon: "Midnight Hackathon",
  product: "DRAGONFLY",
  tagline: "private CTF drops on Midnight",
  liveUrl: "dragonfly.paulcontre.com",
  liveUrlHref: "https://dragonfly.paulcontre.com",

  intro: {
    greeting:
      "We are Paul Contreras and Manuel Contreras — and this is our submission for the Midnight Hackathon!",
    voiceFile: "voice/Dragonfly-intro.m4a",
    productLine: "DRAGONFLY",
    sub: "Solve the challenge. Prove it privately. Claim the Wing.",
  },

  hook: {
    lines: [
      "Limited-time Drops.",
      "Personalized Flights.",
      "Unique Wings.",
    ],
    punch: "Competitive gaming where your strategy stays yours.",
  },

  productDemo: {
    headline: "Live product demo",
    slides: [
      {
        image: "product/01-home.png",
        caption: "Browse active Drops — pick Cipher Nest and begin a Flight.",
        label: "01 · Drops",
      },
      {
        image: "product/03-stage1.png",
        caption:
          "Three personalized stages — recon, crypto, reconstruct the signal.",
        label: "02 · Flight",
      },
      {
        image: "product/04-solvers.png",
        caption:
          "Solvers board shows alias + Wing only — never your answers.",
        label: "03 · Solvers",
      },
    ],
  },

  privacy: {
    headline: "Privacy by design",
    points: [
      "Convex validates stages — answers never hit the board.",
      "One-shot credential released only to your session.",
      "Claim uses a local referee today.",
      "Midnight claimWing circuit built for on-chain next.",
    ],
    honest: "Credentials stay off the public solver board.",
  },

  wing: {
    headline: "Claim your Wing",
    alias: "DRGN-26E3",
    status: "verified",
    board: "Solvers board — alias + Wing only.",
  },

  close: {
    vision: "Recurring CTF events. University challenges. Security training.",
    cta: "Play the live demo",
    repo: "github.com/pol-cova/Dragonfly",
  },
} as const;
