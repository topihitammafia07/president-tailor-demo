---
trigger: always_on
description: "Keamanan data pelanggan, session Sanctum, database, dan larangan tindakan production"
---

- Seluruh API customer/order dan dashboard harus diautentikasi dan diotorisasi **pada Laravel**; Next UI guard hanya untuk UX.
- Gunakan Sanctum cookie-session dengan CSRF dan credentials, CORS exact origin, stateful domains; jangan simpan JWT/token di localStorage.
- Lakukan validasi FormRequest, query Eloquent aman, transaction atomic, no raw SQL concatenation, output escaped.
- Hindari PII dalam logging, caching publik, HTML publik, fixture produksi, dan screenshot yang dibagikan.
- Jangan menjalankan tindakan destruktif database/deploy pada server produksi tanpa izin user eksplisit.
- Jangan klaim aman 100%; audit dengan bukti testing aktual.
