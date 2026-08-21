import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the India Startup Map homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>India Startup Map/);
  assert.match(html, /Explore India/);
  assert.match(html, /LIVE ECOSYSTEM MAP/);
  assert.match(html, /Remote companies/);
  assert.match(html, /github\.com\/srbmaury\/India-Startup-Map/);
  assert.match(html, /locations need review/);
  assert.doesNotMatch(html, /codex-preview|Building your site|Starter Project/);
});

test("ships the core directory routes and verified datasets", async () => {
  const [data, homepage, remote, tech, hosting] = await Promise.all([
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/remote/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/tech/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(data, /mappedStartups/);
  assert.match(data, /locationUnverifiedStartups/);
  assert.match(data, /remoteWork/);
  assert.match(data, /bangaloreMapCompanies/);
  assert.match(homepage, /cityToSlug/);
  assert.match(remote, /REMOTE WORK \/ EVIDENCE-LABELLED/);
  assert.match(tech, /VERIFIED CLAIMS ONLY/);
  assert.doesNotThrow(() => JSON.parse(hosting));
});

test("protects admin while leaving the public directory anonymous", async () => {
  const publicResponse = await render("/explore");
  assert.equal(publicResponse.status, 200);
  const adminResponse = await render("/admin");
  assert.ok([302, 307, 308].includes(adminResponse.status));
  assert.match(adminResponse.headers.get("location") ?? "", /^\/signin-with-chatgpt\?/);
  const reviewResponse = await render("/admin/review/swiggy?issue=location");
  assert.ok([302, 307, 308].includes(reviewResponse.status));
});
