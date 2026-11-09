/* Dipakai semua generator: merangkai kalimat dan blok karakter. */
(function (root) {
  const Skena = root.Skena;
  const { clean, capitalize } = Skena.utils;

  /** Satu deskripsi lengkap yang diulang persis di setiap prompt agar visual konsisten. */
  function characterBlock(c) {
    const parts = [
      c.descriptor,
      c.face,
      c.hair,
      c.body,
      c.outfit && "wearing " + c.outfit,
      c.accessories && "with " + c.accessories,
    ]
      .map(clean)
      .filter(Boolean);
    const name = shortName(c);
    return parts.length ? `${name} (${parts.join("; ")})` : name;
  }

  /** "Sari (contoh)" -> "Sari" supaya catatan tidak ikut ke prompt. */
  function shortName(c) {
    return clean(c.name).replace(/\s*\(.*?\)\s*/g, "") || "the character";
  }

  function joinNames(list) {
    if (list.length < 2) return list[0] || "";
    return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
  }

  function describeCast(characters) {
    return joinNames(characters.map(characterBlock));
  }

  function consistencyLine(characters) {
    if (!characters.length) return "";
    const names = joinNames(characters.map(shortName));
    return `Keep ${names} visually identical in every shot: same face, hair, body and outfit.`;
  }

  /** Rangkai kalimat: bagian kosong dilewati, huruf awal besar, diakhiri titik. */
  function sentence(...parts) {
    const text = parts.map(clean).filter(Boolean).join(", ").replace(/[.,;:]+$/, "");
    return text ? capitalize(text) + "." : "";
  }

  function paragraph(...sentences) {
    return sentences.filter(Boolean).join(" ");
  }

  Skena.gen = Skena.gen || {};
  Object.assign(Skena.gen, { characterBlock, shortName, joinNames, describeCast, consistencyLine, sentence, paragraph });
})(typeof window !== "undefined" ? window : globalThis);
