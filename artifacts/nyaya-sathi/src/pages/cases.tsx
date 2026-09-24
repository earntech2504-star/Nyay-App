import { useMemo, useState } from 'react';
import { ArrowRight, Check, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'wouter';
import { useListCaseModels } from '@workspace/api-client-react';
import { ErrorBlock, LoadingBlock, SectionEyebrow } from '@/components/shell';

export default function Cases() {
  const cases = useListCaseModels();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('सभी');
  const allCases = useMemo(() => cases.data ?? [], [cases.data]);
  const categories = ['सभी', ...Array.from(new Set(allCases.map((item) => item.category)))];
  const visibleCases = useMemo(() => allCases.filter((item) => {
    const matchesCategory = category === 'सभी' || item.category === category;
    const haystack = `${item.title} ${item.subtitle} ${item.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [allCases, category, query]);

  return <div>
    <section className="blue-wash paper-grid border-b border-[hsl(var(--border))]">
      <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-18">
        <SectionEyebrow>सही जगह से शुरुआत</SectionEyebrow>
        <div className="grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div><h1 className="max-w-2xl text-[clamp(2.35rem,5vw,4.7rem)] font-bold leading-[1.05] tracking-[-.06em]">आपकी स्थिति के लिए<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">सही सहायता।</span></h1><p className="mt-5 max-w-xl text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">हर मामला अलग होता है। नीचे अपनी स्थिति के करीब की सेवा चुनें, फीस और समय जानें, फिर हमें अपनी बात बताएं।</p></div>
          <div className="rounded-2xl border border-white/70 bg-[hsl(var(--background)/.65)] p-4 shadow-sm"><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]"><Filter size={14} /> खोजें</div><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="जैसे — किराया, नोटिस, तलाक" className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 pl-10 pr-3 text-[13px] text-[hsl(var(--foreground))] outline-none transition-shadow placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary)/.5)] focus:ring-4 focus:ring-[hsl(var(--primary)/.08)]" data-testid="input-search-cases" /></div></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[13px] font-semibold text-[hsl(var(--muted-foreground))]"><span className="text-[hsl(var(--foreground))]">{visibleCases.length}</span> सेवाएँ उपलब्ध</p></div><div className="flex items-center gap-2 overflow-x-auto pb-1" data-testid="filter-case-categories">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition-colors ${category === item ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/.7)]'}`} data-testid={`button-category-${item}`}>{item}</button>)}</div></div>
      {cases.isLoading && <div className="grid gap-5 md:grid-cols-2">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="shimmer h-64 rounded-[22px]" />)}</div>}
      {cases.isError && <ErrorBlock onRetry={() => cases.refetch()} label="सेवाएँ लोड नहीं हो सकीं" />}
      {!cases.isLoading && !cases.isError && visibleCases.length === 0 && <div className="rounded-[22px] border border-dashed border-[hsl(var(--border))] px-5 py-16 text-center" data-testid="state-empty-filter"><SlidersHorizontal className="mx-auto mb-4 text-[hsl(var(--muted-foreground))]" /><p className="font-semibold text-[hsl(var(--foreground))]">इस खोज से जुड़ी सेवा नहीं मिली</p><p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">शब्द बदलकर देखें या सभी सेवाएँ चुनें।</p><button type="button" onClick={() => { setQuery(''); setCategory('सभी'); }} className="mt-5 rounded-full bg-[hsl(var(--secondary))] px-4 py-2 text-[12px] font-bold text-[hsl(var(--primary))]" data-testid="button-clear-filters">फ़िल्टर हटाएँ</button></div>}
      <div className="grid gap-5 md:grid-cols-2">{!cases.isLoading && !cases.isError && visibleCases.map((item, index) => <article key={item.id} className={`group flex flex-col rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 card-shadow transition-all hover:-translate-y-1 hover:border-[hsl(var(--primary)/.3)] hover:shadow-[0_18px_36px_rgba(20,58,91,.1)] ${index === 0 ? 'md:p-8' : ''}`} data-testid={`card-case-${item.id}`}>
        <div className="flex items-start justify-between gap-4"><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{item.category}</span><span className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))]">{item.turnaround}</span></div>
        <h2 className="mt-6 text-[22px] font-bold tracking-[-.04em] text-[hsl(var(--foreground))]">{item.title}</h2><p className="mt-1 text-[13px] font-semibold text-[hsl(var(--primary))]">{item.subtitle}</p><p className="mt-4 flex-1 text-[13px] leading-6 text-[hsl(var(--muted-foreground))]">{item.description}</p>
        <div className="mt-7 flex items-end justify-between border-t border-[hsl(var(--border))] pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">शुरुआती फीस</p><p className="mt-1 text-[17px] font-bold text-[hsl(var(--foreground))]">{item.startingFee}</p></div><Link href={`/request?case=${encodeURIComponent(item.id)}`} className="group/cta inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-[12px] font-bold text-white no-underline transition-colors hover:bg-[hsl(207_72%_31%)]" data-testid={`link-start-case-${item.id}`}>निवेदन शुरू करें <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1" /></Link></div>
      </article>)}</div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="flex items-center gap-2 text-[14px] font-bold text-[hsl(var(--foreground))]"><Check size={16} className="text-[hsl(var(--primary))]" /> अपनी स्थिति सूची में नहीं मिली?</p><p className="mt-2 text-[13px] text-[hsl(var(--muted-foreground))]">फिर भी अपनी बात भेजें — हम आपको सही दिशा बताएँगे।</p></div><Link href="/request" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--card))] px-5 py-3 text-[12px] font-bold text-[hsl(var(--primary))] no-underline hover:bg-[hsl(var(--secondary))]" data-testid="link-custom-case">अपनी बात लिखें <ArrowRight size={14} /></Link></div>
    </section>
  </div>;
}