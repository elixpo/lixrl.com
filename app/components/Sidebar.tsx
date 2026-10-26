'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/lib/types';

function getAvatarUrl(user: User): string {
  if (user.avatar_url) return user.avatar_url;
  return `https://accounts.elixpo.com/api/avatar/${user.elixpo_id}`;
}

// SVG Icons
const Icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="2" y="2" width="7" height="8" rx="1.5" />
      <rect x="11" y="2" width="7" height="5" rx="1.5" />
      <rect x="2" y="12" width="7" height="6" rx="1.5" />
      <rect x="11" y="9" width="7" height="9" rx="1.5" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M8.5 11.5a4 4 0 005.5 0l2.5-2.5a4 4 0 00-5.5-5.5L9.5 5" />
      <path d="M11.5 8.5a4 4 0 00-5.5 0L3.5 11a4 4 0 005.5 5.5l1.5-1.5" />
    </svg>
  ),
  domain: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2 2.1 3 4.6 3 7.5s-1 5.4-3 7.5M10 2.5C8 4.6 7 7.1 7 10s1 5.4 3 7.5" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[18px] h-[18px]">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 7v6M7 10h6" />
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="12" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="2.5" y="12" width="5.5" height="5.5" rx="1" />
      <path d="M12 12h2v2h3.5M12 17.5v-2h2" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="10" cy="7" r="3.5" />
      <path d="M3.5 17.5c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="7.5" cy="12.5" r="3.5" />
      <path d="M10.2 9.8L16 4M14 4l2 2M12.5 6.5l2 2" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="2" y="3" width="16" height="11" rx="2" />
      <path d="M7 17h6M10 14v3" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="7" cy="7" r="3" />
      <circle cx="14" cy="8" r="2.5" />
      <path d="M1.5 17c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <path d="M13 12c2 0 4 1.5 4 4" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M6 7h8M6 10h8M6 13h4" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="M6 8l4 4 4-4" />
    </svg>
  ),
  billing: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="2" y="4.5" width="16" height="11" rx="2" />
      <path d="M2 8h16M5 12.5h3" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M10 2.5l1.6 4.3 4.4 1.7-4.4 1.7L10 14.5l-1.6-4.3L4 8.5l4.4-1.7L10 2.5z" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M5 3h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M6 7h6M6 10h6M6 13h4" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M10 2.5l6 2.2v4.3c0 4-2.7 6.6-6 8-3.3-1.4-6-4-6-8V4.7l6-2.2z" />
    </svg>
  ),
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/dashboard/urls', label: 'My URLs', icon: Icons.link },
  { href: '/dashboard/new', label: 'Shorten URL', icon: Icons.plus },
  { href: '/generate', label: 'QR Generator', icon: Icons.qr },
  { href: '/dashboard/domains', label: 'Subdomains', icon: Icons.domain },
];

const accountItems = [
  { href: '/dashboard/subscription', label: 'Subscription & billing', icon: Icons.billing },
  { href: '/profile', label: 'Profile', icon: Icons.user },
  { href: '/profile/keys', label: 'API Keys', icon: Icons.key },
];

