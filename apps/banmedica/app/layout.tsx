import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { classNames } from "../helpers/classNames";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Banmédica - Isapre",
  description: "Isapre Banmédica - Cuidamos tu salud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={classNames(
          roboto.variable,
          "font-sans antialiased"
        )}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
