import { AtSign, Mail, MessageCircle } from 'lucide-react';
import { businessConfig } from '../../config/business';

export function Footer() {
  return (
    <footer id="contacto" className="mt-20 border-t border-sand bg-navy text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-3xl text-white">Drive Riviera Club</h3>
          <p className="mt-2 text-sm text-slate-300">No rentamos autos. Creamos libertad.</p>
        </div>
        <div className="space-y-3 text-sm">
          <a href={`https://wa.me/${businessConfig.whatsappNumber}`} className="flex items-center gap-2 hover:text-sunset">
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a href={`mailto:${businessConfig.email}`} className="flex items-center gap-2 hover:text-sunset">
            <Mail size={16} /> {businessConfig.email}
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-sunset">
            <AtSign size={16} /> {businessConfig.instagram}
          </a>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p className="text-xs text-slate-400">{businessConfig.geoapifyAttribution}</p>
          <a href="#" className="block hover:text-sunset">
            Aviso de privacidad
          </a>
          <a href="#" className="block hover:text-sunset">
            Terminos y condiciones
          </a>
          <p className="pt-4 text-xs">© {new Date().getFullYear()} Drive Riviera Club. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