// Secondary links shown lower in the dropdown.
const resourceItems = [
  { href: '/generate', label: 'Generate QR code', icon: Icons.qr },
  { href: '/pricing', label: 'Plans & pricing', icon: Icons.sparkle },
  { href: '/docs', label: 'Docs', icon: Icons.docs },
];

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const avatarUrl = getAvatarUrl(user);
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/profile') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Icon + text on lg; icon-only (with a native tooltip) below lg.
  const NavPill = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={isActive(href) ? 'page' : undefined}
      className={`group flex items-center gap-2 h-10 min-w-10 justify-center px-2.5 lg:px-3.5 rounded-full transition-colors duration-200 no-underline ${
        isActive(href)
          ? 'text-ink bg-paper-deep font-semibold'
          : 'text-[#3d4842] hover:text-ink hover:bg-paper-deep'
      }`}
    >
      <span aria-hidden="true" className={isActive(href) ? 'text-accent-deep' : 'opacity-70 group-hover:opacity-100'}>
        {icon}
      </span>
      <span className="hidden lg:inline text-[0.8rem] font-semibold">{label}</span>
    </Link>
  );

  return (
    <header
      className="fixed left-1/2 top-2 z-30 flex h-[60px] w-[min(calc(100%-1rem),1450px)] -translate-x-1/2 items-center justify-between gap-2 rounded-full border border-[rgba(20,32,24,0.14)] bg-[rgba(251,251,248,0.92)] pl-4 pr-2 shadow-header backdrop-blur-[18px] sm:top-3.5 sm:h-[68px] sm:w-[min(calc(100%-2rem),1450px)] sm:pl-5 sm:pr-3"
    >
      {/* Left: Logo */}
      <Link href="/?noredirect=1" aria-label="Lixrl home" className="flex items-center gap-3 no-underline shrink-0 text-ink">
        <Image src="/base_logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full object-contain" />
        <span className="hidden items-baseline gap-1.5 sm:flex">
          <b className="text-base tracking-tight">Lixrl</b>
          <small className="text-[0.72rem] text-[#5f6962]">Dashboard</small>
        </span>
      </Link>

      {/* Right: Nav + Account dropdown */}
      <nav aria-label="Dashboard" className="flex items-center gap-0.5 sm:gap-1">
        {/* App nav — icon+text on lg. Pricing intentionally omitted inside the
            dashboard; it's still reachable from the profile menu. */}
        {navItems.map((item) => (
          <NavPill key={item.href} {...item} />
        ))}

        <div className="w-px h-6 bg-border-light mx-1" />
        <NavPill href="/docs" label="Docs" icon={Icons.docs} />

        {/* Divider before account */}
        <div className="w-px h-6 bg-border-light ml-1 sm:ml-2" />

        {/* Account dropdown */}
        <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          aria-label={`Account menu for ${user.display_name}`}
          aria-haspopup="menu"
          aria-expanded={accountOpen}
          onClick={() => setAccountOpen(!accountOpen)}
          className="flex items-center gap-2.5 p-1 lg:pl-1.5 lg:pr-2.5 rounded-full hover:bg-bg-glass transition-all duration-200 bg-transparent border-none cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border-medium group-hover:border-accent-main/40 transition-colors">
            <img
              src={avatarUrl}
              alt={user.display_name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Name + email on lg; avatar-only below lg. */}
          <div className="hidden lg:flex flex-col items-start leading-tight min-w-0 max-w-[160px]">
            <span className="text-sm text-text-primary truncate w-full">{user.display_name}</span>
            <span className="text-[0.65rem] text-text-secondary truncate w-full">{user.email}</span>
          </div>
          <span className={`hidden lg:block text-text-secondary transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}>
            {Icons.chevron}
          </span>
        </button>

        {/* Dropdown */}
        {accountOpen && (
          <div
            className="absolute right-0 top-full mt-3 w-[min(16rem,calc(100vw-2rem))] rounded-[1.2rem] border border-line overflow-hidden shadow-header z-50"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}
          >
            {/* Profile card — avatar, identity, current plan */}
            <div
              className="px-4 py-3.5 border-b border-border-light"
              style={{ background: '#eef2ff' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-accent-main/30">
                  <img
                    src={avatarUrl}
                    alt={user.display_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-text-primary truncate">{user.display_name}</div>
                  <div className="text-[0.68rem] text-text-secondary truncate">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[0.6rem] uppercase tracking-wider text-text-secondary font-semibold">Current plan</span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.62rem] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(58,101,199,0.1)',
                    color: '#2f56b0',
                    border: '1px solid rgba(58,101,199,0.25)',
                  }}
                >
                  {user.tier}
                </span>
              </div>
            </div>

            {/* Upgrade CTA — only when there's headroom to sell into. */}
            {user.tier === 'free' && (
              <Link
                href="/pricing"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 mx-2 my-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white no-underline"
                style={{
                  background: '#142018',
                  boxShadow: 'none',
                }}
              >
                <span className="opacity-90">{Icons.sparkle}</span>
                Upgrade to Pro
              </Link>
            )}

            {/* Account links */}
            <div className="py-1.5">
              {accountItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAccountOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 no-underline ${
                    isActive(item.href)
                      ? 'text-accent-main bg-[rgba(58,101,199,0.06)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass'
                  }`}
                >
                  <span className={isActive(item.href) ? 'opacity-100' : 'opacity-50'}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Resources */}
            <div className="border-t border-border-light py-1.5">
              {resourceItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-glass transition-all duration-150 no-underline"
                >
                  <span className="opacity-50">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <div className="border-t border-border-light py-1.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-[#b42318] hover:bg-bg-glass transition-all duration-150 cursor-pointer bg-transparent border-none text-left"
              >
                <span className="opacity-50">{Icons.logout}</span>
                Sign Out
              </button>
            </div>
          </div>
        )}
        </div>
      </nav>
    </header>
  );
}
