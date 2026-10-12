import { notFound } from 'next/navigation';

// Any path the site does not have renders app/[locale]/not-found.tsx in the page language.
export default function CatchAll() {
  notFound();
}
