import { buildMetadata, jsonLd } from '@/lib/seo';
import Link from 'next/link';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import QrGenerator from './QrGenerator';

const pageTitle = 'Free QR Code Generator — URL to QR Code in Seconds';
const pageDescription =
  'Free QR code generator: turn any URL into a QR code and download it as SVG, PNG, or JPEG — no sign-up required. Upgrade for custom styles, logos, and QR scan tracking.';

export const metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/generate',
  keywords: [
    'free QR code generator',
    'QR code generator',
    'URL to QR code',
    'link QR code generator',
    'QR code generator no sign up',
    'SVG QR code generator',
    'custom QR code with logo',
    'tracked QR code',
    'dynamic QR code',
    'QR code scan analytics',
  ],
});

const faqs = [
  {
    question: 'Can I create a QR code for free?',
    answer:
      'Yes. Paste a complete web address, choose one of the three basic styles, and export the QR code as SVG, PNG, or JPEG. Basic generation does not require an account.',
  },
  {
    question: 'What is a tracked QR code?',
    answer:
      'A tracked QR code contains a Lixrl short link. When someone scans it, the redirect records activity that the link owner can review in the dashboard.',
  },
  {
    question: 'Which QR features require a paid plan?',
    answer:
      'Pro and Business unlock the complete style catalog, custom center logos, and the tracked QR workflow. Business keeps scan activity history for longer.',
  },
  {
    question: 'Which download format should I use?',
    answer:
      'SVG is best for print because it stays sharp at any size. PNG preserves crisp detail for digital use. JPEG produces a smaller shareable image and can be copied directly in supported browsers.',
  },
];

export default function QrCodeGeneratorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Lixrl Quick QR Code Generator',
        url: 'https://lixrl.com/generate',
        description: pageDescription,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires a modern web browser',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Basic QR code generation with three styles',
        },
        featureList: [
          'Generate a QR code from a URL',
          'Download QR codes as SVG, PNG, or JPEG',
          'Copy a compressed JPEG QR code to the clipboard',
          'Choose QR code styles',
          'Add a custom logo on paid plans',
          'Track QR code scans on paid plans',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://lixrl.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'QR Code Generator',
            item: 'https://lixrl.com/generate',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <div className="theme-light min-h-screen bg-paper text-ink">
      <Navbar />

      <main id="main-content">
        <section
          className="shell flex min-h-[calc(100svh-72px)] flex-col pb-12 pt-10 md:pt-14"
          aria-labelledby="qr-generator-heading"
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 id="qr-generator-heading" className="display-2">
                Create a QR code
              </h1>
              <p className="lede mt-3">Paste a link. Pick a style. Download instantly.</p>
            </div>
            <p className="badge border border-line bg-white text-[#5f6962]">Free · No account required</p>
          </div>
          <QrGenerator />
        </section>

        <section className="shell grid gap-10 border-t border-line py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="tracked-qr-codes">
          <div>
            <p className="eyebrow">Optional scan tracking</p>
            <h2 id="tracked-qr-codes" className="display-2 !text-[clamp(2rem,4.5vw,3.6rem)]">
              Make the QR code measurable
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#5f6962]">
              A normal QR code opens the destination directly. A tracked QR code opens a Lixrl short link first, so paid members can review scan activity without changing the printed code.
            </p>
            <Link href="/pricing" className="btn-primary mt-6">
              Compare QR features
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="glass-card p-6">
              <h3 className="text-xl font-bold tracking-[-0.04em]">Basic QR code</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f6962]">
                <li>Directly opens the destination URL</li>
                <li>Three included visual styles</li>
                <li>SVG, PNG, and JPEG exports</li>
                <li>Compressed JPEG clipboard copy</li>
                <li>No account required</li>
              </ul>
            </article>
            <article className="rounded-[1.4rem] border border-[rgba(49,95,202,0.18)] bg-[#dce7ff] p-6">
              <h3 className="text-xl font-bold tracking-[-0.04em]">Tracked QR code</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f6962]">
                <li>Uses a persistent Lixrl short link</li>
                <li>Complete visual style catalog</li>
                <li>Custom center logo</li>
                <li>Scan activity in the dashboard</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mx-auto w-[min(calc(100%-2rem),1000px)] pb-20 md:pb-28" aria-labelledby="qr-faq">
          <div className="text-center">
            <p className="eyebrow">QR code questions</p>
            <h2 id="qr-faq" className="display-2 !text-[clamp(2rem,4.5vw,3.6rem)]">Everything needed before downloading</h2>
          </div>
          <div className="mt-8 divide-y divide-[#d7dbd6] rounded-[1.4rem] border border-line bg-white px-5 md:px-7">
            {faqs.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d7dbd6] text-lg font-normal text-[#5f6962] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pr-10 pt-3 text-sm leading-6 text-[#5f6962]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
      </main>

      <Footer />
    </div>
  );
}
