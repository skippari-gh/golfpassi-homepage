import type { Metadata } from "next";
import "./globals.css";
import MapZoom from "./MapZoom";

export const metadata: Metadata = {
  title: "Golfpassi maailmalla",
  description: "Katso missä Golfpassin matkanvetäjät ovat juuri nyt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>
        {children}
        <MapZoom />
      </body>
    </html>
  );
}
