# AI Tele Bot Landing Page

Template landing page single file (vanilla HTML/CSS/JS) buat jualan AI Telegram Bot.

## Isi utama
- Hero + demo chat
- Cara kerja
- Fitur (profiling + penentuan trade)
- Pricing (1, 6, 12 bulan) + benefit per paket
- FAQ
- CTA ke Telegram

## Ganti link Telegram
Klik tombol "Pilih paket" lalu isi link Telegram bot atau admin.
Link akan disimpan di browser (localStorage).

Kalau mau hardcode:
- Buka `assets/js/main.js`
- Ubah `defaultLinks.telegram`

## Jalankan lokal
Cukup double click `index.html`.
Atau pakai server lokal:
- VSCode Live Server
- `python -m http.server`

## Upload ke GitHub Pages
- Push folder ini ke repo
- Settings -> Pages -> Deploy from branch (root)
