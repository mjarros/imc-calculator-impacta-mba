import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calculadora de IMC",
  description:
    "Calcule seu Índice de Massa Corporal. O cálculo é feito no servidor pela fórmula peso ÷ altura².",
};

export const viewport: Viewport = {
  themeColor: "#12141c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  );
}
