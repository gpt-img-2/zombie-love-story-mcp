export type ResourceTopic =
  | "all"
  | "create"
  | "story"
  | "photo-guide"
  | "examples"
  | "policy";

const worldDescriptions = {
  "snowy-cabin": "a quiet snow-covered cabin, with warm window light against the cold exterior",
  "rain-soaked-city": "a rain-soaked city street with soft reflections and restrained atmosphere",
  "ruined-chapel": "a weathered chapel with open space, dust, and a gentle shaft of light",
  custom: "a user-described original setting",
} as const;

function clean(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

const beats = [
  ["Encounter", "Establish a quiet, tense setting and show the survivor waiting."],
  ["Reveal", "Introduce the changed loved one with one familiar visual detail."],
  ["Recognition", "Use a pause and a small reaction to make recognition readable."],
  ["Reunion", "Let the survivor choose to approach; keep the movement gentle."],
  ["Memory", "Resolve on a warmer original moment tied to the shared memory."],
] as const;

export function buildZombieLoveBrief(params: {
  relationship: "partner" | "friend" | "family" | "pet";
  turningSubject: string;
  survivorSubject: string;
  storyWorld: keyof typeof worldDescriptions;
  memoryDetail?: string | undefined;
  mood?: string | undefined;
  photoRightsConfirmed: boolean;
  depictedPeopleConsentConfirmed: boolean;
  originalStoryConfirmed: boolean;
}) {
  const turningSubject = clean(params.turningSubject);
  const survivorSubject = clean(params.survivorSubject);
  const memoryDetail = clean(params.memoryDetail);
  const blockers = [
    !turningSubject ? "Describe who or what is turning." : "",
    !survivorSubject ? "Describe the survivor." : "",
    !params.photoRightsConfirmed
      ? "Confirm permission for any reference photos before using them in another tool."
      : "",
    !params.depictedPeopleConsentConfirmed
      ? "Confirm consent from every depicted person."
      : "",
    !params.originalStoryConfirmed
      ? "Confirm this will be an original scene rather than a copy of an existing video or artwork."
      : "",
  ].filter(Boolean);
  const prompt = [
    `Create an original, gentle zombie-reunion story about a ${params.relationship}.`,
    `The turning subject is ${turningSubject}; the survivor is ${survivorSubject}.`,
    `Set it in ${worldDescriptions[params.storyWorld]}.`,
    memoryDetail ? `Use this personal memory detail: ${memoryDetail}.` : "Use one small, user-provided memory detail if available.",
    clean(params.mood) ? `Emotional tone: ${clean(params.mood)}.` : "Keep the mood suspenseful but tender.",
    "Move through encounter, reveal, recognition, reunion, and a warm memory. Keep character traits consistent and the transformation stylized and non-graphic.",
    "Use original staging and camera coverage. Do not copy a particular video, artwork, character, or sequence of frames.",
  ].join(" ");
  return {
    ready: blockers.length === 0,
    blockers,
    visualBrief: prompt,
    photoRoles: { turningSubject, survivorSubject },
    relationship: params.relationship,
    storyWorld: params.storyWorld,
    storyBeats: beats.map(([beat, direction], index) => ({ beat: index + 1, title: beat, direction })),
    boundary:
      "Text planning only. This MCP does not inspect or upload photos, connect accounts or billing, generate video, call providers, or access media history.",
  };
}

export function planZombieReunionStoryboard(params: {
  durationSeconds: number;
  storyWorld: keyof typeof worldDescriptions;
  memoryDetail?: string | undefined;
}) {
  const slot = Math.floor((params.durationSeconds * 100) / beats.length) / 100;
  let elapsed = 0;
  const storyboard = beats.map(([title, direction], index) => {
    const startSeconds = Number(elapsed.toFixed(2));
    const beatDuration = index === beats.length - 1
      ? Number((params.durationSeconds - elapsed).toFixed(2))
      : slot;
    elapsed += beatDuration;
    return {
      beat: index + 1,
      title,
      startSeconds,
      durationSeconds: beatDuration,
      direction: index === beats.length - 1 && clean(params.memoryDetail)
        ? `${direction} Memory cue: ${clean(params.memoryDetail)}.`
        : direction,
    };
  });
  return {
    ready: params.durationSeconds > 0 && storyboard.every((beat) => beat.durationSeconds > 0),
    durationSeconds: params.durationSeconds,
    setting: worldDescriptions[params.storyWorld],
    storyboard,
    continuity: [
      "Keep the turning subject's familiar detail visible after the reveal.",
      "Preserve who is the survivor and who is approaching; do not swap roles.",
      "Keep the transformation stylized and non-graphic; emphasize recognition over threat.",
    ],
    note:
      "This is a text storyboard only. The matching local project is a visual prototype and does not submit or generate video.",
  };
}

const copyRisk = /exact (?:copy|recreation)|copy (?:the|that) (?:original|video|artwork)|same (?:frames|shots)|recreate (?:this|that|the) (?:video|scene|character)/i;
const graphicRisk = /gore|graphic dismemberment|explicit gore|graphic injury|visceral blood/i;

export function auditZombieStoryPrompt(params: {
  prompt: string;
  photoRightsConfirmed: boolean;
  depictedPeopleConsentConfirmed: boolean;
  originalStoryConfirmed: boolean;
}) {
  const prompt = clean(params.prompt);
  const blockers = [
    !prompt ? "A story prompt is required." : "",
    !params.photoRightsConfirmed ? "Permission for reference photos has not been confirmed." : "",
    !params.depictedPeopleConsentConfirmed ? "Consent from depicted people has not been confirmed." : "",
    !params.originalStoryConfirmed ? "Original staging and story details have not been confirmed." : "",
  ].filter(Boolean);
  const warnings = [
    copyRisk.test(prompt)
      ? "The wording may request a copied video, scene, character, artwork, or frame sequence. Rework it as a new story."
      : "",
    graphicRisk.test(prompt)
      ? "The prompt asks for graphic horror. This planner is designed for stylized, non-graphic reunion stories."
      : "",
    prompt.length > 2500 ? "The prompt is long; shorten it for easier review and editing." : "",
  ].filter(Boolean);
  return {
    ready: blockers.length === 0,
    blockers,
    warnings,
    checks: {
      hasRecognitionBeat: /recogn|familiar|memory|reunion/i.test(prompt),
      hasNonGraphicDirection: /non-graphic|gentle|stylized/i.test(prompt),
      hasOriginalityDirection: /original|fresh|new/i.test(prompt),
    },
    nextStep: blockers.length
      ? "Resolve every permission and consent blocker before using this concept."
      : warnings.length
        ? "Review warnings and keep the story original and non-graphic."
        : "This text passed structural checks; it is not proof of rights or live product capability.",
  };
}

const resources = [
  { topic: "create", title: "Zombie Love Studio", path: "/", purpose: "Open the public project homepage." },
  { topic: "story", title: "AI Zombie Story Trend Guide", path: "/ai-zombie-trend", purpose: "Review the reveal, recognition, reunion, and memory story arc." },
  { topic: "photo-guide", title: "Photo Role Guide", path: "/ai-zombie-photo-guide", purpose: "Read public guidance on distinct subject roles and photo consent." },
  { topic: "examples", title: "Zombie Story Concept Previews", path: "/ai-zombie-video-examples", purpose: "Review illustrative visual directions, not customer generations." },
  { topic: "policy", title: "About", path: "/about", purpose: "Review project identity and context." },
  { topic: "policy", title: "Privacy Policy", path: "/privacy", purpose: "Review current public privacy terms." },
  { topic: "policy", title: "Terms of Service", path: "/terms", purpose: "Review current public usage terms." },
] as const;

export function getZombieLoveResources(appBaseUrl: string, topic: ResourceTopic) {
  return resources
    .filter((item) => topic === "all" || item.topic === topic)
    .map((item) => ({ ...item, url: `${appBaseUrl}${item.path}` }));
}
