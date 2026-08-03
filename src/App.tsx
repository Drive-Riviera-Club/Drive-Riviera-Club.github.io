import { useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { BrandExperienceSection } from './components/sections/BrandExperienceSection';
import { Hero } from './components/sections/Hero';
import { ServiceSelector } from './components/sections/ServiceSelector';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { RentalBookingWizard } from './components/wizards/RentalBookingWizard';
import { TransferBookingWizard } from './components/wizards/TransferBookingWizard';

function App() {
  const [service, setService] = useState<'rental' | 'transfer' | null>('rental');

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <Hero onSelectRental={() => setService('rental')} onSelectTransfer={() => setService('transfer')} />
      <ServiceSelector selected={service} onSelect={setService} />

      <section id="booking" className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        {service === 'rental' ? <RentalBookingWizard /> : <TransferBookingWizard />}
      </section>

      <BrandExperienceSection />
      <TestimonialsSection />
      <Footer />

      <div className="fixed bottom-0 left-0 right-0 border-t border-sand bg-warm/95 p-3 backdrop-blur md:hidden">
        <a href="#booking" className="block rounded-xl bg-forest px-4 py-3 text-center text-sm font-semibold text-white">
          Reserva tu experiencia
        </a>
      </div>
    </div>
  );
}

export default App;
