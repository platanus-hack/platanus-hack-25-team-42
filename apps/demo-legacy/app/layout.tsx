import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { classNames } from "../helpers/classNames";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fintual",
  description: "Inversiones sin mínimos y reguladas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={classNames(roboto.variable, poppins.variable, "font-sans antialiased")}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
