import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  onClick: () => void;
  label?: string;
}

export function WhatsAppButton({ onClick, label = 'Solicitar disponibilidad por WhatsApp' }: WhatsAppButtonProps) {
  return (
    <button onClick={onClick} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:brightness-95 sm:w-auto">
      <MessageCircle size={18} /> {label}
    </button>
  );
}
