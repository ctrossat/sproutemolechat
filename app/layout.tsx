import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'

const omori = localFont({
  src: './OMORI_GAME2.ttf',
  display: 'swap',
  variable: '--font-omori',
})

const scared = localFont({
  src: './OMORI_GAME.ttf',
  display: 'swap',
  variable: '--font-scared',
})

export const metadata: Metadata = {
  title: "Sprout Mole Chat",
  description: "Small websocket app that emulate livestream chat. Inspired by the game Omori",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${omori.variable} ${scared.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
