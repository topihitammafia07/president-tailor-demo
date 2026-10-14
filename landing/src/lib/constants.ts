// Data and Constants for President Tailor Landing Page
// Note: In accordance with antislop R-02, no em dash characters are used in any text.

export const BRAND = {
  name: 'President Tailor',
  tagline: 'Keahlian Jahit Pria Presisi di Sukoharjo',
  city: 'Sukoharjo',
  province: 'Jawa Tengah',
  address: 'Sukoharjo, Jawa Tengah, Indonesia',
  hours: 'Senin - Sabtu: 09.00 - 20.00 WIB (Minggu dengan konfirmasi)',
  phoneDisplay: 'Konsultasi via WhatsApp',
};

// WhatsApp prefilled message helper
export function getWhatsAppUrl(contextMessage?: string): string {
  const baseNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const defaultText =
    'Halo President Tailor, saya ingin berkonsultasi mengenai pembuatan pakaian pria (jas / batik / celana panjang).';
  const text = contextMessage || defaultText;
  const encodedText = encodeURIComponent(text);

  if (baseNumber) {
    const cleanNumber = baseNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

export const SERVICES = [
  {
    id: 'jas',
    title: 'Jas Formal & Acara Khusus',
    subtitle: 'Potongan proporsional yang menyatu sempurna dengan postur tubuh Anda.',
    image: '/images/service-jas.jpg',
    description:
      'Setiap jas dirancang dengan konstruksi bantalan bahu yang seimbang, jatuhnya kain yang tegas, dan lapel yang presisi untuk kebutuhan bisnis, dinas, maupun pesta pernikahan.',
    highlights: [
      'Konstruksi bahu presisi tanpa efek kaku',
      'Pilihan single-breasted & double-breasted',
      'Furing dalam nyaman dan tidak panas',
      'Proporsi panjang jas disesuaikan dengan tinggi badan',
    ],
    recommendedFor: 'Pernikahan, acara formal kenegaraan, wisuda, pertemuan bisnis resmi.',
  },
  {
    id: 'hem-batik',
    title: 'Hem Batik Pola Presisi',
    subtitle: 'Sambungan motif simetris dari kerah, kancing, hingga saku.',
    image: '/images/service-batik.jpg',
    description:
      'Keahlian memotong kain batik memerlukan ketelitian tinggi agar motif tumpal, parang, atau geometris menyambung mulus di bagian dada dan saku tanpa terputus sembarangan.',
    highlights: [
      'Pencocokan pola motif batik secara simetris',
      'Lapisan furing katun adem yang rapi dan menyerap keringat',
      'Kerah kemeja tegak dan tidak mudah melipat',
      'Potongan lengan dan lingkar dada pas bergerak',
    ],
    recommendedFor: 'Pakaian kerja kantor harian, resepsi, pertemuan keluarga, seragam dinas.',
  },
  {
    id: 'celana-panjang',
    title: 'Celana Panjang Presisi',
    subtitle: 'Kenyamanan duduk dan berjalan dengan jatuhnya pipa celana yang rapi.',
    image: '/images/service-celana.jpg',
    description:
      'Celana dengan lingkar pinggang pas tanpa rasa sesak saat duduk, kemiringan pesak yang nyaman, dan panjang ujung celana yang jatuh elegan di atas sepatu.',
    highlights: [
      'Pola pesak disesuaikan dengan kenyamanan melangkah',
      'Pilihan potongan regular fit atau slim fit rapi',
      'Penguat saku dan jahitan tindas tahan lama',
      'Panjang celana akurat sesuai jenis sepatu yang digunakan',
    ],
    recommendedFor: 'Setelan jas, setelan hem batik, celana kantor harian, celana santai formal.',
  },
];

export const PAIN_POINTS = [
  {
    issue: 'Baju Jadi Sering Tidak Pas di Bahu',
    detail:
      'Pakaian siap pakai di toko sering kali terlalu sempit di dada jika bahunya pas, atau bahunya melorot jika lingkar dadanya cukup.',
    solution:
      'Di President Tailor, lebar bahu dan lingkar dada diukur tersendiri sehingga postur tampak tegap alami.',
  },
  {
    issue: 'Motif Batik Terpotong Sembarangan',
    detail:
      'Batik siap pakai sering kali motifnya terputus di tengah kancing atau saku sehingga mengurangi nilai keindahan kain batik bernilai tinggi.',
    solution:
      'Kain batik dipotong secara cermat mengikuti alur pola utama agar tersambung harmonis dari kiri ke kanan.',
  },
  {
    issue: 'Celana Terlalu Ketat Saat Duduk',
    detail:
      'Banyak celana terasa pas saat berdiri, namun menekan perut atau menarik paha saat duduk di kursi kerja maupun mobil.',
    solution:
      'Pola pesak dan lingkar paha dihitung dengan toleransi gerak alami untuk kenyamanan sepanjang hari.',
  },
];

export const OCCASIONS = [
  {
    title: 'Pernikahan & Resepsi',
    subtitle: 'Momen Istimewa Seumur Hidup',
    description:
      'Jas pengantin pria atau hem batik keluarga yang anggun, memberikan rasa percaya diri penuh saat di pelaminan maupun menyambut tamu.',
  },
  {
    title: 'Acara Kedinasan & Kantor',
    subtitle: 'Citra Profesional Berwibawa',
    description:
      'Pakaian kerja harian dan seragam formal yang tahan dipakai seharian, tetap rapi meski beraktivitas padat dari pagi hingga sore.',
  },
  {
    title: 'Wisuda & Pertemuan Resmi',
    subtitle: 'Tampil Rapi di Depan Kolega',
    description:
      'Setelan jas atau kemeja batik yang pas di foto wisuda dan pertemuan penting, tidak terlihat kebesaran atau kekecilan.',
  },
  {
    title: 'Acara Adat & Silaturahmi',
    subtitle: 'Kearifan Tradisi Berkelas',
    description:
      'Kemeja batik dengan bahan pilihan yang nyaman untuk silaturahmi hari raya, arisan keluarga besar, dan perayaan adat.',
  },
];

export const ORDER_STEPS = [
  {
    step: '01',
    title: 'Konsultasi Kebutuhan',
    desc: 'Hubungi via WhatsApp atau kunjungi workshop di Sukoharjo untuk menyampaikan jenis pakaian, tanggal acara, serta referensi model.',
  },
  {
    step: '02',
    title: 'Pengukuran & Konfirmasi',
    desc: 'Pencatatan ukuran fisik secara mendalam mencakup bahu, dada, panjang tangan, pinggang, hingga jatuhnya kain sesuai preferensi Anda.',
  },
  {
    step: '03',
    title: 'Proses Penjahitan',
    desc: 'Kain dipotong dan dijahit dengan teknik tradisional penuh ketelitian, mulai dari pembentukan pola, furing, hingga jahitan detail.',
  },
  {
    step: '04',
    title: 'Penyelesaian & Pengambilan',
    desc: 'Pakaian dicek kualitasnya secara menyeluruh sebelum diserahkan kepada Anda dalam kondisi siap pakai untuk hari istimewa Anda.',
  },
];

export const BEFORE_ORDER_TIPS = [
  {
    title: 'Tentukan Jenis Pakaian',
    desc: 'Pilih apakah Anda membutuhkan jas resmi, hem batik untuk dinas, atau celana panjang pendukung.',
  },
  {
    title: 'Siapkan Estimasi Tanggal Acara',
    desc: 'Beri tahu kami target tanggal pemakaian agar jadwal penjahitan dapat diselaraskan dengan aman.',
  },
  {
    title: 'Bawa Bahan Sendiri atau Referensi',
    desc: 'Jika Anda memiliki kain batik atau bahan jas sendiri, bawa serta contoh foto model yang Anda sukai.',
  },
  {
    title: 'Pikirkan Kenyamanan Penggunaan',
    desc: 'Diskusikan apakah Anda lebih menyukai potongan ramping (slim) atau potongan klasik yang lebih longgar.',
  },
];

export const FAQS = [
  {
    q: 'Jenis pakaian apa saja yang dapat dibuat di President Tailor?',
    a: 'President Tailor memfokuskan layanan pada tiga kategori utama pakaian pria: jas formal, hem batik berpola presisi, dan celana panjang berukuran personal.',
  },
  {
    q: 'Apakah saya bisa membawa bahan kain sendiri?',
    a: 'Ya, Anda dipersilakan membawa bahan kain batik, wol, katun, atau bahan celana milik Anda sendiri. Kami akan mengukur dan menjahitkannya sesuai postur Anda.',
  },
  {
    q: 'Berapa lama proses pembuatan pakaian?',
    a: 'Waktu pengerjaan bergantung pada jenis pakaian dan kepadatan antrean workshop. Untuk jas memerlukan waktu lebih terperinci dibanding hem atau celana. Kami sarankan berkonsultasi via WhatsApp jauh hari sebelum tanggal acara.',
  },
  {
    q: 'Bagaimana cara menentukan ukuran jika belum bisa datang langsung?',
    a: 'Kami sangat menyarankan pengukuran langsung di workshop Sukoharjo untuk hasil terbaik. Namun jika berhalangan, Anda dapat mengirimkan contoh pakaian Anda yang paling nyaman untuk kami jadikan acuan ukuran.',
  },
  {
    q: 'Berapa kisaran ongkos jahit?',
    a: 'Ongkos jahit disesuaikan dengan jenis pakaian, tingkat kerumitan model, serta furing yang digunakan. Silakan konsultasikan kebutuhan Anda melalui tombol WhatsApp untuk mendapatkan informasi jelas dan ramah.',
  },
  {
    q: 'Di mana lokasi workshop President Tailor?',
    a: 'Workshop kami berlokasi di Sukoharjo, Jawa Tengah. Hubungi kami via WhatsApp sebelum berkunjung agar kami dapat menyambut dan melayani Anda dengan optimal.',
  },
];
