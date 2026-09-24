import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return <div className="blue-wash paper-grid flex min-h-[65dvh] items-center justify-center px-5 py-20">
    <div className="max-w-md text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FileQuestion size={30} strokeWidth={1.6} /></div>
      <p className="mt-7 text-[11px] font-bold uppercase tracking-[.2em] text-[hsl(var(--primary))]">पता नहीं मिला</p>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight tracking-[-.06em]">यह पन्ना<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">यहाँ नहीं है।</span></h1>
      <p className="mt-4 text-[14px] leading-7 text-[hsl(var(--muted-foreground))]">शायद लिंक बदल गया है। आइए आपको सही जगह वापस ले चलते हैं।</p>
      <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-[13px] font-bold text-white no-underline hover:bg-[hsl(207_72%_31%)]" data-testid="link-not-found-home"><ArrowLeft size={15} /> होम पर जाएँ</Link>
    </div>
  </div>;
}