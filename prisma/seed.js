const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const books = [
  { title:"Pulang", author:"Tere Liye", category:"Novel", color:"#7B3F20", rating:4.8, pages:400, year:2015, desc:"Kisah Bughis, seorang pria yang dibesarkan keluarga mafia. Perjalanannya mencari makna 'pulang' ke kampung halaman dan keluarga kandungnya." },
  { title:"Reset Indonesia", author:"Dandy Laksono", category:"Politik", color:"#1B4332", rating:4.5, pages:320, year:2022, desc:"Analisis kritis kondisi sosial-politik Indonesia pasca reformasi dan gagasan tentang bagaimana mereset arah bangsa ini." },
  { title:"Prinsipil Ekonomi", author:"Ferry Irwandi", category:"Ekonomi", color:"#1D3557", rating:4.6, pages:280, year:2021, desc:"Panduan membaca prinsip-prinsip dasar ekonomi dengan cara yang menarik dan relevan untuk kehidupan sehari-hari." },
  { title:"What It Takes", author:"Gita Wirjawan", category:"Bisnis", color:"#44236A", rating:4.7, pages:350, year:2020, desc:"Memoir mantan Kepala BKPM tentang kepemimpinan, pengambilan keputusan, dan membangun Indonesia dari dalam." },
  { title:"Cantik Itu Luka", author:"Eka Kurniawan", category:"Novel", color:"#6B1A1A", rating:4.9, pages:505, year:2002, desc:"Karya magis-realis yang mengeksplorasi trauma, kecantikan, dan penderitaan manusia melalui kisah keluarga di zaman penjajahan." },
  { title:"Bumi Manusia", author:"Pramoedya Ananta Toer", category:"Novel", color:"#5C4A1E", rating:4.9, pages:535, year:1980, desc:"Kisah Minke, pemuda bumiputera cerdas yang menemukan cintanya di tengah cengkeraman kolonialisme Belanda. Awal tetralogi Pulau Buru." },
  { title:"Laskar Pelangi", author:"Andrea Hirata", category:"Novel", color:"#0D5C7A", rating:4.7, pages:529, year:2005, desc:"Kisah inspiratif sepuluh anak Melayu Belitung yang berjuang meraih mimpi di tengah keterbatasan. Novel terlaris Indonesia." },
  { title:"Filosofi Teras", author:"Henry Manampiring", category:"Self-Help", color:"#2E4A3E", rating:4.6, pages:280, year:2018, desc:"Pengenalan filsafat Stoa dan cara menerapkannya dalam kehidupan modern Indonesia. Praktis, ringan, dan penuh relevansi." },
  { title:"Sapiens", author:"Yuval Noah Harari", category:"Sejarah", color:"#3A3A5C", rating:4.8, pages:443, year:2011, desc:"Sejarah singkat umat manusia — dari Adam hingga atom. Bagaimana Homo sapiens menjadi penguasa planet ini." },
  { title:"Atomic Habits", author:"James Clear", category:"Self-Help", color:"#1C3A5C", rating:4.8, pages:306, year:2018, desc:"Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan kecil yang konsisten." },
  { title:"Arus Balik", author:"Pramoedya Ananta Toer", category:"Sejarah", color:"#4A3000", rating:4.7, pages:756, year:1995, desc:"Novel epik tentang Nusantara di masa kejayaan Majapahit dan datangnya kolonialisme Portugis ke kepulauan Indonesia." },
  { title:"Sophie's World", author:"Jostein Gaarder", category:"Filsafat", color:"#2A4A6A", rating:4.6, pages:518, year:1991, desc:"Sejarah filsafat dunia dikemas dalam cerita misteri tentang gadis bernama Sophie yang menerima surat misterius." },
  { title:"Rich Dad Poor Dad", author:"Robert Kiyosaki", category:"Bisnis", color:"#8B2500", rating:4.5, pages:207, year:1997, desc:"Pelajaran finansial dari dua figur ayah yang berbeda. Tentang bagaimana membangun kebebasan finansial sejati." },
  { title:"Thinking Fast and Slow", author:"Daniel Kahneman", category:"Sains", color:"#1A4A3A", rating:4.7, pages:499, year:2011, desc:"Eksplorasi dua sistem berpikir manusia dan bagaimana keduanya mempengaruhi setiap keputusan dalam hidup kita." },
  { title:"Laut Bercerita", author:"Leila S. Chudori", category:"Novel", color:"#1A3A6A", rating:4.8, pages:389, year:2017, desc:"Kisah aktivis mahasiswa yang hilang di era Orde Baru. Novel tentang kehilangan, pencarian kebenaran, dan cinta abadi." },
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kopiku.id' },
    update: {},
    create: {
      name: 'Admin Kopiku',
      email: 'admin@kopiku.id',
      password: adminPassword,
      role: 'admin',
      verified: true,
    },
  });
  console.log('Admin created: admin@kopiku.id / admin123');

  for (const book of books) {
    await prisma.book.create({ data: { ...book, stock: 1 } });
  }
  console.log(`${books.length} books seeded.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
