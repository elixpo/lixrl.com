import Link from 'next/link';

/** Shared 404 surface for app/not-found.tsx and the /not-found fallback route. */
export default function NotFoundView() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-4 py-16 text-center"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="hero-orbit right-[-160px] top-[-120px] h-[420px] w-[420px] after:left-[42px] after:top-[55px] after:bg-[#3f7cec]" />
        <span className="hero-orbit -bottom-[110px] -left-[110px] h-[260px] w-[260px] after:right-[27px] after:top-[28px] after:bg-[#e76043]" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <Link href="/" aria-label="Lixrl home" className="mb-10">
          <img src="/base_logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full object-contain" />
        </Link>
        <p className="eyebrow">Error 404</p>
        <p className="mb-4 font-mono text-[clamp(4.5rem,18vw,8rem)] font-bold leading-none tracking-[-0.06em]" aria-hidden="true">
          404
        </p>
        <h1 className="display-2 mb-4 !text-[clamp(2rem,6vw,3.2rem)]">
          Link <em>not found.</em>
        </h1>
        <p className="lede mb-10 max-w-md">
          This short link doesn&apos;t exist, has expired, or has been removed.
          Double-check the URL or head back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/api/auth/login" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
