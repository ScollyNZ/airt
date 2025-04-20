import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google"; // Import the Orbitron font
import { TimeControllerProvider } from './components/TimeControllerContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
}); // Configure the Orbitron font

export const metadata: Metadata = {
  title: "Adventures In Real Time", 
  description: "Your emmersive adventure experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.className} antialiased`}
      >
        <TimeControllerProvider>
          {children}
        </TimeControllerProvider>
      </body>
    </html>
  );
}
