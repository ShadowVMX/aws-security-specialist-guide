"use strict";
const fs = require("fs");
const urls = fs.readFileSync(__dirname + "/.candidates.tmp.txt", "utf8").trim().split("\n");
(async () => {
  for (const u of urls) {
    try {
      const r = await fetch(u, { redirect: "follow", headers: { "user-agent": "probe" } });
      const html = await r.text();
      const h = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || ["", ""])[1]
        .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const moved = r.url.replace(/#.*$/, "") !== u;
      console.log(`${r.status}\t${moved ? "REDIR->" + r.url : "OK   "}\t${u}\n\t\th1: ${h}`);
    } catch (e) {
      console.log(`ERR\t${e.message}\t${u}`);
    }
  }
})();
