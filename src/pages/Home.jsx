import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Calendar, Clock, MapPin, Phone, Mail, Copy, Check, ChevronDown, Users, UtensilsCrossed, MessageCircle, Car, Bus, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import useRsvpStore from '@/stores/useRsvpStore';
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
const WEDDING_DATE = new Date('2026-10-18T16:00:00-03:00');
const VENUE_COORDS = [-23.5613, -46.6553];
const IMAGES = {
  hero: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/hero-1-184dba6a-eea0-4561-897e-c4ecb31d8351.png',
  bride: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/people-1-5ec3a717-c15a-4d06-81fa-32d41a1daffa.png',
  groom: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/people-2-7eb883ff-0f45-4090-ad0a-c8aa4c455627.png',
  gallery1: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/gallery-1-d5d80e78-c78c-4597-b8af-52cbead88e96.png',
  gallery2: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/gallery-2-cd1ec1f0-7dde-4835-b5cd-834884899735.png',
  gallery3: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/gallery-3-114c3a2a-a2ba-4ae4-a6cb-757976943bd0.png',
  gallery4: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/gallery-4-232b6a6d-f2da-4edf-ad02-5c24415a91f2.png',
  background: 'https://cdn.vibe-x.app/apps/affc03e86d5c9a05c8aad7dc/assets/original/background-1-10e72ba9-cbd4-4030-9a98-699f3c0bcc24.png',
};
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function CherryPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 10,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.4,
      color: i % 3 === 0 ? '#f9a8c9' : i % 3 === 1 ? '#f472b6' : '#fbb6ce',
    }));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(ellipse at 30% 30%, ${p.color}, transparent)`,
            borderRadius: '50% 0 50% 0',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
function FlowerDivider() {
  return (
    <div className="flex items-center justify-center py-6">
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" className="text-[#B5496B]/30">
        <path d="M0 12 Q30 0, 60 12 Q90 24, 120 12" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="60" cy="12" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="45" cy="9" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="75" cy="15" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
}
function HeroSection() {
  const countdown = useCountdown(WEDDING_DATE);
  const countdownItems = [
    { value: countdown.days, label: 'Dias' },
    { value: countdown.hours, label: 'Horas' },
    { value: countdown.minutes, label: 'Min' },
    { value: countdown.seconds, label: 'Seg' },
  ];
  return (
    <section id="inicio" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Cherry blossoms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#B5496B]/40 via-[#6B4F7D]/30 to-[#2D1F2B]/60" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-12 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <p className="text-white/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Convite de Casamento
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <span className="italic">Amanda</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-16 md:w-24 bg-white/40" />
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-300 fill-pink-300 float-animation drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            <div className="h-px w-16 md:w-24 bg-white/40" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <span className="italic">Rafael</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-light mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            18 de Outubro de 2026
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 md:gap-6"
        >
          {countdownItems.map((item, i) => (
            <div
              key={item.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]"
            >
              <span className="font-display text-2xl md:text-4xl text-white font-bold block">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-white/60 text-xs md:text-sm mt-1 block">{item.label}</span>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 hidden md:block"
        >
          <button
            onClick={() => document.querySelector('#casal')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
function CoupleSection() {
  return (
    <section id="casal" className="relative py-20 md:py-28 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/30 overflow-hidden">
      <div className="absolute top-10 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-purple-200/15 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Sobre Nós</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              O Casal
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto items-start">
          <AnimatedSection delay={0.15}>
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B5496B]/20 to-[#6B4F7D]/20 rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl shadow-pink-200/40">
                  <img
                    src={IMAGES.bride}
                    alt="Amanda"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <h3 className="font-display text-3xl text-[#B5496B] font-semibold mb-2 italic">Amanda Santos</h3>
              <p className="text-[#6B4F7D]/70 text-sm uppercase tracking-wider mb-3">A Noiva</p>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Arquiteta apaixonada por design e detalhes. Sonhadora, romantica e sempre com um sorriso no rosto. Acredita que o amor transforma tudo.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B4F7D]/20 to-[#B5496B]/20 rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl shadow-purple-200/40">
                  <img
                    src={IMAGES.groom}
                    alt="Rafael"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <h3 className="font-display text-3xl text-[#6B4F7D] font-semibold mb-2 italic">Rafael Oliveira</h3>
              <p className="text-[#6B4F7D]/70 text-sm uppercase tracking-wider mb-3">O Noivo</p>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Engenheiro de coracao aventureiro. Ama viajar, cozinhar e fazer as pessoas rirem. Encontrou em Amanda o seu porto seguro.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
function TimelineSection() {
  const events = [
    {
      year: '2020',
      title: 'Primeiro Encontro',
      desc: 'Nos conhecemos em uma festa de amigos em comum. Foi amor a primeira vista entre sorrisos e olhares.',
      icon: Heart,
    },
    {
      year: '2021',
      title: 'Primeiro Beijo',
      desc: 'Depois de meses de amizade, o primeiro beijo aconteceu em uma noite estrelada na praia.',
      icon: Star,
    },
    {
      year: '2023',
      title: 'Viagem Inesquecivel',
      desc: 'Nossa primeira grande viagem juntos pela Europa selou nosso amor para sempre.',
      icon: MapPin,
    },
    {
      year: '2025',
      title: 'O Pedido',
      desc: 'Rafael pediu Amanda em casamento em um jardim repleto de cerejeiras em flor. Ela disse sim!',
      icon: Heart,
    },
    {
      year: '2026',
      title: 'O Grande Dia',
      desc: 'Finalmente vamos celebrar nossa uniao com todos que amamos. O melhor capitulo comeca aqui.',
      icon: Calendar,
    },
  ];
  return (
    <section id="historia" className="relative py-20 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-20 left-10 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-purple-100/20 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Linha do Tempo</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Nossa História
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#B5496B]/20 to-transparent hidden md:block" />
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#B5496B]/20 to-transparent md:hidden" />
          <div className="space-y-12 md:space-y-16">
            {events.map((event, index) => {
              const IconComp = event.icon;
              const isEven = index % 2 === 0;
              return (
                <AnimatedSection key={event.year} delay={index * 0.1}>
                  <div className={`relative flex items-start gap-6 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-[#B5496B] rounded-full -translate-x-1/2 mt-2 z-10 shadow-lg shadow-pink-300/30" />
                    <div className={`ml-14 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-200/40 shadow-lg shadow-pink-100/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-500`}>
                        <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <div className="w-10 h-10 bg-gradient-to-br from-[#B5496B]/10 to-[#6B4F7D]/10 rounded-full flex items-center justify-center">
                            <IconComp className="w-5 h-5 text-[#B5496B]" />
                          </div>
                          <span className="font-display text-2xl text-[#B5496B] font-bold">{event.year}</span>
                        </div>
                        <h3 className="font-display text-xl text-[#2D1F2B] font-semibold mb-2 italic">{event.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">{event.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
function DateVenueSection() {
  return (
    <section id="cerimonia" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMAGES.background} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/92 via-pink-50/90 to-purple-50/92" />
      </div>
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Quando e Onde</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Cerimônia e Recepção
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <AnimatedSection delay={0.15}>
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-pink-200/40 shadow-xl shadow-pink-100/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 text-center h-full">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#B5496B] to-[#6B4F7D] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300/30" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="font-display text-2xl text-[#2D1F2B] font-bold mb-6 italic">Cerimônia</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Calendar className="w-5 h-5 text-[#B5496B]" />
                  <span className="font-medium">18 de Outubro de 2026</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Clock className="w-5 h-5 text-[#B5496B]" />
                  <span className="font-medium">16:00</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <MapPin className="w-5 h-5 text-[#B5496B]" />
                  <span className="font-medium">Capela Villa Jardim</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-pink-100">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Rua das Cerejeiras, 456, Jardins, São Paulo, SP
                </p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-purple-200/40 shadow-xl shadow-purple-100/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 text-center h-full">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#6B4F7D] to-[#B5496B] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/30" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl text-[#2D1F2B] font-bold mb-6 italic">Recepção</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Calendar className="w-5 h-5 text-[#6B4F7D]" />
                  <span className="font-medium">18 de Outubro de 2026</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Clock className="w-5 h-5 text-[#6B4F7D]" />
                  <span className="font-medium">18:00</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <MapPin className="w-5 h-5 text-[#6B4F7D]" />
                  <span className="font-medium">Salão Espaço Villa Jardim</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-purple-100">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Mesmo local da cerimônia. Traje: Passeio Completo.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const photos = [
    { src: IMAGES.gallery1, caption: 'Nosso primeiro encontro' },
    { src: IMAGES.gallery2, caption: 'O pedido de casamento' },
    { src: IMAGES.gallery3, caption: 'Juntos na primavera' },
    { src: IMAGES.gallery4, caption: 'Nosso pré-wedding' },
  ];
  return (
    <section id="galeria" className="relative py-20 md:py-28 bg-gradient-to-br from-pink-50/60 via-white to-purple-50/40 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Momentos Especiais</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Galeria
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {photos.map((photo, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <button
                onClick={() => setSelectedImage(photo)}
                className="group relative rounded-3xl overflow-hidden shadow-lg shadow-pink-100/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 w-full aspect-square"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1F2B]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white font-display text-lg italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{photo.caption}</p>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white font-display text-xl italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
function DirectionsSection() {
  return (
    <section id="como-chegar" className="relative py-20 md:py-28 bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Localização</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Como Chegar
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <AnimatedSection delay={0.1}>
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-pink-100/20 border border-pink-200/30 h-[350px] md:h-[420px]">
              <MapContainer
                center={VENUE_COORDS}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={VENUE_COORDS}>
                  <Popup>
                    <strong>Espaço Villa Jardim</strong><br />
                    Rua das Cerejeiras, 456<br />
                    Jardins, São Paulo, SP
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <div className="space-y-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-200/40 shadow-lg shadow-pink-100/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B5496B]/10 to-[#6B4F7D]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#B5496B]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2D1F2B] mb-1">Endereço</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Rua das Cerejeiras, 456, Jardins, São Paulo, SP, CEP 01234-567
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-200/40 shadow-lg shadow-pink-100/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B5496B]/10 to-[#6B4F7D]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-[#B5496B]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2D1F2B] mb-1">De Carro</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Estacionamento com manobrista no local. Acesso pela Av. Paulista, seguindo pela Rua Augusta.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-200/40 shadow-lg shadow-pink-100/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#B5496B]/10 to-[#6B4F7D]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bus className="w-6 h-6 text-[#B5496B]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2D1F2B] mb-1">Transporte Público</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Metrô: Estação Consolação (Linha Verde), 10 min a pé. Ônibus: Linhas 908T e 875A param em frente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
function RsvpSection() {
  const addGuest = useRsvpStore((s) => s.addGuest);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companions: '0',
    dietary: 'Sem restrições',
    message: '',
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    addGuest(formData);
    setSubmitted(true);
  };
  if (submitted) {
    return (
      <section id="confirmar" className="relative py-20 md:py-28 bg-gradient-to-br from-[#B5496B]/5 via-pink-50 to-[#6B4F7D]/5 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 border border-pink-200/40 shadow-xl shadow-pink-100/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#B5496B] to-[#6B4F7D] rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h3 className="font-display text-3xl text-[#2D1F2B] font-bold mb-3 italic">
                Presença Confirmada!
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Obrigado, {formData.name}! Estamos muito felizes com a sua confirmação. Nos vemos no grande dia!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
  return (
    <section id="confirmar" className="relative py-20 md:py-28 bg-gradient-to-br from-[#B5496B]/5 via-pink-50 to-[#6B4F7D]/5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-72 h-72 bg-pink-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-56 h-56 bg-purple-200/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-14">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Queremos sua presença</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Confirmar Presença
            </h2>
            <FlowerDivider />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-pink-200/40 shadow-xl shadow-pink-100/20">
            <div
              role="form"
              aria-label="Formulário RSVP"
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Nome completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit();
                  }}
                  placeholder="Seu nome completo"
                  className="w-full px-5 py-3.5 rounded-2xl border border-pink-200/60 bg-white/80 focus:border-[#B5496B] focus:ring-2 focus:ring-[#B5496B]/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit();
                  }}
                  placeholder="(11) 99999-9999"
                  className="w-full px-5 py-3.5 rounded-2xl border border-pink-200/60 bg-white/80 focus:border-[#B5496B] focus:ring-2 focus:ring-[#B5496B]/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Acompanhantes</label>
                  <select
                    value={formData.companions}
                    onChange={(e) => handleChange('companions', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-pink-200/60 bg-white/80 focus:border-[#B5496B] focus:ring-2 focus:ring-[#B5496B]/20 outline-none transition-all text-slate-800 appearance-none"
                  >
                    <option value="0">Nenhum</option>
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                    <option value="3">3 pessoas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Restrição alimentar</label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => handleChange('dietary', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-pink-200/60 bg-white/80 focus:border-[#B5496B] focus:ring-2 focus:ring-[#B5496B]/20 outline-none transition-all text-slate-800 appearance-none"
                  >
                    <option>Sem restrições</option>
                    <option>Vegetariano</option>
                    <option>Vegano</option>
                    <option>Sem glúten</option>
                    <option>Sem lactose</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Mensagem para os noivos</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={3}
                  placeholder="Deixe uma mensagem carinhosa..."
                  className="w-full px-5 py-3.5 rounded-2xl border border-pink-200/60 bg-white/80 focus:border-[#B5496B] focus:ring-2 focus:ring-[#B5496B]/20 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#B5496B] to-[#6B4F7D] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-300/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Confirmar Presença
                </span>
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
function AccountsSection() {
  const [copied, setCopied] = useState(null);
  const accounts = [
    {
      name: 'Amanda Santos',
      role: 'Noiva',
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: 'CC 67890-1',
      pix: 'amanda.santos@email.com',
      gradient: 'from-[#B5496B] to-[#d06b8e]',
    },
    {
      name: 'Rafael Oliveira',
      role: 'Noivo',
      bank: 'Itaú Unibanco',
      agency: '5678-9',
      account: 'CC 12345-6',
      pix: 'rafael.oliveira@email.com',
      gradient: 'from-[#6B4F7D] to-[#9470ad]',
    },
  ];
  const handleCopy = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);
  return (
    <section id="presentes" className="relative py-20 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-10 left-0 w-56 h-56 bg-pink-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-48 h-48 bg-purple-100/15 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6">
            <p className="text-[#B5496B]/60 text-sm tracking-[0.3em] uppercase mb-3">Sua presença é o melhor presente</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D1F2B] font-bold mb-4">
              Presentes
            </h2>
            <FlowerDivider />
          </div>
          <p className="text-center text-slate-500 max-w-lg mx-auto mb-14 leading-relaxed">
            Se desejar nos presentear, ficaremos imensamente gratos. Abaixo estão as contas bancárias para contribuições.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {accounts.map((acc, index) => (
            <AnimatedSection key={acc.name} delay={index * 0.15}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-200/40 shadow-xl shadow-pink-100/20 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                <div className={`bg-gradient-to-r ${acc.gradient} px-6 py-5`}>
                  <p className="text-white/70 text-xs uppercase tracking-wider">{acc.role}</p>
                  <h3 className="font-display text-xl text-white font-semibold italic">{acc.name}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Banco</span>
                    <span className="text-[#2D1F2B] font-medium text-sm">{acc.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Agência</span>
                    <span className="text-[#2D1F2B] font-medium text-sm">{acc.agency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Conta</span>
                    <span className="text-[#2D1F2B] font-medium text-sm">{acc.account}</span>
                  </div>
                  <div className="pt-4 border-t border-pink-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-xs block mb-1">Chave PIX</span>
                        <span className="text-[#2D1F2B] font-medium text-sm">{acc.pix}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(acc.pix, acc.name)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          copied === acc.name
                            ? 'bg-green-100 text-green-700'
                            : 'bg-pink-50 text-[#B5496B] hover:bg-pink-100'
                        }`}
                      >
                        {copied === acc.name ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div>
      <CherryPetals />
      <HeroSection />
      <CoupleSection />
      <TimelineSection />
      <DateVenueSection />
      <GallerySection />
      <DirectionsSection />
      <RsvpSection />
      <AccountsSection />
    </div>
  );
}