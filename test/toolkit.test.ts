import assert from "node:assert/strict";
import test from "node:test";
import {
  auditZombieStoryPrompt,
  buildZombieLoveBrief,
  getZombieLoveResources,
  planZombieReunionStoryboard,
} from "../src/toolkit.js";

test("brief blocks without photo permission, consent, and originality", () => {
  const result = buildZombieLoveBrief({
    relationship: "partner",
    turningSubject: "a traveler",
    survivorSubject: "their partner",
    storyWorld: "snowy-cabin",
    photoRightsConfirmed: false,
    depictedPeopleConsentConfirmed: false,
    originalStoryConfirmed: false,
  });
  assert.equal(result.ready, false);
  assert.equal(result.blockers.length, 3);
  assert.match(result.boundary, /does not inspect or upload photos/);
});

test("brief includes original, non-graphic reunion beats", () => {
  const result = buildZombieLoveBrief({
    relationship: "pet",
    turningSubject: "a dog with a blue collar",
    survivorSubject: "the dog's person",
    storyWorld: "rain-soaked-city",
    memoryDetail: "a favorite red ball",
    photoRightsConfirmed: true,
    depictedPeopleConsentConfirmed: true,
    originalStoryConfirmed: true,
  });
  assert.equal(result.ready, true);
  assert.match(result.visualBrief, /non-graphic/);
  assert.equal(result.storyBeats.length, 5);
});

test("storyboard timing matches requested duration", () => {
  const result = planZombieReunionStoryboard({
    durationSeconds: 15,
    storyWorld: "ruined-chapel",
    memoryDetail: "a paper lantern",
  });
  assert.equal(result.storyboard.length, 5);
  assert.equal(Number(result.storyboard.reduce((sum, beat) => sum + beat.durationSeconds, 0).toFixed(2)), 15);
  assert.match(result.storyboard[4]?.direction || "", /a paper lantern/);
});

test("prompt audit flags copied and graphic requests", () => {
  const result = auditZombieStoryPrompt({
    prompt: "Recreate the scene exactly with graphic dismemberment",
    photoRightsConfirmed: true,
    depictedPeopleConsentConfirmed: true,
    originalStoryConfirmed: true,
  });
  assert.equal(result.ready, true);
  assert.equal(result.warnings.length, 2);
});

test("resources are built from the configured origin", () => {
  const result = getZombieLoveResources("https://aizombie.art", "photo-guide");
  assert.equal(result.length, 1);
  assert.equal(result[0]?.url, "https://aizombie.art/ai-zombie-photo-guide");
});
