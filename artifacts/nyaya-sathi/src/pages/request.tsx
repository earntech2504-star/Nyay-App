import { useState, type FormEvent, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { getGetLegalOverviewQueryKey, useCreateLegalRequest, useListCaseModels } from '@workspace/api-client-react';
import { ErrorBlock, SectionEyebrow } from '@/components/shell';

type FormState = { name: string; phone: string; caseModel: string; message: string };

export default function Request() {
  const queryClient = useQueryClient();
  const cases = useListCaseModels();
  const createRequest = useCreateLegalRequest();
  const [submitted, setSubmitted] = useState<{ id: string; status: string; createdAt: string } | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const initialCase = new URLSearchParams(window.location.search).get('case') ?? '';
  const [form, setForm] = useState<FormState>({ name: '', phone: '', caseModel: initialCase, message: '' });

  const selectedCase = cases.data?.find((item) => item.id === form.caseModel);
  const canSubmit = form.name.trim().length >= 2 && form.phone.trim().length >= 10 && form.caseModel.length > 0 && form.message.trim().length >= 10;
  function update(field: keyof FormState, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || createRequest.isPending) return;
    createRequest.mutate({ data: form }, { onSuccess: (request) => {
      setSubmitted(request);
      queryClient.invalidateQueries({ queryKey: getGetLegalOverviewQueryKey() });
    } });
  }

  if (submitted) return <SuccessView request={submitted} paymentOpen={paymentOpen} setPaymentOpen={setPaymentOpen} />;

  return <div>
    <section className="blue-wash border-b border-[hsl(var(--border))]">
      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-10 lg:px-8 lg:pb-16 lg:pt-14">
        <Link href="/cases" className="mb-8 inline-flex items-center gap-2 text-[12px] font-bold text-[hsl(var(--muted-foreground))] no-underline hover:text-[hsl(var(--primary))]" data-testid="link-back-cases"><ArrowLeft size={15} /> सेवाओं पर वापस जाएँ</Link>
        <SectionEyebrow>आपकी बात से शुरुआत</SectionEyebrow><h1 className="max-w-2xl text-[clamp(2.25rem,5vw,4.4rem)] font-bold leading-[1.06] tracking-[-.06em]">अपनी स्थिति<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">हमें बताइए।</span></h1><p className="mt-5 max-w-xl text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">जितना सहज होकर लिखेंगे, उतना बेहतर हम समझ पाएँगे। कोई कठिन कानूनी भाषा ज़रूरी नहीं है।</p>
      </div>
    </section>
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 lg:grid-cols-[1.15fr_.7fr] lg:px-8 lg:py-20">
      <form onSubmit={submit} className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 card-shadow sm:p-8" data-testid="form-legal-request">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-6"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">निवेदन 01</p><h2 className="mt-1 text-[21px] font-bold tracking-[-.03em]">आपसे जुड़ी कुछ बातें</h2></div><span className="text-[11px] text-[hsl(var(--muted-foreground))]">लगभग 2 मिनट</span></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="आपका नाम" htmlFor="request-name"><input id="request-name" required minLength={2} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="पूरा नाम" className="field-input" data-testid="input-request-name" /></Field>
          <Field label="फोन नंबर" htmlFor="request-phone"><input id="request-phone" required minLength={10} value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="10 अंकों का नंबर" inputMode="tel" className="field-input" data-testid="input-request-phone" /></Field>
          <Field label="आपकी स्थिति किससे जुड़ी है?" htmlFor="request-case" wide><select id="request-case" required value={form.caseModel} onChange={(event) => update('caseModel', event.target.value)} className="field-input appearance-none" data-testid="select-request-case"><option value="">सेवा चुनें</option>{cases.isLoading && <option disabled>सेवाएँ लाई जा रही हैं…</option>}{(cases.data ?? []).map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></Field>
          <Field label="अपनी बात अपने शब्दों में लिखें" htmlFor="request-message" wide><textarea id="request-message" required minLength={10} rows={7} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="घटना कब और कहाँ हुई? अभी सबसे बड़ी परेशानी क्या है? अगर कोई तारीख या नोटिस है, तो उसका ज़िक्र करें।" className="field-input resize-y leading-6" data-testid="textarea-request-message" /></Field>
        </div>
        {cases.isError && <div className="mt-5"><ErrorBlock onRetry={() => cases.refetch()} label="सेवाओं की सूची नहीं आ सकी" /></div>}
        {createRequest.isError && <p className="mt-5 rounded-xl bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-[12px] text-[hsl(var(--destructive))]" data-testid="state-request-error">निवेदन भेजा नहीं जा सका। कृपया जानकारी जाँचकर फिर कोशिश करें।</p>}
        <div className="mt-7 flex flex-col-reverse gap-4 border-t border-[hsl(var(--border))] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]"><LockKeyhole size={14} className="shrink-0 text-[hsl(var(--primary))]" /> आपकी जानकारी सुरक्षित रखी जाती है</p><button type="submit" disabled={!canSubmit || createRequest.isPending} className="group inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[hsl(207_72%_31%)] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-submit-request">{createRequest.isPending ? 'निवेदन भेज रहे हैं…' : 'निवेदन भेजें'} {!createRequest.isPending && <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />}</button></div>
      </form>
      <aside className="space-y-5">
        <div className="rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-6"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">आप क्या उम्मीद कर सकते हैं</p><div className="mt-6 space-y-5"><Step number="01" title="हम आपकी बात पढ़ेंगे" text="आपके निवेदन को देखकर सही दिशा और अगला सवाल तय करेंगे।" /><Step number="02" title="एक व्यक्ति आपसे बात करेगा" text="आमतौर पर 24 घंटे के भीतर, आपके लिए सुविधाजनक समय पर।" /><Step number="03" title="आगे का रास्ता साफ़ होगा" text="फीस, समय और ज़रूरी दस्तावेज़ पहले ही स्पष्ट किए जाएँगे।" /></div></div>
        {selectedCase ? <div className="rounded-[24px] border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--card))] p-6 card-shadow"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">आपने चुना है</p><p className="mt-2 text-[17px] font-bold text-[hsl(var(--foreground))]">{selectedCase.title}</p><p className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{selectedCase.turnaround} · शुरुआत {selectedCase.startingFee}</p></div> : <div className="rounded-[24px] border border-dashed border-[hsl(var(--border))] p-6"><p className="text-[13px] font-bold text-[hsl(var(--foreground))]">पता नहीं कौन-सी सेवा चुनें?</p><Link href="/ai-guide" className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[hsl(var(--primary))] no-underline" data-testid="link-request-guide">पहले मार्गदर्शन लें <ArrowRight size={13} /></Link></div>}
      </aside>
    </section>
  </div>;
}

function Field({ label, htmlFor, children, wide = false }: { label: string; htmlFor: string; children: ReactNode; wide?: boolean }) {
  return <label htmlFor={htmlFor} className={wide ? 'sm:col-span-2' : ''}><span className="mb-2 block text-[12px] font-bold text-[hsl(var(--foreground))]">{label}</span>{children}</label>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="flex gap-3"><span className="font-mono text-[11px] font-bold text-[hsl(var(--primary))]">{number}</span><div><p className="text-[13px] font-bold text-[hsl(var(--foreground))]">{title}</p><p className="mt-1 text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">{text}</p></div></div>;
}

function SuccessView({ request, paymentOpen, setPaymentOpen }: { request: { id: string; status: string; createdAt: string }; paymentOpen: boolean; setPaymentOpen: (value: boolean) => void }) {
  return <div className="mx-auto min-h-[65dvh] max-w-[900px] px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-2xl text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={32} strokeWidth={1.7} /></div><p className="mt-7 text-[11px] font-bold uppercase tracking-[.2em] text-[hsl(var(--primary))]">निवेदन प्राप्त हुआ</p><h1 className="mt-3 text-[clamp(2rem,4vw,3.7rem)] font-bold leading-tight tracking-[-.06em]">अब आपकी बात<br /><span className="font-display font-normal italic text-[hsl(var(--primary))]">हमारे पास है।</span></h1><p className="mx-auto mt-5 max-w-lg text-[14px] leading-7 text-[hsl(var(--muted-foreground))]">हम आपके निवेदन को देखकर {request.status || 'जल्द'} आपसे बात करेंगे। इस पेज को संभालकर रखें।</p><p className="mt-3 font-mono text-[11px] text-[hsl(var(--muted-foreground))]" data-testid="text-request-id">निवेदन आईडी · {request.id}</p></div>
    <div className="mx-auto mt-12 grid max-w-2xl gap-3 sm:grid-cols-3"><button type="button" onClick={() => setPaymentOpen(true)} className="flex flex-col items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--primary)/.35)]" data-testid="button-payment"><CreditCard size={20} className="text-[hsl(var(--primary))]" /><span className="text-[12px] font-bold text-[hsl(var(--foreground))]">भुगतान करें</span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">सुरक्षित payment</span></button><a href="https://wa.me/915224041717" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center no-underline transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--primary)/.35)]" data-testid="link-whatsapp"><MessageCircle size={20} className="text-[hsl(var(--primary))]" /><span className="text-[12px] font-bold text-[hsl(var(--foreground))]">WhatsApp पर बात करें</span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">संदेश भेजें</span></a><a href="tel:+915224041717" className="flex flex-col items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center no-underline transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--primary)/.35)]" data-testid="link-call"><Phone size={20} className="text-[hsl(var(--primary))]" /><span className="text-[12px] font-bold text-[hsl(var(--foreground))]">सीधे कॉल करें</span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">0522 404 1717</span></a></div>
    {paymentOpen && <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[hsl(var(--accent)/.45)] bg-[hsl(var(--accent)/.15)] p-5 text-center" data-testid="panel-payment"><p className="font-bold text-[13px] text-[hsl(var(--foreground))]">भुगतान की जानकारी जल्द साझा की जाएगी</p><p className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">पहले आपकी बात और सेवा की ज़रूरत समझना ज़रूरी है। टीम आपसे संपर्क करके सुरक्षित payment link देगी।</p><button type="button" onClick={() => setPaymentOpen(false)} className="mt-3 text-[11px] font-bold text-[hsl(var(--primary))]" data-testid="button-close-payment">समझ गया</button></div>}
    <div className="mt-12 flex justify-center"><Link href="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--primary))] no-underline" data-testid="link-success-home">होम पर जाएँ <ArrowRight size={15} /></Link></div><p className="mt-8 flex justify-center items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]"><ShieldCheck size={14} /> आपकी जानकारी गोपनीय रखी जाएगी</p>
  </div>;
}