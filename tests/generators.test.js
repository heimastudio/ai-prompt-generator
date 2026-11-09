/* Jalankan: node --test tests/*.test.js */
const test = require("node:test");
const assert = require("node:assert");

for (const file of ["core/utils", "data/options", "generators/shared", "generators/image", "generators/veo", "generators/lyrics", "generators/storyboard"]) {
  require(`../js/${file}.js`);
}
const { gen } = globalThis.Skena;

const sari = { name: "Sari (contoh)", descriptor: "a Javanese woman", hair: "long black hair", outfit: "yellow kebaya" };

test("gambar: karakter masuk ke prompt tanpa catatan nama", () => {
  const r = gen.image({ format: "natural", style: "cinematic", ratio: "16:9", action: "smiling" }, [sari]);
  assert.match(r.copyText, /Sari \(a Javanese woman; long black hair; wearing yellow kebaya\)/);
  assert.doesNotMatch(r.copyText, /contoh/);
});

test("gambar: format Midjourney memakai parameter", () => {
  const r = gen.image({ format: "midjourney", style: "anime", ratio: "9:16", subject: "a cat" }, []);
  assert.match(r.copyText, /--ar 9:16 --no /);
});

test("gambar: Stable Diffusion memisahkan negative prompt", () => {
  const r = gen.image({ format: "tags", style: "anime", ratio: "1:1", subject: "a cat", negative: "dogs" }, []);
  assert.deepStrictEqual(r.blocks[1], { label: "Negative prompt", text: "dogs" });
});

test("gambar: subjek kosong ditolak", () => {
  assert.ok(gen.image({ format: "natural", ratio: "1:1" }, []).error);
});

test("veo: dialog, SFX, dan ambient memakai format Veo", () => {
  const r = gen.veo({ subject: "a man", action: "he waves", shot: "wide", camera: "pan", style: "cinematic", audio: "on", dialogue: 'Halo "kamu"', language: "Javanese", sfx: "horn", ambient: "rain", duration: "8", ratio: "16:9" }, []);
  const text = r.blocks[0].text;
  assert.match(text, /^Wide shot with a smooth pan: a man\./);
  assert.match(text, /says in Javanese: "Halo 'kamu'"/);
  assert.match(text, /\nSFX: horn\nAmbient noise: rain/);
  assert.doesNotMatch(text, /16:9/);
});

test("veo: audio mati menghapus semua baris audio", () => {
  const r = gen.veo({ subject: "a man", action: "waves", camera: "pan", style: "cinematic", audio: "off", dialogue: "Halo", sfx: "horn", duration: "4", ratio: "9:16" }, []);
  assert.doesNotMatch(r.blocks[0].text, /SFX|says/);
});

test("veo: dialog kepanjangan diberi peringatan", () => {
  const r = gen.veo({ subject: "a", action: "b", camera: "pan", style: "cinematic", audio: "on", dialogue: Array(30).fill("kata").join(" "), duration: "4", ratio: "16:9" }, []);
  assert.strictEqual(r.notes.length, 1);
});

test("lirik: membaca label, bagian instrumental, dan bait kosong", () => {
  const s = gen.parseLyrics("[Intro]\n\n[Verse 1]\nsatu\ndua\n\nReff:\ntiga\n\n(Outro)");
  assert.deepStrictEqual(s.map((x) => x.kind), ["intro", "verse", "chorus", "outro"]);
});

test("lirik: bait tanpa label yang berulang dianggap reff", () => {
  const s = gen.parseLyrics("a\nb\n\nc\nd\n\nc\nd");
  assert.deepStrictEqual(s.map((x) => x.kind), ["verse", "chorus", "chorus"]);
});

test("lirik: motif dikenali utuh per kata dalam tiga bahasa", () => {
  const ids = (t) => gen.findMotifs(t).map((m) => m.id);
  assert.ok(ids("Udan tiba ing wayah wengi").includes("hujan"));
  assert.ok(ids("Rindu ini").includes("kangen"));
  assert.ok(ids("the moon, tonight").includes("bulan"));
  assert.ok(ids("Air mata jatuh").includes("tangis"));
  assert.ok(!ids("perjalanan").includes("jalan"));
});

test("storyboard: timecode berurutan dan karakter di tiap adegan", () => {
  const r = gen.storyboard({ lyrics: "[Intro]\n\n[Verse]\nUdan tiba\nAku nangis\n\n[Reff]\nTresnoku", duration: "6", lineGroup: "1", style: "koplo", mode: "mix", ratio: "9:16", location: "a station" }, [sari]);
  assert.strictEqual(r.scenes.length, 4);
  assert.deepStrictEqual(r.scenes.map((s) => s.start), [0, 6, 12, 18]);
  assert.ok(r.scenes.every((s) => s.veoPrompt.includes("wearing yellow kebaya")));
  assert.ok(r.scenes[3].performing && !r.scenes[1].performing);
  assert.ok(r.scenes.every((s) => !/undefined|null/.test(s.imagePrompt + s.veoPrompt)));
  assert.strictEqual(r.meta[1].value, "00:24");
});

test("storyboard: dua baris per adegan", () => {
  const r = gen.storyboard({ lyrics: "a\nb\nc", duration: "4", lineGroup: "2", style: "koplo", mode: "story", ratio: "16:9" }, []);
  assert.deepStrictEqual(r.scenes.map((s) => s.lyric), ["a / b", "c"]);
});

test("storyboard: lirik kosong ditolak", () => {
  assert.ok(gen.storyboard({ lyrics: "  ", duration: "8" }, []).error);
});
