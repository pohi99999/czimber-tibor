import Link from 'next/link';
import './globals.css';

// Paths outside the locale routing (e.g. a file name the site does not have) end here; the root
// layout renders no <html>, so this page brings its own. All three languages, no client code.
export default function RootNotFound() {
  return (
    <html lang="hu">
      <body className="min-h-screen flex items-center justify-center bg-[var(--color-stage)] text-[var(--color-birch)] p-6">
        <main className="text-center max-w-md">
          <p className="text-[var(--color-spotlight)] text-sm tracking-[0.4em] mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-2">Ez az oldal nem található</h1>
          <p lang="de" className="mb-1">Seite nicht gefunden</p>
          <p lang="en" className="mb-6">Page not found</p>
          <Link href="/" className="text-[var(--color-spotlight)] underline">Vissza a főoldalra / Zur Startseite / Home</Link>
        </main>
      </body>
    </html>
  );
}
