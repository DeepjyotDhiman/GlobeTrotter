import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobeTrotter",
  description: "Your ultimate travel companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
