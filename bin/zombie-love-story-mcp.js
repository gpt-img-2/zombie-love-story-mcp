#!/usr/bin/env node

import("../dist/index.js").catch((error) => {
  console.error("Zombie Love Story MCP failed to start:", error);
  process.exit(1);
});
