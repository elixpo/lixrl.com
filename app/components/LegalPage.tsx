import type { ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

export interface LegalSummary {
  title: string;
  detail: string;
}

export interface LegalNavItem {
  id: string;
  label: string;
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  summaries,
  navigation,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  summaries: LegalSummary[];
  navigation: LegalNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="theme-light min-h-screen bg-paper text-ink">
      <Navbar />
      <main id="main-content" className="shell pb-24 pt-12 md:pt-20">
        <header className="max-w-5xl border-b border-line pb-12">
          <p className="eyebrow">
            {eyebrow}
          </p>
          <h1 className="display-1">
            {title}
          </h1>
          <p className="lede mt-6 max-w-2xl">
            {intro}
          </p>
        </header>

        <section aria-label="At a glance" className="mt-10 grid gap-3 md:grid-cols-3">
          {summaries.map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-line bg-white p-6">
              <h2 className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#2f56b0]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f6962]">{item.detail}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <p className="mb-3 font-mono text-[0.63rem] font-bold uppercase tracking-[0.14em] text-[#5f6962]">
              On this page
            </p>
            <nav aria-label="Page sections" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold text-[#5f6962] no-underline transition-colors hover:bg-[#eef2ff] hover:text-[#2f56b0]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 max-w-3xl space-y-10 text-[15px] leading-7 text-[#3d4842] md:text-base">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line pt-8 first:border-0 first:pt-0">
      <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.05em] text-ink">{title}</h2>
      <div className="space-y-4 [&_a]:font-medium [&_a]:text-green [&_a]:underline [&_a]:decoration-[#9cc4ad] [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

export function LegalNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.2rem] bg-[#dce7ff] px-5 py-4 text-sm leading-6 text-[#3d4842]">
      {children}
    </div>
  );
}
