import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Precious Collection",
  description: "A beautiful showcase of my treasured collectibles",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "My Precious Collection",
    description: "A beautiful showcase of my treasured collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Precious Collection",
    description: "A beautiful showcase of my treasured collectibles",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
