import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ryes-collection.vercel.app'),
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
