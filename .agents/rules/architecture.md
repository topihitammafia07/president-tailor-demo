---
trigger: always_on
description: "Arsitektur dan batasan stack President Tailor Next.js Laravel"
---

- Wajib baca root `AGENTS.md`, `PRD.md`, `RULES.md`, `UI_UX.md`, `AUDIT.md` sebelum development.
- `api/` Laravel 13 + MySQL, `landing/` Next.js App Router + TS, `internal/` Next.js App Router + TS.
- Tidak boleh mengganti Next.js dengan Vite/SPA tersendiri, atau memindahkan akses database ke Next.js.
- Implementasikan satu fase AUDIT.md per instruksi, bukti tes nyata; hentikan pada gate.
- Jangan menciptakan informasi owner atau fitur pembayaran/laporan omzet/stok/booking di luar PRD.
- Pertanyaan bisnis yang belum terkonfirmasi harus berada di `docs/DECISIONS.md`.
