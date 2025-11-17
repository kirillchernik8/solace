
import type { Metadata } from "next";
// local font import for better performance
import localFont from 'next/font/local';
import "./globals.css";
// reset css to ensure consistency across browsers
import "./assets/styles/reset.css";

export const lato = localFont({
  src: [ {  path: '../../public/fonts/Lato-Regular.woff2', }, ],
})

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
