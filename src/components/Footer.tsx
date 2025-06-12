import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full max-w-3xl mx-auto py-4 text-center text-white drop-shadow-md">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span>Made with</span>
        <Heart size={16} className="fill-error text-error" />
        <span>and prayer</span>
      </div>
      <div className="text-xs opacity-80">
        &copy; {new Date().getFullYear()} NFC Gospel. All rights reserved.
      </div>
    </footer>
  );
}