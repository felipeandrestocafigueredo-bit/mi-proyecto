import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/app/providers/SessionProvider";
import { AccessControlProvider } from "@/app/providers/AccessControlProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamified Teaching Strategies",
  description: "Learn English by playing · XP, challenges and achievements every week",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full flex flex-col">
        <AccessControlProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </AccessControlProvider>
      </body>
    </html>
  );
}
