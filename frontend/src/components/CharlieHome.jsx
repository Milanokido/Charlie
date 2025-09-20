import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Phone, MapPin, Clock, Star } from 'lucide-react';
import { mockData } from '../data/mock';

const CharlieHome = () => {
  const [lightboxImage, setLightboxImage] = useState(null);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLightbox = (imageSrc) => {
    setLightboxImage(imageSrc);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="charlie-site">
      {/* Navbar */}
      <nav className="navbar sticky top-0 z-50 bg-[#5A2C2C] text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_5d643aa7-5a0c-4303-886e-62e413d13822/artifacts/z8hi3xjb_WhatsApp%20Image%202025-09-16%20at%2020.09.09.jpeg" 
              alt="Charlie Foods Logo" 
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold text-xl">Charlie Foods</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#E30613] transition-colors">Accueil</button>
            <button onClick={() => scrollToSection('menu')} className="hover:text-[#E30613] transition-colors">Menu</button>
            <button onClick={() => scrollToSection('infos')} className="hover:text-[#E30613] transition-colors">Infos</button>
            <button onClick={() => scrollToSection('galerie')} className="hover:text-[#E30613] transition-colors">Galerie</button>
            <button onClick={() => scrollToSection('apropos')} className="hover:text-[#E30613] transition-colors">À propos</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#E30613] transition-colors">Contact</button>
          </div>
          <Button 
            onClick={() => scrollToSection('contact')} 
            className="bg-[#E30613] hover:bg-[#B8050F] text-white border-[#E30613]"
          >
            Commander
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section min-h-screen flex items-center justify-center text-white relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_5d643aa7-5a0c-4303-886e-62e413d13822/artifacts/gyx28xwy_ChatGPT%20Image%2020%20sept.%202025%2C%2015_44_27.png')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Charlie Foods – Orsay</h1>
          <p className="text-xl md:text-2xl mb-6">Burgers, Tacos, Sandwichs, Tex-Mex</p>
          <Badge className="bg-[#E30613] text-white text-lg px-6 py-2 mb-8">Halal</Badge>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xl">
              <Phone className="h-6 w-6" />
              <span>Appeler maintenant • 09 86 15 17 24</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('menu')} 
                className="bg-[#E30613] hover:bg-[#B8050F] text-white px-8 py-3 text-lg"
              >
                Voir le menu
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')} 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
              >
                Commander
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Notre Menu</h2>
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
      <section id="infos" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Informations</h2>
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
                <div className="mt-4 space-y-2">
                  <Button 
                    className="w-full bg-[#E30613] hover:bg-[#B8050F]"
                    onClick={() => window.open(mockData.info.googleMapsLink, '_blank')}
                  >
                    Ouvrir dans Google Maps
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#E30613] text-[#E30613] hover:bg-[#E30613] hover:text-white"
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
                <div className="space-y-2">
                  <p><strong>Mardi → Dimanche:</strong> 11h–15h et 18h–23h</p>
                  <p><strong>Lundi:</strong> 18h–23h</p>
                </div>
                <div className="mt-4">
                  <Phone className="h-5 w-5 inline mr-2" />
                  <span>{mockData.info.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="main-section">
              <CardHeader>
                <CardTitle className="text-[#E30613]">Livraison</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-2">
                  <p>• Minimum de commande 15 €</p>
                  <p>• Frais de livraison +5,00 €</p>
                  <p>• À emporter disponible</p>
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
      <section id="galerie" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Galerie</h2>
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
      <section id="apropos" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">À propos</h2>
          <Card className="main-section max-w-4xl mx-auto">
            <CardContent className="text-white p-8">
              <p className="text-lg leading-relaxed text-center">
                {mockData.about}
              </p>
              <div className="flex items-center justify-center mt-6">
                <Star className="h-6 w-6 text-[#E30613] mr-2" />
                <span className="text-[#E30613] font-semibold">Qualité • Rapidité • Halal</span>
                <Star className="h-6 w-6 text-[#E30613] ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Contact</h2>
          <Card className="main-section max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-[#E30613] hover:bg-[#B8050F] text-white py-4 text-lg"
                    onClick={() => window.open('tel:0986151724')}
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
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-[#E30613] text-[#E30613] hover:bg-[#E30613] hover:text-white py-4 text-lg"
                    onClick={() => window.open(mockData.info.googleMapsLink, '_blank')}
                  >
                    <MapPin className="h-6 w-6 mr-2" />
                    Ouvrir dans Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5A2C2C] text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Charlie Foods</h3>
              <p>{mockData.info.address}</p>
              <p>{mockData.info.phone}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Horaires</h3>
              <p>Mardi → Dimanche: 11h–15h et 18h–23h</p>
              <p>Lundi: 18h–23h</p>
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