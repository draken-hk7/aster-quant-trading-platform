import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aster Quant Terminal",
  description: "Institutional trading workstation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

