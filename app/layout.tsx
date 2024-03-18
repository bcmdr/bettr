import "./globals.css";
import Link from "next/link";

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
        <header className="bg-cyan-950 font-bold shadow text-white p-2 sticky top-0 z-10 flex items-center m-0">
          <Link className="text-sm" href="/">
            QuibList
          </Link>
        </header>
        <main className="flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
