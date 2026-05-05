import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golfpassi – golfmatkat, joissa kaikki on valmiina",
  description:
    "Golfpassi järjestää golfmatkat helposti: lennot, majoitus, golf, kuljetukset ja suomenkielinen tuki samassa paketissa.",
  openGraph: {
    title: "Golfpassi – golfmatkat, joissa kaikki on valmiina",
    description:
      "Helppo tapa lähteä golfmatkalle. Sinä keskityt peliin, Golfpassi hoitaa järjestelyt.",
    type: "website",
    locale: "fi_FI",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
