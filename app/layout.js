import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Gallery Auth App</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
