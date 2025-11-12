import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import "./globals.css";

const fontSans = LocalFont({
  src: "./helvetica.ttf",
  display: "swap",
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: {
    default: "Kizuna : Gestion RH simplifiée et efficace",
    template: "%s - Kizuna"
  },
  description: "Kizuna, votre SIRH tout-en-un. Simplifiez l'administration RH, le pointage géolocalisé et la gestion des talents. Gagnez du temps et augmentez la productivité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
