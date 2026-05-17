import { Plus_Jakarta_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "Kopiku Literasi — Perpustakaan Pribadi",
  description: "Perpustakaan pribadi dengan koleksi buku pilihan. Pinjam gratis, baca, dan kembalikan tepat waktu.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${nunito.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){if(localStorage.getItem('kopiku_dark')==='1'){document.documentElement.classList.add('dark');}})()`
        }}/>
      </head>
      <body style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
