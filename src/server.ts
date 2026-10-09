import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { loadConfig } from "./config.js";
import {
  auditZombieStoryPrompt,
  buildZombieLoveBrief,
  getZombieLoveResources,
  planZombieReunionStoryboard,
} from "./toolkit.js";

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const instructions = "Zombie Love Story MCP is a deterministic, read-only text planner. It does not inspect or upload photos, connect accounts or billing, access media history, call providers, or generate or submit video. The matching local source tree is a visual prototype; consult the live public site for current published product information. This MCP does not verify upload, generation, payment, or output quality. Require photo permission and consent, keep stories original, gentle, and non-graphic, and do not imply affiliation with aizombie.net.";
const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

const storyWorld = z.enum(["snowy-cabin", "rain-soaked-city", "ruined-chapel", "custom"]);

export function createServer() {
  const config = loadConfig();
  const server = new McpServer(
    { name: "zombie-love-story-mcp", version: "1.0.0" },
    { instructions },
  );

  server.registerTool(
    "build_zombie_love_brief",
    {
      title: "Build an original Zombie Love story brief",
      description:
        "Draft a gentle reveal-and-reunion story with distinct photo roles, a selected setting, and rights and consent checks.",
      inputSchema: z.object({
        relationship: z.enum(["partner", "friend", "family", "pet"]),
        turningSubject: z.string().min(1).max(300),
        survivorSubject: z.string().min(1).max(300),
        storyWorld,
        memoryDetail: z.string().max(500).optional(),
        mood: z.string().max(300).optional(),
        photoRightsConfirmed: z.boolean(),
        depictedPeopleConsentConfirmed: z.boolean(),
        originalStoryConfirmed: z.boolean(),
      }),
      annotations,
    },
    async (params) => text(buildZombieLoveBrief(params)),
  );

  server.registerTool(
    "plan_zombie_reunion_storyboard",
    {
      title: "Plan a five-beat Zombie Love storyboard",
      description:
        "Create a timed encounter, reveal, recognition, reunion, and memory outline with continuity safeguards.",
      inputSchema: z.object({
        durationSeconds: z.number().positive().max(60),
        storyWorld,
        memoryDetail: z.string().max(500).optional(),
      }),
      annotations,
    },
    async (params) => text(planZombieReunionStoryboard(params)),
  );

  server.registerTool(
    "audit_zombie_story_prompt",
    {
      title: "Audit a Zombie Love story prompt",
      description:
        "Check for missing permissions, missing consent, copied creative work, or graphic horror directions.",
      inputSchema: z.object({
        prompt: z.string().max(20_000),
        photoRightsConfirmed: z.boolean(),
        depictedPeopleConsentConfirmed: z.boolean(),
        originalStoryConfirmed: z.boolean(),
      }),
      annotations,
    },
    async (params) => text(auditZombieStoryPrompt(params)),
  );

  server.registerTool(
    "get_zombie_love_resources",
    {
      title: "Get Zombie Love resources",
      description:
        "Return public story, photo-guide, examples, and policy URLs without fetching external content or asserting generation availability.",
      inputSchema: z.object({
        topic: z.enum(["all", "create", "story", "photo-guide", "examples", "policy"]).default("all"),
      }),
      annotations,
    },
    async ({ topic }) =>
      text({
        topic,
        resources: getZombieLoveResources(config.appBaseUrl, topic),
        rawSkillUrl: `${config.appBaseUrl}/skills/zombie-love-story-planner/SKILL.md`,
        mcpSource: "https://github.com/gpt-img-2/zombie-love-story-mcp",
        productCapabilityNote:
          "The public pages provide published product information. This MCP does not test whether upload, generation, payment, or media-history operations work.",
      }),
  );

  return server;
}
