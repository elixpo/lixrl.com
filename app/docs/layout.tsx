'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DOCS_NAV } from '@/lib/docs-sections';
import { LLM_TEXT } from './llm_text';

export const runtime = 'edge';

const ACCENT = '#3a65c7';
const REPO_URL = 'https://github.com/elixpo/elixpourl';

// Sidebar entries come from lib/docs-sections.ts (shared with sitemap + metadata).

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [copied, setCopied] = useState(false);

  // Return the full abstract API reference text directly.
  const buildLlmPayload = (): string => {
    return LLM_TEXT;
  };

  const handleCopyForLlm = async () => {
    const payload = buildLlmPayload();
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = payload;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      } catch {
        /* give up silently */
      }
      document.body.removeChild(ta);
    }
  };

  // Build the TOC from the page's h2/h3 every time the route changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const contentEl = document.getElementById('docs-content');
    if (!contentEl) return;
    const headingElements = contentEl.querySelectorAll('h2, h3');
    const list: HeadingItem[] = [];
    headingElements.forEach((el) => {
      const level = Number.parseInt(el.tagName.substring(1), 10);
      const heading = el.cloneNode(true) as HTMLElement;
      heading.querySelectorAll('[data-toc-ignore]').forEach((node) =>
        node.remove(),
      );
      const text = (heading.textContent || '').trim();
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        el.id = id;
      }
      list.push({ id, text, level });
    });
    setHeadings(list);
  }, [pathname]);

  // Highlight the heading whose section is currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveHeadingId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    const contentEl = document.getElementById('docs-content');
    if (contentEl) {
      const targets = contentEl.querySelectorAll('h2, h3');
      targets.forEach((target) => {
        observer.observe(target);
      });
    }
    return () => observer.disconnect();
  }, [headings]);

  const filteredNav = useMemo(
    () =>
      DOCS_NAV.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const currentPageIndex = DOCS_NAV.findIndex((i) => i.href === pathname);
  const prevPage =
    currentPageIndex > 0 ? DOCS_NAV[currentPageIndex - 1] : null;
  const nextPage =
    currentPageIndex < DOCS_NAV.length - 1
      ? DOCS_NAV[currentPageIndex + 1]
      : null;

  const sidebarContent = (
    <div className="h-full flex flex-col p-4">
      {/* Search */}
      <div className="relative mb-5">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6962]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search docs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-h-[40px] pl-9 pr-3 py-2 text-sm rounded-full outline-none bg-white text-[#1d2b22] placeholder:text-[#737b75] transition-colors"
          style={{
            background: '#ffffff',
            border: '1px solid #d7dbd6',
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = ACCENT)
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = '#d7dbd6')
          }
        />
      </div>

      <nav aria-label="Documentation" className="flex-1 overflow-y-auto">
        <ul className="list-none p-0 space-y-1">
          {filteredNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className="flex min-h-[40px] items-center px-4 rounded-full text-sm no-underline transition-colors"
                  style={{
                    background: active
                      ? '#eff1ed'
                      : 'transparent',
                    color: active
                      ? '#142018'
                      : '#3d4842',
                    fontWeight: active ? 600 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background =
                          'rgba(20,32,24,0.05)';
                      e.currentTarget.style.color =
                          'rgba(20,32,24,0.9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#3d4842';
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          {filteredNav.length === 0 && (
            <li className="text-sm text-[#68716b] text-center py-4">
              No results found
            </li>
          )}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="theme-light relative min-h-screen bg-paper text-ink">
      <a href="#docs-content" className="skip-link">Skip to content</a>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top app bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl"
          style={{
            background: 'rgba(251, 251, 248, 0.92)',
            borderBottom: '1px solid #d7dbd6',
          }}
        >
          <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 h-[60px] flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open sidebar"
              aria-expanded={mobileOpen}
              className="md:hidden w-11 h-11 inline-flex items-center justify-center rounded-full bg-white text-[#142018]"
              style={{ border: '1px solid rgba(20,32,24,0.10)' }}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link href="/" aria-label="Lixrl home" className="flex items-center gap-3 no-underline text-[#142018]">
              <img
                src="/base_logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-contain"
              />
              <span className="flex items-baseline gap-1.5">
                <b className="text-base tracking-tight">Lixrl</b>
                <small className="text-[0.72rem] text-[#5f6962]">Docs</small>
              </span>
            </Link>

            <div className="flex-1" />

            <button
              type="button"
              onClick={handleCopyForLlm}
              title={copied ? 'Copied!' : 'Copy this page as plain text to paste into an LLM'}
              className="hidden sm:inline-flex min-h-[44px] items-center gap-2 px-4 rounded-full text-[0.78rem] font-bold transition-all"
              style={{
                color: copied ? '#0b623c' : '#142018',
                border: '1px solid #142018',
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.background = '#eff1ed';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.color = '#142018';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#142018';
                }
              }}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
              {copied ? 'Copied' : 'Copy for LLM'}
            </button>

            <Link
              href="/dashboard"
              className="hidden md:inline-flex min-h-[44px] items-center gap-2 px-4 rounded-full text-[0.78rem] font-bold no-underline transition-colors"
              style={{ color: '#142018' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#142018';
                e.currentTarget.style.background = 'rgba(20,32,24,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#142018';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              Dashboard
            </Link>

            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub (opens in a new tab)"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-line text-[#142018] hover:bg-paper-deep transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </header>

        <div className="max-w-[1400px] w-full mx-auto px-2 md:px-6 flex-1 flex">
          {/* Sidebar — fixed on desktop, drawer on mobile */}
          <aside
            className="hidden md:block w-[260px] flex-shrink-0 sticky top-[60px] self-start"
            style={{
              height: 'calc(100vh - 60px)',
              borderRight: '1px solid rgba(20,32,24,0.08)',
            }}
          >
            {sidebarContent}
          </aside>

          {/* Mobile drawer overlay */}
          {mobileOpen && (
            <button
              type="button"
              aria-label="Close sidebar"
              className="md:hidden fixed inset-0 z-40 bg-[rgba(20,32,24,0.35)] backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            className={`md:hidden fixed top-[60px] left-0 bottom-0 w-[280px] z-50 transition-transform duration-200 ease-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
              background: 'rgba(251,251,248,0.98)',
              backdropFilter: 'blur(16px)',
              borderRight: '1px solid rgba(20,32,24,0.10)',
            }}
          >
            {sidebarContent}
          </aside>

          {/* Main content + right TOC */}
          <div className="flex-1 min-w-0 flex">
            <main
              id="docs-content"
              className="flex-1 min-w-0 px-4 md:px-10 py-10 md:py-12"
            >
              {children}

              {/* Prev/Next */}
              {(prevPage || nextPage) && (
                <div
                  className="mt-16 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
                  style={{ borderTop: '1px solid rgba(20,32,24,0.10)' }}
                >
                  {prevPage ? (
                    <Link
                      href={prevPage.href}
                      className="p-4 rounded-xl no-underline transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.98)',
                        border: '1px solid rgba(20,32,24,0.10)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(58,101,199,0.35)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(20,32,24,0.10)')
                      }
                    >
                      <div className="text-[0.7rem] uppercase tracking-wider text-white/45 mb-1">
                        ← Previous
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {prevPage.label}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextPage && (
                    <Link
                      href={nextPage.href}
                      className="p-4 rounded-xl no-underline transition-colors text-right"
                      style={{
                        background: 'rgba(255,255,255,0.98)',
                        border: '1px solid rgba(20,32,24,0.10)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(58,101,199,0.35)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(20,32,24,0.10)')
                      }
                    >
                      <div className="text-[0.7rem] uppercase tracking-wider text-white/45 mb-1">
                        Next →
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {nextPage.label}
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {/* Edit on GitHub */}
              <div className="mt-10 text-sm text-white/45">
                <a
                  href={`${REPO_URL}/blob/main/app${pathname === '/docs' ? '/docs/page.tsx' : `${pathname}/page.tsx`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/55 hover:text-white transition-colors no-underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Edit this page on GitHub
                </a>
              </div>
            </main>

            {/* Right rail TOC */}
            {headings.length > 0 && (
              <aside
                className="hidden xl:block w-[220px] flex-shrink-0 sticky top-[60px] self-start"
                style={{ height: 'calc(100vh - 60px)' }}
              >
                <div className="p-6">
                  <div className="font-mono text-[0.63rem] font-bold tracking-[0.14em] uppercase text-[#5f6962] mb-3">
                    On this page
                  </div>
                  <ul className="list-none p-0 space-y-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="block text-sm no-underline transition-colors"
                          style={{
                            color:
                              activeHeadingId === h.id
                                ? ACCENT
                                : 'rgba(20,32,24,0.55)',
                            paddingLeft: h.level === 3 ? '0.75rem' : '0',
                            fontWeight:
                              activeHeadingId === h.id ? 600 : 400,
                          }}
                          onMouseEnter={(e) => {
                            if (activeHeadingId !== h.id)
                              e.currentTarget.style.color =
                                'rgba(20,32,24,0.85)';
                          }}
                          onMouseLeave={(e) => {
                            if (activeHeadingId !== h.id)
                              e.currentTarget.style.color =
                                'rgba(20,32,24,0.55)';
                          }}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
