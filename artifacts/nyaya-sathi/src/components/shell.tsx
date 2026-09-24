import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Gavel, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { useHealthCheck } from '@workspace/api-client-react';

const navItems = [
  { href: '/', label: 'होम' },
  { href: '/cases', label: 'सेवाएँ' },
  { href: '/ai-guide', label: 'समझें अपनी बात' },
];

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const health = useHealthCheck();

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 no-underline" data-testid="link-logo">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[hsl(var(--primary))] text-white shadow-[0_8px_18px_rgba(24,100,148,.2)]">
              <Gavel size={20} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[17px] font-bold tracking-[-.03em] text-[hsl(var(--foreground))]">न्याय साथी</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">उत्तर प्रदेश</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="मुख्य नेविगेशन">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`} className={`relative py-2 text-[14px] font-semibold no-underline transition-colors ${location === item.href ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>
                {item.label}
                {location === item.href && <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-[hsl(var(--accent))]" />}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <a href="tel:+915224041717" className="flex items-center gap-2 text-[13px] font-semibold text-[hsl(var(--muted-foreground))] no-underline hover:text-[hsl(var(--primary))]" data-testid="link-call-header">
              <Phone size={15} /> 0522 404 1717
            </a>
            <Link href="/request" className="group flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-[13px] font-bold text-white no-underline shadow-[0_7px_18px_rgba(24,100,148,.18)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(207_72%_31%)]" data-testid="link-request-header">
              मदद लें <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <button type="button" className="rounded-lg p-2 text-[hsl(var(--foreground))] md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'} data-testid="button-mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-4 md:hidden">
            <nav className="mx-auto flex max-w-[1240px] flex-col gap-1" aria-label="मोबाइल नेविगेशन">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-[hsl(var(--foreground))] no-underline hover:bg-[hsl(var(--secondary))]" data-testid={`link-mobile-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}>{item.label}</Link>
              ))}
              <Link href="/request" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-3 text-center text-[15px] font-bold text-white no-underline" data-testid="link-mobile-request">अपनी बात रखें</Link>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 lg:grid-cols-[1.4fr_.8fr_.8fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--primary))] text-white"><Gavel size={17} /></span>
              <span className="font-bold text-[hsl(var(--foreground))]">न्याय साथी</span>
            </div>
            <p className="max-w-sm text-[13px] leading-6 text-[hsl(var(--muted-foreground))]">आपकी बात को सही दिशा और सही व्यक्ति तक पहुँचाने वाला, उत्तर प्रदेश का भरोसेमंद कानूनी डेस्क।</p>
            <div className="mt-5 flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]" data-testid="status-health">
              <span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-[hsl(var(--destructive))]' : health.isLoading ? 'bg-[hsl(var(--accent))]' : 'bg-emerald-500'}`} />
              {health.isError ? 'सेवा जाँच में है' : 'डेस्क ऑनलाइन है'}
            </div>
          </div>
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">सहायता</p>
            <div className="space-y-3 text-[14px] font-medium text-[hsl(var(--foreground))]">
              <Link href="/cases" className="block no-underline hover:text-[hsl(var(--primary))]" data-testid="link-footer-services">कानूनी सेवाएँ</Link>
              <Link href="/ai-guide" className="block no-underline hover:text-[hsl(var(--primary))]" data-testid="link-footer-guide">अपनी बात समझें</Link>
              <Link href="/request" className="block no-underline hover:text-[hsl(var(--primary))]" data-testid="link-footer-request">निवेदन भेजें</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">सीधे बात करें</p>
            <a href="tel:+915224041717" className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-[hsl(var(--primary))] no-underline" data-testid="link-footer-call"><Phone size={15} /> 0522 404 1717</a>
            <p className="text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">सोमवार–शनिवार<br />सुबह 10 से शाम 7 बजे तक</p>
          </div>
        </div>
        <div className="border-t border-[hsl(var(--border))]">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-[11px] text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <span>© 2024 न्याय साथी · लखनऊ, उत्तर प्रदेश</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> जानकारी गोपनीय रखी जाती है</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[hsl(var(--primary))]">{children}</p>;
}

export function LoadingBlock({ label = 'जानकारी लाई जा रही है…' }: { label?: string }) {
  return <div className="space-y-3" data-testid="state-loading"><div className="shimmer h-5 w-2/3 rounded-lg" /><div className="shimmer h-4 w-full rounded-lg" /><div className="shimmer h-4 w-4/5 rounded-lg" /><p className="pt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{label}</p></div>;
}

export function ErrorBlock({ onRetry, label = 'जानकारी अभी नहीं मिल पाई' }: { onRetry?: () => void; label?: string }) {
  return <div className="rounded-2xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.06)] p-5" data-testid="state-error"><p className="font-semibold text-[hsl(var(--destructive))]">{label}</p><p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">कृपया एक बार फिर कोशिश करें।</p>{onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-full border border-[hsl(var(--destructive)/.35)] px-4 py-2 text-[12px] font-bold text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/.08)]" data-testid="button-retry">फिर कोशिश करें</button>}</div>;
}

export function MetricIcon({ children }: { children: ReactNode }) {
  return <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">{children}</span>;
}