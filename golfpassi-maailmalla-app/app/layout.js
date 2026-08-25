import './globals.css'

export const metadata = {
  title: 'Golfpassi maailmalla',
  description: 'Katso missä Golfpassin matkanvetäjät ovat juuri nyt.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  )
}
