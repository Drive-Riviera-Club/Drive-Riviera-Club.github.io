import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MobileMenu } from './MobileMenu';

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#experiencia', label: 'Nuestra experiencia' },
  { href: '#contacto', label: 'Contacto' },
];

interface HeaderProps {
  onOpenBooking: () => void;
}

export function Header({ onOpenBooking }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition ${
        scrolled
          ? 'bg-warm/95 shadow-md backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#inicio"
          className="font-heading text-3xl leading-none text-navy"
        >
          Drive Riviera Club
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-700 transition hover:text-forest"
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenBooking}
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-turquoise"
          >
            Reserva tu experiencia
          </button>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Cerrar menu' : 'Abrir menu'}
          className="rounded-xl border border-sand bg-white p-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        onOpenBooking={onOpenBooking}
      />
    </header>
  );
}