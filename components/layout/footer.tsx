import Link from 'next/link';
import { Ticket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo and tagline */}
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Experia - Event Ticket Analytics
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Events
            </Link>
            <Link
              href="/compare"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Experia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
