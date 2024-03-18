import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "QuibList – Rank the Best",
  description: "Select a List. Rank Your Choices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Header></Header>
        <main className="flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
