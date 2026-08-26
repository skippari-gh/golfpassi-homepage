import type { Metadata } from "next";
import "./globals.css";
import "./destinations.css";
import MapZoom from "./MapZoom";
import DestinationDots from "./DestinationDots";

export const metadata: Metadata = {
  title: "Golfpassi maailmalla",
  description: "Katso missä Golfpassin matkanvetäjät ovat juuri nyt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>
        {children}
        <DestinationDots />
        <MapZoom />
      </body>
    </html>
  );
}
