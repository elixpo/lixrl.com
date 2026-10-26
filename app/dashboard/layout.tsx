export const runtime = 'edge';

import { redirect } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import { noIndexMetadata } from '@/lib/seo';

// Auth-gated, per-user surface: never index.
export const metadata = noIndexMetadata('Dashboard');

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="theme-light min-h-screen bg-paper">
      <div className="relative">
        <Sidebar user={user} />
        <main id="main-content" className="mx-auto w-full max-w-[1450px] px-4 sm:px-8 pb-10 sm:pb-12 pt-24 sm:pt-28">
          {children}
        </main>
      </div>
    </div>
  );
}
