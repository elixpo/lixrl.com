'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  children: ReactNode;
  /** Hide the X close button (e.g. for force-action confirms) */
  hideClose?: boolean;
  /** Prevent backdrop click from closing (e.g. mid-action) */
  disableBackdropClose?: boolean;
}

const SIZE_MAX_WIDTH: Record<Size, string> = {
  sm: '420px',
  md: '560px',
  lg: '720px',
};

// Selector for focusable elements inside the modal — used by the focus trap
// to find what to cycle through on Tab.
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  hideClose = false,
  disableBackdropClose = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Keep the latest onClose in a ref so it doesn't drive the focus
  // effect's deps. Parents that re-render on every keystroke (e.g. the
  // shorten-URL form) pass a fresh onClose each render — if we depend
  // on it, the effect re-fires and re-focuses the first focusable
  // element, stealing focus from the input the user is typing in.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => setMounted(true), []);

  // Esc to dismiss + body scroll lock + focus management.
  // Only `open` is a real dep — when the dialog transitions open we set
  // up the focus + listener; on close we tear them down.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first focusable element inside the dialog (or the dialog
    // itself) once it mounts.
    requestAnimationFrame(() => {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables && focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        // Focus trap: cycle Tab inside the dialog
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    if (disableBackdropClose) return;
    onClose();
  }, [disableBackdropClose, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: 'modalBackdropIn 180ms ease-out' }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={handleBackdropClick}
        style={{
          background: 'rgba(20, 32, 24, 0.32)',
          backdropFilter: 'blur(8px)',
          border: 'none',
        }}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className="theme-light relative w-full rounded-[1.4rem] outline-none"
        style={{
          maxWidth: SIZE_MAX_WIDTH[size],
          background: '#fbfbf8',
          border: '1px solid #d7dbd6',
          boxShadow: '0 24px 80px rgba(20,32,24,0.18)',
          animation: 'modalDialogIn 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div
            className="flex items-start justify-between gap-4 px-6 py-5"
            style={{ borderBottom: '1px solid rgba(20,32,24,0.08)' }}
          >
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-[1.5rem] font-bold leading-[1.05] text-[#142018] tracking-[-0.045em]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm text-[#5f6962] mt-1 leading-relaxed"
                >
                  {description}
                </p>
              )}
            </div>
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex-shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-full text-[#5f6962] hover:text-[#142018] transition-colors"
                style={{ background: 'transparent', border: 'none' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    'rgba(20,32,24,0.05)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>

      <style jsx global>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalDialogIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────
// Thin wrapper for the common "are you sure" pattern. Built on Modal so it
// inherits the focus trap, Esc dismiss, and styling.
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" turns the confirm button red — use for destructive actions */
  variant?: 'default' | 'danger';
  loading?: boolean;
  error?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  error,
}: ConfirmDialogProps) {
  const danger = variant === 'danger';
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      disableBackdropClose={loading}
    >
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="min-h-[44px] px-5 rounded-full text-sm font-bold text-[#142018] transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid #142018',
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="min-h-[44px] px-5 rounded-full text-sm font-bold text-white transition-all"
          style={{
            background: danger
              ? '#b42318'
              : '#142018',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
