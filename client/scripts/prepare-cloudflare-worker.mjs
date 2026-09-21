import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/** Keep publishing to https://mokayaj857-letter-client.ltrboxx.workers.dev/ */
const WORKER_NAME = "mokayaj857-letter-client";

const wranglerPath = resolve(process.cwd(), ".output/server/wrangler.json");
if (!existsSync(wranglerPath)) {
  console.error("Missing .output/server/wrangler.json. Run npm run build first.");
  process.exit(1);
}

const config = JSON.parse(readFileSync(wranglerPath, "utf8"));
config.name = WORKER_NAME;
config.workers_dev = true;
if (config.assets?.directory) {
  config.assets.directory = "../public";
}

writeFileSync(wranglerPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Cloudflare worker name locked to ${WORKER_NAME}`);
