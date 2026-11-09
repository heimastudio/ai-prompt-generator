# Skena Prompt Studio

Aplikasi web untuk menyusun prompt AI dengan karakter yang konsisten. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa build step, tanpa API key.

## Fitur

- **Prompt gambar**: format Gemini/Imagen/ChatGPT, Midjourney, serta Stable Diffusion/FLUX.
- **Prompt Google Veo**: kamera, aksi, gaya, dialog, `SFX:`, `Ambient noise:`, negative prompt, dan setting model (4/6/8 detik, 16:9 atau 9:16).
- **Storyboard dari lirik**: membaca `[Intro]`, `[Verse]`, `[Reff]`, `[Bridge]`, `[Outro]`, mengenali motif dari kata kunci Indonesia, Jawa, dan Inggris, lalu membuat shot, timecode, prompt gambar, dan prompt Veo per adegan.
- **Database karakter**: deskripsi yang sama persis otomatis masuk ke setiap prompt.
- **Salin prompt** per blok, per adegan, atau seluruh storyboard.
- **Riwayat**: cari, filter, salin, buka lagi, hapus.
- Tampilan responsif dengan tema terang dan gelap.

## Cara menjalankan

Buka `index.html` di browser. Bisa juga di-hosting statis, misalnya GitHub Pages.

Data karakter dan riwayat tersimpan di `localStorage` browser yang dipakai, jadi tidak ikut pindah ke perangkat lain dan hilang kalau data browser dibersihkan.

## Struktur

```
index.html            Kerangka dan urutan script
assets/               Ikon
css/
  tokens.css          Warna, font, jarak (mulai ubah tampilan dari sini)
  base.css            Reset dan tipografi
  layout.css          Rel navigasi dan grid halaman
  components.css      Tombol, form, chip, slate, dialog
  views.css           Gaya khusus storyboard, karakter, riwayat
js/
  core/utils.js       Helper dan namespace window.Skena
  core/store.js       Penyimpanan (localStorage dengan cadangan memori)
  core/ui.js          Form deklaratif, salin, toast, dialog, slate
  data/options.js     Semua preset pilihan
  generators/         Logika prompt: fungsi murni tanpa akses DOM
  views/              Satu file per halaman
  app.js              Router hash dan inisialisasi
tests/                Tes generator
```

Script dimuat sebagai `<script defer>` biasa supaya aplikasi tetap jalan saat dibuka langsung dari file. Urutannya diatur di `index.html`.

## Cara mengembangkan

| Mau menambah | Ubah |
| --- | --- |
| Preset gaya, lensa, gerak kamera | Satu baris di `js/data/options.js` |
| Kata kunci atau motif lirik | Array `MOTIFS` di `js/generators/lyrics.js` |
| Ritme shot per bagian lagu | `DIRECTION` di `js/generators/storyboard.js` |
| Format prompt untuk model baru | `FORMATS` di `js/generators/image.js`, lalu daftarkan di `imageFormats` |
| Halaman baru | File di `js/views/`, script di `index.html`, nama rute di `ROUTES` pada `js/app.js` |
| Backend atau sinkronisasi | `read()` dan `write()` di `js/core/store.js` |

Generator AI sungguhan bisa dipasang dengan mengganti fungsi `generate` yang dikirim ke `Skena.studio()`. Bentuk hasilnya tetap `{ type, title, input, blocks, meta, notes, copyText }`.

## Tes

```bash
node --test tests/*.test.js
```
