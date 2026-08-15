import { useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { BrandExperienceSection } from './components/sections/BrandExperienceSection';
import { Hero } from './components/sections/Hero';
import { ServiceSelector } from './components/sections/ServiceSelector';
import { TestimonialsSection } from './components/sections/TestimonialsSection';

function App() {
  const [service, setService] = useState<'rental' | 'transfer' | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = (nextService: 'rental' | 'transfer') => {
    setService(nextService);
    setBookingOpen(true);
  };

  const goToServices = () => {
    const servicesSection = document.getElementById('servicios');

    if (!servicesSection) return;

    servicesSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (window.location.hash !== '#servicios') {
      window.history.replaceState(null, '', '#servicios');
    }
  };

  const closeBooking = () => {
    setBookingOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header onOpenBooking={goToServices} />

      <Hero />

      <ServiceSelector
        selected={service}
        onSelect={openBooking}
      />

      <BrandExperienceSection />
      <TestimonialsSection />
      <Footer />

      <BookingModal
        service={bookingOpen ? service : null}
        open={bookingOpen}
        onClose={closeBooking}
      />
    </div>
  );
}

export default App;