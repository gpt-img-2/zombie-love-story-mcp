export type ZombieLoveConfig = { appBaseUrl: string };

function parseBaseUrl(value: string | undefined) {
  const candidate = (value || "https://aizombie.art")
    .trim()
    .replace(/\/+$/, "");
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Zombie Love base URL must use http or https.");
  }
  return url.toString().replace(/\/+$/, "");
}

export function loadConfig(): ZombieLoveConfig {
  return { appBaseUrl: parseBaseUrl(process.env.ZOMBIE_LOVE_BASE_URL) };
}
