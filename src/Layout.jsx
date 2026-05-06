import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Heart, ChevronUp } from 'lucide-react';
const NAV_ITEMS = [
  { label: 'O Casal', href: '#casal' },
  { label: 'Nossa História', href: '#historia' },
  { label: 'Cerimônia', href: '#cerimonia' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Como Chegar', href: '#como-chegar' },
  { label: 'RSVP', href: '#confirmar' },
  { label: 'Presentes', href: '#presentes' },
];
export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <img
                src="https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/logo-0-7d68e27e-1cb8-4ac2-91d2-9edf05742f2c.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </button>
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    scrolled
                      ? 'text-[#B5496B] hover:bg-pink-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                scrolled ? 'text-[#B5496B] hover:bg-pink-50' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-pink-100/50 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-3 text-[#B5496B] hover:bg-pink-50 rounded-xl transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-[#2D1F2B] text-white/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-display text-2xl text-white/90 italic">A</span>
            <Heart className="w-5 h-5 text-[#B5496B] fill-[#B5496B]" />
            <span className="font-display text-2xl text-white/90 italic">R</span>
          </div>
          <p className="text-sm text-white/40 mb-2">18 de Outubro de 2026</p>
          <p className="text-xs text-white/30">&copy; 2026 Amanda & Rafael. Feito com amor.</p>
        </div>
      </footer>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#B5496B] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#9d3d5b] transition-all duration-300 flex items-center justify-center"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}