import { type ReactNode } from 'react';
import { ArrowRight, CalendarDays, ChevronRight, Clock3, FileText, MapPin, MessageCircle, Scale, UsersRound } from 'lucide-react';
import { Link } from 'wouter';
import { getListNewsFeedsQueryKey, useGetLegalOverview, useListCaseModels, useListNewsFeeds } from '@workspace/api-client-react';
import { ErrorBlock, LoadingBlock, MetricIcon, SectionEyebrow } from '@/components/shell';

const serviceHints = ['नोटिस का जवाब', 'पारिवारिक विवाद', 'संपत्ति और किराया', 'पुलिस शिकायत'];

function Stat({ icon, value, label, loading }: { icon: ReactNode; value?: string | number; label: string; loading?: boolean }) {
  return <div className="flex gap-3" data-testid={`metric-${label}`}>
    <MetricIcon>{icon}</MetricIcon>
    <div><p className="text-[20px] font-bold tracking-[-.04em] text-[hsl(var(--foreground))]">{loading ? <span className="inline-block h-6 w-14 animate-pulse rounded bg-[hsl(var(--muted))]" /> : value ?? '—'}</p><p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))]">{label}</p></div>
  </div>;
}

export default function Home() {
  const overview = useGetLegalOverview();
  const cases = useListCaseModels();
  const news = useListNewsFeeds({ query: { queryKey: getListNewsFeedsQueryKey(), refetchInterval: 5 * 60 * 1000 } });
  const featuredCases = cases.data?.slice(0, 4) ?? [];

  return (
    <div>
      <section className="blue-wash paper-grid overflow-hidden">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div className="fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-[hsl(var(--background)/.65)] px-3 py-1.5 text-[11px] font-bold text-[hsl(var(--primary))] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> लखनऊ से, पूरे उत्तर प्रदेश के लिए
            </div>
            <h1 className="max-w-[620px] text-[clamp(2.65rem,6vw,5.3rem)] font-bold leading-[1.06] tracking-[-.065em] text-[hsl(var(--foreground))]">कानून समझिए।<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">अगला कदम चुनिए।</span></h1>
            <p className="mt-6 max-w-[530px] text-[16px] leading-8 text-[hsl(var(--muted-foreground))]">नोटिस, विवाद या कोई कानूनी उलझन — अपनी बात सरल भाषा में रखें और सही अधिवक्ता तक जल्दी पहुँचें।</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/request" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-[14px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(24,100,148,.2)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(207_72%_31%)]" data-testid="link-hero-request">अपनी बात रखें <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/ai-guide" className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--primary)/.22)] bg-[hsl(var(--background)/.45)] px-6 py-3.5 text-[14px] font-bold text-[hsl(var(--primary))] no-underline transition-colors hover:bg-[hsl(var(--background))]" data-testid="link-hero-guide">पहले समझना है <ChevronRight size={16} /></Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-[hsl(var(--primary))]" /> जवाब 24 घंटे में</span>
              <span className="flex items-center gap-1.5"><ShieldDot /> बात गोपनीय</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[hsl(var(--primary))]" /> 75 जिले</span>
            </div>
          </div>
          <div className="relative fade-up fade-up-delay-2">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[hsl(var(--primary)/.12)]" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[hsl(var(--accent)/.2)] blur-2xl" />
            <div className="relative rounded-[28px] border border-white/70 bg-[hsl(var(--background)/.78)] p-5 shadow-[0_22px_60px_rgba(20,58,91,.11)] backdrop-blur-md sm:p-7">
              <div className="mb-7 flex items-start justify-between">
                <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">आज की स्थिति</p><p className="mt-2 text-[18px] font-bold text-[hsl(var(--foreground))]">आप अकेले नहीं हैं।</p></div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white"><Scale size={21} strokeWidth={1.7} /></div>
              </div>
              <div className="grid gap-6 border-b border-[hsl(var(--border))] pb-6 sm:grid-cols-3">
                <Stat icon={<FileText size={17} />} value={overview.data?.activeCases} label="चल रहे मामले" loading={overview.isLoading} />
                <Stat icon={<Clock3 size={17} />} value={overview.data?.responseTime} label="पहला जवाब" loading={overview.isLoading} />
                <Stat icon={<UsersRound size={17} />} value={overview.data?.supportedDistricts} label="जिले उपलब्ध" loading={overview.isLoading} />
              </div>
              {overview.isError ? <div className="mt-5"><ErrorBlock onRetry={() => overview.refetch()} label="स्थिति लोड नहीं हो सकी" /></div> : (
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[hsl(var(--secondary)/.65)] px-4 py-3.5"><span className="flex items-center gap-2 text-[12px] font-semibold text-[hsl(var(--muted-foreground))]"><CalendarDays size={15} className="text-[hsl(var(--primary))]" /> अगली सुनवाई</span><span className="text-[13px] font-bold text-[hsl(var(--foreground))]" data-testid="text-next-hearing">{overview.isLoading ? 'देख रहे हैं…' : overview.data?.nextHearing ?? 'अभी तय नहीं'}</span></div>
              )}
              <div className="mt-5 flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> हर अनुरोध की शुरुआत एक इंसानी बातचीत से होती है</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><SectionEyebrow>कहाँ से शुरू करें</SectionEyebrow><h2 className="max-w-xl text-[clamp(1.8rem,3.4vw,3rem)] font-bold leading-tight tracking-[-.05em]">आपकी बात, आपकी भाषा में।</h2><p className="mt-3 max-w-lg text-[14px] leading-7 text-[hsl(var(--muted-foreground))]">जिस स्थिति से आप गुज़र रहे हैं, उसे चुनिए। बाकी रास्ता हम साथ देखेंगे।</p></div>
          <Link href="/cases" className="inline-flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--primary))] no-underline" data-testid="link-all-services">सभी सेवाएँ <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {cases.isLoading && [1, 2, 3, 4].map((item) => <div key={item} className="shimmer h-44 rounded-2xl" />)}
          {cases.isError && <div className="md:col-span-2"><ErrorBlock onRetry={() => cases.refetch()} /></div>}
          {!cases.isLoading && !cases.isError && featuredCases.length === 0 && <div className="md:col-span-2 rounded-2xl border border-dashed border-[hsl(var(--border))] p-10 text-center text-[14px] text-[hsl(var(--muted-foreground))]" data-testid="state-empty-services">अभी सेवाओं की सूची उपलब्ध नहीं है। थोड़ी देर बाद फिर देखें।</div>}
          {featuredCases.map((item, index) => <Link href={`/request?case=${encodeURIComponent(item.id)}`} key={item.id} className={`group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 no-underline card-shadow transition-all hover:-translate-y-1 hover:border-[hsl(var(--primary)/.25)] hover:shadow-[0_16px_36px_rgba(20,58,91,.12)] ${index === 0 ? 'md:row-span-2 md:p-7' : ''}`} data-testid={`card-service-${item.id}`}>
            <div className="flex h-full flex-col justify-between gap-8"><div><div className="mb-5 flex items-center justify-between"><span className="rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{item.category}</span><ArrowRight size={17} className="text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-1 group-hover:text-[hsl(var(--primary))]" /></div><h3 className={`${index === 0 ? 'text-[25px]' : 'text-[18px]'} font-bold leading-tight tracking-[-.035em] text-[hsl(var(--foreground))]`}>{item.title}</h3><p className="mt-2 text-[13px] leading-6 text-[hsl(var(--muted-foreground))]">{item.subtitle}</p></div><div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-[11px] font-semibold text-[hsl(var(--muted-foreground))]"><span>शुरुआत {item.startingFee}</span><span>{item.turnaround}</span></div></div>
          </Link>)}
        </div>
      </section>

      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.42)]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:px-8 lg:py-20">
          <div><SectionEyebrow>लखनऊ की कानूनी हलचल</SectionEyebrow><h2 className="max-w-md text-[clamp(1.8rem,3vw,2.7rem)] font-bold leading-tight tracking-[-.05em]">जो हो रहा है, उसे समझकर आगे बढ़ें।</h2><p className="mt-4 max-w-md text-[14px] leading-7 text-[hsl(var(--muted-foreground))]">स्थानीय अदालतों और प्रशासन से जुड़ी चुनिंदा खबरें — सिर्फ़ वही जो आपके काम की हों।</p><Link href="/ai-guide" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--primary))] no-underline" data-testid="link-news-guide">किसी बात पर सलाह चाहिए <ArrowRight size={15} /></Link></div>
          <div className="space-y-2">
            {news.isLoading && <LoadingBlock label="लखनऊ की खबरें लाई जा रही हैं…" />}
            {news.isError && <ErrorBlock onRetry={() => news.refetch()} label="खबरें लोड नहीं हो सकीं" />}
            {!news.isLoading && !news.isError && (news.data ?? []).length === 0 && <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] p-8 text-center text-[14px] text-[hsl(var(--muted-foreground))]" data-testid="state-empty-news">अभी कोई नई खबर नहीं है।</div>}
            {(news.data ?? []).slice(0, 4).map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.id} className="group grid grid-cols-[6px_1fr_auto] items-start gap-4 rounded-2xl border border-transparent bg-[hsl(var(--background)/.58)] p-4 no-underline transition-colors hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--card))]" data-testid={`link-news-${item.id}`}><span className="mt-1 h-10 rounded-full" style={{ backgroundColor: item.accent }} /><span><span className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{item.source}<span className="h-1 w-1 rounded-full bg-[hsl(var(--muted-foreground)/.5)]" />{item.timestamp}</span><span className="block text-[14px] font-semibold leading-6 text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]">{item.title}</span></span><ArrowRight size={15} className="mt-2 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-1" /></a>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[28px] bg-[hsl(var(--primary))] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <div className="relative"><p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[hsl(var(--accent))]">जब मन में सवाल हो</p><h2 className="max-w-xl text-[clamp(1.8rem,3.5vw,3.1rem)] font-bold leading-tight tracking-[-.05em]">पहला कदम मुश्किल नहीं होना चाहिए।</h2><p className="mt-3 text-[14px] leading-7 text-white/70">अपनी समस्या लिखिए। हम उसे सही कानूनी दिशा में बदलने में मदद करेंगे।</p></div>
          <Link href="/request" className="group relative mt-7 inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[hsl(var(--accent))] px-6 py-3.5 text-[14px] font-bold text-[hsl(var(--accent-foreground))] no-underline transition-transform hover:-translate-y-0.5 lg:mt-0" data-testid="link-bottom-request">निवेदन शुरू करें <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </section>
    </div>
  );
}

function ShieldDot() {
  return <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))]"><span className="h-1 w-1 rounded-full bg-[hsl(var(--primary))]" /></span>;
}