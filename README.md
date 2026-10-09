# Zombie Love Story MCP

Deterministic, read-only MCP tools and an OpenClaw Skill for planning original, gentle zombie-reunion story concepts. Draft a visual brief, structure a five-beat storyboard, review consent and prompt risks, and find public Zombie Love resources.

This is a text-only planner. It does not inspect or upload photos, generate or submit video, call an AI provider, connect accounts or billing, or access media history. The matching local source tree is a visual prototype; consult the live public site for its current published product information. This repository does not verify upload, generation, payment, or output quality.

The project identity is Zombie Love Studio. Keep it independent from similarly named services; do not imply affiliation with aizombie.net.

## Install

```bash
npx -y github:gpt-img-2/zombie-love-story-mcp
```

## MCP tools

- `build_zombie_love_brief` — draft a respectful reveal-and-reunion premise with consent checks.
- `plan_zombie_reunion_storyboard` — create a timed five-beat outline and check its duration.
- `audit_zombie_story_prompt` — flag missing permissions, copied scenes, or graphic directions.
- `get_zombie_love_resources` — return public reference pages and the raw Skill URL.

The server is read-only and makes no network calls. Set `ZOMBIE_LOVE_BASE_URL` only when testing a different site origin.

## OpenClaw

```bash
openclaw mcp add zombie-love-story \
  --command npx \
  --arg -y \
  --arg github:gpt-img-2/zombie-love-story-mcp \
  --include 'build_zombie_love_brief,plan_zombie_reunion_storyboard,audit_zombie_story_prompt,get_zombie_love_resources'
```

The standalone Skill is in [`openclaw/zombie-love-story-planner/SKILL.md`](openclaw/zombie-love-story-planner/SKILL.md).

## Development

```bash
pnpm install
pnpm validate
```

Public reference pages: [aizombie.art](https://aizombie.art). Verify current site availability and terms directly; this repository does not attest to a live generator or checkout.
