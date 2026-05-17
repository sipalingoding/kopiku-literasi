'use client';

const BOOKS_DEFAULT = [
  { id: 1, title: "Pulang", author: "Tere Liye", category: "Novel", color: "#7B3F20", stock: 1, rating: 4.8, pages: 400, year: 2015, desc: "Kisah Bughis, seorang pria yang dibesarkan keluarga mafia. Perjalanannya mencari makna 'pulang' ke kampung halaman dan keluarga kandungnya." },
  { id: 2, title: "Reset Indonesia", author: "Dandy Laksono", category: "Politik", color: "#1B4332", stock: 1, rating: 4.5, pages: 320, year: 2022, desc: "Analisis kritis kondisi sosial-politik Indonesia pasca reformasi dan gagasan tentang bagaimana mereset arah bangsa ini." },
  { id: 3, title: "Prinsipil Ekonomi", author: "Ferry Irwandi", category: "Ekonomi", color: "#1D3557", stock: 1, rating: 4.6, pages: 280, year: 2021, desc: "Panduan membaca prinsip-prinsip dasar ekonomi dengan cara yang menarik dan relevan untuk kehidupan sehari-hari." },
  { id: 4, title: "What It Takes", author: "Gita Wirjawan", category: "Bisnis", color: "#44236A", stock: 1, rating: 4.7, pages: 350, year: 2020, desc: "Memoir mantan Kepala BKPM tentang kepemimpinan, pengambilan keputusan, dan membangun Indonesia dari dalam." },
  { id: 5, title: "Cantik Itu Luka", author: "Eka Kurniawan", category: "Novel", color: "#6B1A1A", stock: 1, rating: 4.9, pages: 505, year: 2002, desc: "Karya magis-realis yang mengeksplorasi trauma, kecantikan, dan penderitaan manusia melalui kisah keluarga di zaman penjajahan." },
  { id: 6, title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Novel", color: "#5C4A1E", stock: 1, rating: 4.9, pages: 535, year: 1980, desc: "Kisah Minke, pemuda bumiputera cerdas yang menemukan cintanya di tengah cengkeraman kolonialisme Belanda. Awal tetralogi Pulau Buru." },
  { id: 7, title: "Laskar Pelangi", author: "Andrea Hirata", category: "Novel", color: "#0D5C7A", stock: 1, rating: 4.7, pages: 529, year: 2005, desc: "Kisah inspiratif sepuluh anak Melayu Belitung yang berjuang meraih mimpi di tengah keterbatasan. Novel terlaris Indonesia." },
  { id: 8, title: "Filosofi Teras", author: "Henry Manampiring", category: "Self-Help", color: "#2E4A3E", stock: 1, rating: 4.6, pages: 280, year: 2018, desc: "Pengenalan filsafat Stoa dan cara menerapkannya dalam kehidupan modern Indonesia. Praktis, ringan, dan penuh relevansi." },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "Sejarah", color: "#3A3A5C", stock: 1, rating: 4.8, pages: 443, year: 2011, desc: "Sejarah singkat umat manusia — dari Adam hingga atom. Bagaimana Homo sapiens menjadi penguasa planet ini." },
  { id: 10, title: "Atomic Habits", author: "James Clear", category: "Self-Help", color: "#1C3A5C", stock: 1, rating: 4.8, pages: 306, year: 2018, desc: "Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan kecil yang konsisten." },
  { id: 11, title: "Arus Balik", author: "Pramoedya Ananta Toer", category: "Sejarah", color: "#4A3000", stock: 1, rating: 4.7, pages: 756, year: 1995, desc: "Novel epik tentang Nusantara di masa kejayaan Majapahit dan datangnya kolonialisme Portugis ke kepulauan Indonesia." },
  { id: 12, title: "Sophie's World", author: "Jostein Gaarder", category: "Filsafat", color: "#2A4A6A", stock: 1, rating: 4.6, pages: 518, year: 1991, desc: "Sejarah filsafat dunia dikemas dalam cerita misteri tentang gadis bernama Sophie yang menerima surat misterius." },
  { id: 13, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Bisnis", color: "#8B2500", stock: 1, rating: 4.5, pages: 207, year: 1997, desc: "Pelajaran finansial dari dua figur ayah yang berbeda. Tentang bagaimana membangun kebebasan finansial sejati." },
  { id: 14, title: "Thinking Fast and Slow", author: "Daniel Kahneman", category: "Sains", color: "#1A4A3A", stock: 1, rating: 4.7, pages: 499, year: 2011, desc: "Eksplorasi dua sistem berpikir manusia dan bagaimana keduanya mempengaruhi setiap keputusan dalam hidup kita." },
  { id: 15, title: "Laut Bercerita", author: "Leila S. Chudori", category: "Novel", color: "#1A3A6A", stock: 1, rating: 4.8, pages: 389, year: 2017, desc: "Kisah aktivis mahasiswa yang hilang di era Orde Baru. Novel tentang kehilangan, pencarian kebenaran, dan cinta abadi." },
];

export const AppData = {
  BOOKS_DEFAULT,
  CATEGORIES: ["Semua", "Novel", "Bisnis", "Ekonomi", "Politik", "Self-Help", "Sejarah", "Sains", "Filsafat"],
  OTP_CODE: "123456",

  getBooks() {
    if (typeof window === 'undefined') return BOOKS_DEFAULT;
    const s = localStorage.getItem('kopiku_books');
    return s ? JSON.parse(s) : BOOKS_DEFAULT;
  },
  saveBooks(books) { localStorage.setItem('kopiku_books', JSON.stringify(books)); },

  getUsers() {
    if (typeof window === 'undefined') return [];
    const s = localStorage.getItem('kopiku_users');
    if (s) return JSON.parse(s);
    const def = [{ id: 1, name: "Admin", email: "admin@kopiku.id", password: "admin123", role: "admin", verified: true }];
    localStorage.setItem('kopiku_users', JSON.stringify(def));
    return def;
  },
  addUser(u) {
    const users = this.getUsers();
    const nu = { ...u, id: Date.now(), role: "user", verified: false };
    users.push(nu);
    localStorage.setItem('kopiku_users', JSON.stringify(users));
    return nu;
  },
  verifyUser(email) {
    const users = this.getUsers();
    const i = users.findIndex(u => u.email === email);
    if (i !== -1) { users[i].verified = true; localStorage.setItem('kopiku_users', JSON.stringify(users)); }
  },
  updateUser(id, data) {
    const users = this.getUsers();
    const i = users.findIndex(u => u.id === id);
    if (i !== -1) { users[i] = { ...users[i], ...data }; localStorage.setItem('kopiku_users', JSON.stringify(users)); return users[i]; }
    return null;
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem('kopiku_current_user');
    return s ? JSON.parse(s) : null;
  },
  setCurrentUser(u) {
    if (u) localStorage.setItem('kopiku_current_user', JSON.stringify(u));
    else localStorage.removeItem('kopiku_current_user');
  },

  getActiveBookingForBook(bookId) {
    const bookings = this.getBookings();
    return bookings.find(b => b.bookId === bookId && ['pending','confirmed','active'].includes(b.status));
  },

  getBookings() {
    if (typeof window === 'undefined') return [];
    const s = localStorage.getItem('kopiku_bookings');
    if (s) return JSON.parse(s);
    const today = new Date();
    const inDays = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString(); };
    const sample = [
      { id: 'BK' + (Date.now() - 100000), bookId: 4, bookTitle: 'What It Takes', bookAuthor: 'Gita Wirjawan', bookColor: '#44236A',
        userId: 999, userName: 'Reza Pahlevi', duration: 14, durationLabel: '2 Minggu',
        pickupDate: inDays(-3), returnDate: inDays(11), note: '', createdAt: inDays(-4), status: 'active' },
      { id: 'BK' + (Date.now() - 90000), bookId: 9, bookTitle: 'Sapiens', bookAuthor: 'Yuval Noah Harari', bookColor: '#3A3A5C',
        userId: 999, userName: 'Sari Wulandari', duration: 7, durationLabel: '1 Minggu',
        pickupDate: inDays(2), returnDate: inDays(9), note: 'Sudah lama ingin baca', createdAt: inDays(-1), status: 'confirmed' },
      { id: 'BK' + (Date.now() - 80000), bookId: 6, bookTitle: 'Bumi Manusia', bookAuthor: 'Pramoedya Ananta Toer', bookColor: '#5C4A1E',
        userId: 999, userName: 'Ahmad Faisal', duration: 30, durationLabel: '1 Bulan',
        pickupDate: inDays(-7), returnDate: inDays(23), note: '', createdAt: inDays(-8), status: 'active' },
    ];
    localStorage.setItem('kopiku_bookings', JSON.stringify(sample));
    return sample;
  },
  addBooking(b) {
    const bookings = this.getBookings();
    const nb = { ...b, id: 'BK' + Date.now(), createdAt: new Date().toISOString(), status: 'pending' };
    bookings.push(nb);
    localStorage.setItem('kopiku_bookings', JSON.stringify(bookings));
    return nb;
  },
  updateBookingStatus(id, status) {
    const bookings = this.getBookings();
    const i = bookings.findIndex(b => b.id === id);
    if (i !== -1) { bookings[i].status = status; localStorage.setItem('kopiku_bookings', JSON.stringify(bookings)); }
  },

  formatDate(d) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); },
};

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  const themes = {
    warm: { '--c-primary': '#6B3A2A', '--c-accent': '#C17A2A', '--c-bg': '#FFFFFF', '--c-card': '#FFFFFF' },
    forest: { '--c-primary': '#2E4A3E', '--c-accent': '#52886A', '--c-bg': '#FAFCFA', '--c-card': '#FFFFFF' },
    ocean: { '--c-primary': '#1D3A5C', '--c-accent': '#2E7AAA', '--c-bg': '#FAFBFD', '--c-card': '#FFFFFF' },
  };
  const t = themes[theme] || themes.warm;
  Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}
