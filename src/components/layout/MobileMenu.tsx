interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Rentar un auto' },
  { href: '#servicios', label: 'Traslado privado' },
  { href: '#experiencia', label: 'Nuestra experiencia' },
  { href: '#contacto', label: 'Contacto' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm md:hidden" onClick={onClose}>
      <div className="absolute right-3 top-16 w-[88%] rounded-2xl bg-warm p-5 shadow-card" onClick={(e) => e.stopPropagation()}>
        <nav className="space-y-2">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={onClose} className="block rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-cream">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#booking" onClick={onClose} className="mt-4 block rounded-xl bg-forest px-4 py-3 text-center text-sm font-semibold text-white">
          Reserva tu experiencia
        </a>
      </div>
    </div>
  );
}
