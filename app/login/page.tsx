import Link from 'next/link';
import { redirect } from 'next/navigation';
import { noIndexMetadata } from '@/lib/seo';

export const runtime = 'edge';

export const metadata = noIndexMetadata('Sign in');

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Sign-in was cancelled or access was denied at Elixpo Accounts.',
  invalid_scope: 'Elixpo Accounts rejected the requested permissions for this app.',
  temporarily_unavailable: 'Elixpo Accounts is temporarily not accepting sign-ins for this app.',
  invalid_state: 'Your sign-in session expired or was already used. Please start again.',
  invalid_request: 'The sign-in response was missing required information.',
  server_error: 'We could not complete sign-in with Elixpo Accounts.',
};

type SearchParams = Promise<{ error?: string; error_description?: string; return_to?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error, error_description, return_to } = await searchParams;

  // No error: start the SSO flow. With an error we must NOT auto-redirect,
  // otherwise a provider-side rejection loops the user through OAuth forever.
  if (!error) {
    const safe = return_to && return_to.startsWith('/') && !return_to.startsWith('//') ? return_to : null;
    redirect(safe ? `/api/auth/login?return_to=${encodeURIComponent(safe)}` : '/api/auth/login');
  }

  const message = ERROR_MESSAGES[error] ?? 'Sign-in failed.';

  return (
    <main id="main-content" className="theme-light min-h-screen flex flex-col items-center justify-center px-6 bg-paper">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-sans font-bold text-text-primary mb-3">Sign-in failed</h1>
        <p className="text-text-secondary mb-2">{message}</p>
        {error_description && (
          <p className="text-text-secondary text-sm mb-2">{error_description}</p>
        )}
        <p className="text-text-secondary text-xs mb-8">
          Error code: <code>{error}</code>
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/api/auth/login" className="btn-accent no-underline px-6 py-2.5">
            Try again
          </a>
          <Link href="/" className="no-underline px-6 py-2.5 rounded-xl text-text-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
