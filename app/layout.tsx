import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hormona Operations Command Center",
  description: "Head of Operations dashboard for managing finance, revenue, partnerships, and operations at Hormona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
