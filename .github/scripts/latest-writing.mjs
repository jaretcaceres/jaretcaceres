import { readFile, writeFile } from "node:fs/promises";

const FEED_URL = "https://jaret.es/feed.json";
const README = new URL("../../README.md", import.meta.url);
const START = "<!-- writing:start -->";
const END = "<!-- writing:end -->";
const LIMIT = 5;

const response = await fetch(FEED_URL, { headers: { accept: "application/feed+json" } });
if (!response.ok) throw new Error(`${FEED_URL} respondió ${response.status}`);

const { items } = await response.json();
if (!Array.isArray(items) || items.length === 0) throw new Error("El feed no tiene escritos");

const formatDate = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Atlantic/Canary",
});

const list = items
  .slice(0, LIMIT)
  .map((item) => `- [${item.title}](${item.url}) · <sub>${formatDate.format(new Date(item.date_published))}</sub>`)
  .join("\n");

const readme = await readFile(README, "utf8");
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start === -1 || end < start) throw new Error("No encuentro los marcadores de escritos en el README");

const next = `${readme.slice(0, start + START.length)}\n${list}\n${readme.slice(end)}`;
if (next !== readme) await writeFile(README, next);
