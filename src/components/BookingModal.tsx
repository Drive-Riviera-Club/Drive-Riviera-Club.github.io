import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { RentalBookingWizard } from './wizards/RentalBookingWizard';
import { TransferBookingWizard } from './wizards/TransferBookingWizard';

export type BookingService = 'rental' | 'transfer';

interface BookingModalProps {
  service: BookingService | null;
  open: boolean;
  onClose: () => void;
}

const modalTitles: Record<BookingService, string> = {
  rental: 'Renta tu auto',
  transfer: 'Traslado privado',
};

export function BookingModal({ service, open, onClose }: BookingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [];
    const firstFocusable = focusableElements[0];
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [open, onClose]);

  if (!service) return null;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] bg-navy/60 p-3 backdrop-blur-sm transition-opacity duration-200 sm:p-6 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        aria-label={modalTitles[service]}
        className={`relative mx-auto flex h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-sand bg-warm shadow-2xl transition-transform duration-200 ${open ? 'translate-y-0' : 'translate-y-4'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-sand bg-warm/95 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Reserva</p>
            <h2 id="booking-modal-title" className="font-heading text-2xl text-navy sm:text-3xl">{modalTitles[service]}</h2>
          </div>

          <button
            type="button"
            aria-label="Cerrar reserva"
            onClick={onClose}
            className="rounded-full border border-sand bg-white p-2 text-slate-600 transition hover:bg-cream hover:text-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {service === 'rental' ? <RentalBookingWizard /> : <TransferBookingWizard />}
        </div>
      </div>
    </div>
  );
}
