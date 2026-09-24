import { useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FilePenLine, RotateCcw, Sparkles, TriangleAlert } from 'lucide-react';
import { useGetLegalGuidance } from '@workspace/api-client-react';
import { SectionEyebrow } from '@/components/shell';

const intents = [
  { value: 'समझना है कि आगे क्या करना है', label: 'अगला कदम समझना है', icon: ClipboardList },
  { value: 'किसी नोटिस या पत्र का जवाब देना है', label: 'नोटिस का जवाब देना है', icon: FilePenLine },
  { value: 'शिकायत या आवेदन लिखना है', label: 'शिकायत / आवेदन लिखना है', icon: BookOpen },
];

export default function AiGuide() {
  const [intent, setIntent] = useState(intents[0].value);
  const [context, setContext] = useState('');
  const guidance = useGetLegalGuidance();
  const response = guidance.data;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (context.trim().length < 5 || guidance.isPending) return;
    guidance.mutate({ data: { intent, context: context.trim() } });
  }

  return <div>
    <section className="blue-wash paper-grid border-b border-[hsl(var(--border))]">
      <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-18">
        <SectionEyebrow>शब्दों से रास्ते तक</SectionEyebrow>
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div><h1 className="max-w-xl text-[clamp(2.35rem,5vw,4.7rem)] font-bold leading-[1.05] tracking-[-.06em]">पहले बात को<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">साफ़ कीजिए।</span></h1><p className="mt-5 max-w-lg text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">आप जो कहना चाहते हैं, वह लिखिए। यह मार्गदर्शक आपको अगले कदम और ज़रूरी भाषा को व्यवस्थित करने में मदद करेगा।</p></div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/80 bg-[hsl(var(--background)/.62)] p-5"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white"><Sparkles size={22} /></div><div><p className="text-[14px] font-bold text-[hsl(var(--foreground))]">एक बात याद रखें</p><p className="mt-1 text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">यह सामान्य जानकारी है, आपके मामले की अंतिम कानूनी राय नहीं।</p></div></div>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 lg:grid-cols-[.78fr_1.22fr] lg:px-8 lg:py-20">
      <div>
        <div className="mb-7 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--primary))] text-[12px] font-bold text-white">1</span><span className="text-[13px] font-bold text-[hsl(var(--foreground))]">आपको किस तरह की मदद चाहिए?</span></div>
        <div className="space-y-2">{intents.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => setIntent(value)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${intent === value ? 'border-[hsl(var(--primary)/.45)] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] shadow-sm' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.25)]'}`} data-testid={`button-intent-${value.slice(0, 8)}`}><span className={`grid h-9 w-9 place-items-center rounded-xl ${intent === value ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`}><Icon size={17} /></span><span className="text-[13px] font-semibold">{label}</span>{intent === value && <CheckCircle2 size={17} className="ml-auto" />}</button>)}</div>
        <div className="mt-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-5"><p className="flex items-center gap-2 text-[12px] font-bold text-[hsl(var(--foreground))]"><TriangleAlert size={15} className="text-[hsl(var(--accent-foreground))]" /> सुरक्षित और उपयोगी जवाब के लिए</p><p className="mt-2 text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">नाम, फोन नंबर या कोई पहचान वाली जानकारी यहाँ न लिखें। तारीख, जगह और घटना का संक्षिप्त विवरण काफ़ी है।</p></div>
      </div>
      <div>
        <div className="mb-7 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--primary))] text-[12px] font-bold text-white">2</span><span className="text-[13px] font-bold text-[hsl(var(--foreground))]">थोड़ा संदर्भ दीजिए</span></div>
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 card-shadow sm:p-7" data-testid="form-guidance">
          <label htmlFor="guidance-context" className="text-[13px] font-bold text-[hsl(var(--foreground))]">आपके साथ क्या हुआ?</label>
          <textarea id="guidance-context" value={context} onChange={(event) => setContext(event.target.value)} rows={7} minLength={5} placeholder="उदाहरण: मुझे किराएदार को बकाया किराए के लिए नोटिस देना है। किराया तीन महीने से नहीं मिला और मकान लखनऊ में है।" className="mt-3 w-full resize-y rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-[14px] leading-7 text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary)/.5)] focus:ring-4 focus:ring-[hsl(var(--primary)/.08)]" data-testid="textarea-guidance-context" />
          <div className="mt-5 flex items-center justify-between gap-4"><span className="text-[11px] text-[hsl(var(--muted-foreground))]">{context.length} अक्षर</span><button type="submit" disabled={context.trim().length < 5 || guidance.isPending} className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[hsl(207_72%_31%)] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-get-guidance">{guidance.isPending ? 'समझ रहे हैं…' : 'मार्गदर्शन पाएँ'} {!guidance.isPending && <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />}</button></div>
          {guidance.isError && <p className="mt-4 rounded-xl bg-[hsl(var(--destructive)/.07)] px-3 py-2 text-[12px] text-[hsl(var(--destructive))]" data-testid="state-guidance-error">मार्गदर्शन अभी उपलब्ध नहीं है। कृपया दोबारा कोशिश करें।</p>}
        </form>
        {response && <div className="mt-8 rounded-[24px] border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--secondary)/.5)] p-5 sm:p-7" data-testid="card-guidance-response">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">आपके लिए मार्गदर्शन</p><h2 className="mt-2 text-[23px] font-bold tracking-[-.04em] text-[hsl(var(--foreground))]">{response.title}</h2></div><button type="button" onClick={() => guidance.reset()} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]" aria-label="मार्गदर्शन हटाएँ" data-testid="button-clear-guidance"><RotateCcw size={16} /></button></div>
          <p className="mt-4 text-[14px] leading-7 text-[hsl(var(--muted-foreground))]">{response.summary}</p>
          <div className="mt-6 space-y-3">{response.steps.map((step, index) => <div key={`${step}-${index}`} className="flex gap-3 rounded-xl bg-[hsl(var(--card)/.7)] p-3.5"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary))] text-[11px] font-bold text-white">{index + 1}</span><p className="pt-0.5 text-[13px] leading-6 text-[hsl(var(--foreground))]">{step}</p></div>)}</div>
          <div className="mt-6 border-t border-[hsl(var(--primary)/.15)] pt-4"><p className="text-[11px] leading-5 text-[hsl(var(--muted-foreground))]"><strong className="text-[hsl(var(--foreground))]">ध्यान दें: </strong>{response.disclaimer}</p></div>
        </div>}
      </div>
    </section>
  </div>;
}