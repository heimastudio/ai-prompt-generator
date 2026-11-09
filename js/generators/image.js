/* Generator prompt gambar. Fungsi murni: input + karakter -> hasil. */
(function (root) {
  const Skena = root.Skena;
  const { clean } = Skena.utils;
  const { describeCast, consistencyLine, sentence, paragraph } = Skena.gen;

  const DEFAULT_NEGATIVE = "blurry, low quality, distorted hands, extra fingers, watermark, text";

  function image(input, characters) {
    const cast = describeCast(characters);
    const subject = [cast, clean(input.subject)].filter(Boolean).join(", ");
    if (!subject) return { error: "Isi subjek atau pilih minimal satu karakter." };

    const p = {
      style: Skena.pick("imageStyles", input.style),
      shot: Skena.pick("shots", input.shot),
      angle: Skena.pick("angles", input.angle),
      lighting: Skena.pick("lighting", input.lighting),
      mood: Skena.pick("moods", input.mood),
      action: clean(input.action),
      location: clean(input.location),
      palette: clean(input.palette),
      details: clean(input.details),
    };
    const negative = clean(input.negative) || DEFAULT_NEGATIVE;
    const blocks = FORMATS[input.format](p, subject, characters, negative, input.ratio);

    return {
      type: "image",
      title: clean(input.subject) || characters.map(Skena.gen.shortName).join(", "),
      input,
      blocks,
      meta: [
        { label: "Format", value: Skena.labelOf("imageFormats", input.format) },
        { label: "Rasio", value: input.ratio },
        { label: "Karakter", value: String(characters.length) },
      ],
      notes: [],
      copyText: blocks.map((b) => b.text).join("\n\n"),
    };
  }

  const inLocation = (p) => (p.location ? "in " + p.location : "");
  const moodText = (p) => (p.mood ? p.mood + " mood" : "");

  const FORMATS = {
    natural(p, subject, characters, negative, ratio) {
      const text = paragraph(
        sentence(subject, p.action, inLocation(p)),
        p.style ? sentence("Style: " + p.style) : "",
        sentence(p.shot, p.angle),
        sentence(p.lighting, moodText(p)),
        p.palette ? sentence("Color palette: " + p.palette) : "",
        sentence(p.details),
        consistencyLine(characters),
        `Aspect ratio ${ratio}.`,
        sentence("Avoid " + negative)
      );
      return [{ label: "Prompt gambar", text }];
    },

    midjourney(p, subject, characters, negative, ratio) {
      const body = [subject, p.action, inLocation(p), p.style, p.shot, p.angle, p.lighting, moodText(p), p.palette && p.palette + " color palette", p.details]
        .filter(Boolean)
        .join(", ");
      return [{ label: "Prompt Midjourney", text: `${body} --ar ${ratio} --no ${negative}` }];
    },

    tags(p, subject, characters, negative) {
      const positive = [p.style, subject, p.action, p.location, p.shot, p.angle, p.lighting, p.mood, p.palette, p.details, "highly detailed"]
        .filter(Boolean)
        .join(", ");
      return [
        { label: "Prompt", text: positive },
        { label: "Negative prompt", text: negative },
      ];
    },
  };

  Skena.gen.image = image;
})(typeof window !== "undefined" ? window : globalThis);
