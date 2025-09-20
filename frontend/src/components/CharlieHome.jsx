import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Phone, MapPin, Clock, Star, Menu as MenuIcon, X } from 'lucide-react';
import { mockData } from '../data/mock';

const CharlieHome = () => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update time every 30 seconds for real-time status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const openLightbox = (imageSrc) => {
    setLightboxImage(imageSrc);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const handlePhoneCall = () => {
    window.open('tel:0986151724');
  };

  const getTodayStatus = () => {
    // Get current time and convert to UTC+2 (Paris timezone)
    const now = new Date();
    const parisTime = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    const currentDay = parisTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = parisTime.getHours();
    const currentMinute = parisTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Map day numbers to our schedule (UTC+2)
    const daySchedule = {
      1: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Monday: 11:00–15:00, 18:00–23:00
      2: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Tuesday: 11:00–15:00, 18:00–23:00
      3: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Wednesday: 11:00–15:00, 18:00–23:00
      4: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Thursday: 11:00–15:00, 18:00–23:00
      5: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Friday: 11:00–15:00, 18:00–23:00
      6: { open: [[11*60, 15*60], [18*60, 23*60]] }, // Saturday: 11:00–15:00, 18:00–23:00
      0: { open: [[18*60, 23*60]] }, // Sunday: 18:00–23:00
    };

    const todaySchedule = daySchedule[currentDay];
    const isOpen = todaySchedule.open.some(([start, end]) => 
      currentTimeInMinutes >= start && currentTimeInMinutes < end
    );
    
    return { currentDay, isOpen, currentTimeInMinutes, parisTime };
  };

  const getSchedule = () => {
    return [
      { day: 1, name: 'Lundi', hours: '11h–15h, 18h–23h' },
      { day: 2, name: 'Mardi', hours: '11h–15h, 18h–23h' },
      { day: 3, name: 'Mercredi', hours: '11h–15h, 18h–23h' },
      { day: 4, name: 'Jeudi', hours: '11h–15h, 18h–23h' },
      { day: 5, name: 'Vendredi', hours: '11h–15h, 18h–23h' },
      { day: 6, name: 'Samedi', hours: '11h–15h, 18h–23h' },
      { day: 0, name: 'Dimanche', hours: '18h–23h' },
    ];
  };

  return (
    <div className="charlie-site overflow-x-hidden">
      {/* Navbar */}
      <nav className="navbar sticky top-0 z-50 bg-[#5A2C2C] text-white px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_5d643aa7-5a0c-4303-886e-62e413d13822/artifacts/z8hi3xjb_WhatsApp%20Image%202025-09-16%20at%2020.09.09.jpeg" 
              alt="Charlie Foods Logo" 
              className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover flex-shrink-0"
              style={{ background: 'transparent' }}
            />
            <span className="font-bold text-lg md:text-xl truncate">Charlie Foods</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#E30613] transition-colors">Accueil</button>
            <button onClick={() => scrollToSection('menu')} className="hover:text-[#E30613] transition-colors">Menu</button>
            <button onClick={() => scrollToSection('infos')} className="hover:text-[#E30613] transition-colors">Infos</button>
            <button onClick={() => scrollToSection('galerie')} className="hover:text-[#E30613] transition-colors">Galerie</button>
            <button onClick={() => scrollToSection('apropos')} className="hover:text-[#E30613] transition-colors">À propos</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#E30613] transition-colors">Contact</button>
          </div>
          
          {/* Desktop Commander Button */}
          <Button 
            onClick={handlePhoneCall} 
            className="hidden md:flex bg-[#E30613] hover:bg-[#B8050F] text-white border-[#E30613] font-semibold"
          >
            Commander
          </Button>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#B8050F] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#5A2C2C] border-t border-[#B8050F] shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => scrollToSection('menu')} 
                className="block w-full text-left px-4 py-3 hover:bg-[#B8050F] hover:text-white transition-colors rounded-lg"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('infos')} 
                className="block w-full text-left px-4 py-3 hover:bg-[#B8050F] hover:text-white transition-colors rounded-lg"
              >
                Infos
              </button>
              <button 
                onClick={() => scrollToSection('galerie')} 
                className="block w-full text-left px-4 py-3 hover:bg-[#B8050F] hover:text-white transition-colors rounded-lg"
              >
                Galerie
              </button>
              <button 
                onClick={() => scrollToSection('apropos')} 
                className="block w-full text-left px-4 py-3 hover:bg-[#B8050F] hover:text-white transition-colors rounded-lg"
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block w-full text-left px-4 py-3 hover:bg-[#B8050F] hover:text-white transition-colors rounded-lg"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section min-h-screen flex items-center justify-center text-white relative">
        <div 
          className="absolute inset-0 hero-bg-mobile"
          style={{
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_cuisine-contact-fix/artifacts/43xnu606_ChatGPT%20Image%2020%20sept.%202025%2C%2019_39_51.png')`,
            filter: 'brightness(1.1) contrast(0.5)'
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight">Charlie Foods – Orsay</h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6">Burgers, Tacos, Sandwichs Baguette, Tex-Mex</p>
          <div className="bg-[#E30613] text-white text-base sm:text-lg px-4 sm:px-6 py-2 mb-8 rounded-full mx-auto max-w-fit">
            {mockData.heroSlogan}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-lg sm:text-xl">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-center">Appeler maintenant • 09 86 15 17 24</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                onClick={() => scrollToSection('menu')} 
                className="bg-[#E30613] hover:bg-[#B8050F] text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Voir le menu
              </Button>
              <Button 
                onClick={handlePhoneCall} 
                className="bg-[#E30613] hover:bg-[#B8050F] text-white border-[#E30613] px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                Commander
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">Notre Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.menuCategories.map((category, index) => (
              <Card key={index} className="main-section">
                <CardHeader>
                  <CardTitle className="text-[#E30613] text-xl border-b border-[#E30613] pb-2">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                          )}
                        </div>
                        <span className="text-[#E30613] font-bold ml-4">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infos Section */}
      <section id="infos" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">Informations</h2>
          
          {/* Google Maps */}
          <Card className="main-section mb-8">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2627.3!2d2.1896881!3d48.7016253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e679003f5d146f%3A0x2debb7669a89d1a!2sCHARLIE%20FOODS!5e0!3m2!1sfr!2sfr!4v1695220000000!5m2!1sfr!2sfr"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="main-section">
              <CardHeader>
                <CardTitle className="text-[#E30613] flex items-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p>{mockData.info.address}</p>
                <div className="mt-4">
                  <Button 
                    className="w-full bg-[#E30613] hover:bg-[#B8050F]"
                    onClick={() => window.open(mockData.info.directionsLink, '_blank')}
                  >
                    Itinéraire
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="main-section">
              <CardHeader>
                <CardTitle className="text-[#E30613] flex items-center">
                  <Clock className="h-6 w-6 mr-2" />
                  Horaires
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-3">
                  {getSchedule().map((dayInfo) => {
                    const { currentDay, isOpen } = getTodayStatus();
                    const isToday = currentDay === dayInfo.day;
                    
                    return (
                      <div key={dayInfo.day} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isToday ? 'text-[#E30613]' : ''}`}>
                            {dayInfo.name}
                          </span>
                          {isToday && (
                            <Badge 
                              className={`text-white text-xs ml-2 ${
                                isOpen 
                                  ? 'bg-green-600' 
                                  : 'bg-red-600'
                              }`}
                            >
                              {isOpen ? 'Ouvert' : 'Fermé'}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-300 sm:text-white">{dayInfo.hours}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="main-section">
              <CardHeader>
                <CardTitle className="text-[#E30613]">Services</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-2">
                  {mockData.paymentInfo.map((info, index) => (
                    <p key={index}>{info}</p>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Partenaires:</p>
                  <p>Deliveroo, Uber Eats</p>
                </div>
                <Badge className="bg-[#E30613] text-white mt-4">Halal</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Galerie Section */}
      <section id="galerie" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {mockData.gallery.map((image, index) => (
              <div 
                key={index} 
                className="cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => openLightbox(image.src)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="apropos" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">À propos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.about.map((item, index) => (
              <Card key={index} className="main-section">
                <CardContent className="text-white p-8 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-[#E30613] mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 mb-32 md:mb-0">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">Contact</h2>
          <Card className="main-section max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-[#E30613] hover:bg-[#B8050F] text-white py-4 text-lg"
                    onClick={handlePhoneCall}
                  >
                    <Phone className="h-6 w-6 mr-2" />
                    Appeler maintenant
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-[#E30613] text-[#E30613] hover:bg-[#E30613] hover:text-white py-4 text-lg"
                    onClick={() => window.open(mockData.info.directionsLink, '_blank')}
                  >
                    <MapPin className="h-6 w-6 mr-2" />
                    Itinéraire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5A2C2C] text-white py-8 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_5d643aa7-5a0c-4303-886e-62e413d13822/artifacts/z8hi3xjb_WhatsApp%20Image%202025-09-16%20at%2020.09.09.jpeg" 
                  alt="Charlie Foods Logo" 
                  className="h-12 w-16 object-cover rounded-lg"
                  style={{ background: 'transparent' }}
                />
                <h3 className="font-bold text-lg">Charlie Foods</h3>
              </div>
              <p>{mockData.info.address}</p>
              <p>{mockData.info.phone}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Horaires</h3>
              <p>Lundi → Samedi: 11h–15h et 18h–23h</p>
              <p>Dimanche: 18h–23h</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Partenaires</h3>
              <p>Deliveroo • Uber Eats</p>
              <Badge className="bg-[#E30613] text-white mt-2">Halal</Badge>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-600">
            <p>&copy; 2025 Charlie Foods. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Fixed Mobile Commander Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#5A2C2C] border-t border-[#E30613] p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-white text-sm">
            <Phone className="h-4 w-4" />
            <span>09 86 15 17 24</span>
          </div>
          <div className="flex items-center space-x-2">
            {(() => {
              const { isOpen } = getTodayStatus();
              return (
                <Badge 
                  className={`text-white text-xs ${
                    isOpen 
                      ? 'bg-green-600' 
                      : 'bg-red-600'
                  }`}
                >
                  {isOpen ? 'Ouvert' : 'Fermé'}
                </Badge>
              );
            })()}
          </div>
        </div>
        <Button 
          onClick={handlePhoneCall} 
          className="w-full bg-[#E30613] hover:bg-[#B8050F] text-white py-3 text-lg font-semibold"
        >
          <Phone className="h-5 w-5 mr-2" />
          Commander maintenant
        </Button>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={lightboxImage} 
              alt="Gallery" 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-4xl hover:text-[#E30613]"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharlieHome;