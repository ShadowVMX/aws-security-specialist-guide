"use strict";
const URLS = [
  ["SC-100", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-100"],
  ["SC-500", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-500"],
  ["SC-500 exam page", "https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-500/"],
];
function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<li[^>]*>/gi, "\n  - ")
    .replace(/<\/(p|div|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}
(async () => {
  for (const [name, url] of URLS) {
    console.log(`\n########## ${name} — ${url}`);
    try {
      const r = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 study-guide-fetch" } });
      console.log(`HTTP ${r.status}  final: ${r.url}`);
      if (!r.ok) continue;
      const body = text(await r.text());
      // el outline empieza en "Skills measured" / "Skills at a glance"
      const i = body.search(/Skills (measured|at a glance)/i);
      console.log(body.slice(i > 0 ? i : 0, (i > 0 ? i : 0) + 14000));
    } catch (e) {
      console.log("ERROR " + e.message);
    }
  }
})();
