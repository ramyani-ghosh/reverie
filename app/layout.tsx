// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"; // Ensure global styles are imported

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reverie",
  description: "An immersive storytelling and guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
