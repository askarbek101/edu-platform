import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import localFont from "next/font/local";

export const metadata: Metadata = {
  metadataBase: new URL("https://clerk-next-app.vercel.app/"),
  title: "ЭдуПлатформа - Онлайн-обучение для всех",
  description: "Проходите курсы, выполняйте задания и развивайте свои навыки в удобном для вас темпе.",
  openGraph: { images: ["/og.png"] },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
