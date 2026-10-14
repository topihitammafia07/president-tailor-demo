import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton';

import { HeroSection } from '@/components/sections/01_HeroSection';
import { BrandTrustSection } from '@/components/sections/02_BrandTrustSection';
import { PainPointsSection } from '@/components/sections/03_PainPointsSection';
import { ServicesOverviewSection } from '@/components/sections/04_ServicesOverviewSection';
import { JasSpotlightSection } from '@/components/sections/05_JasSpotlightSection';
import { BatikSpotlightSection } from '@/components/sections/06_BatikSpotlightSection';
import { CelanaSpotlightSection } from '@/components/sections/07_CelanaSpotlightSection';
import { OccasionsSection } from '@/components/sections/08_OccasionsSection';
import { MeasurementSection } from '@/components/sections/09_MeasurementSection';
import { DetailsCraftSection } from '@/components/sections/10_DetailsCraftSection';
import { HowToOrderSection } from '@/components/sections/11_HowToOrderSection';
import { GallerySection } from '@/components/sections/12_GallerySection';
import { BeforeOrderSection } from '@/components/sections/13_BeforeOrderSection';
import { WhyConsultSection } from '@/components/sections/14_WhyConsultSection';
import { AboutSection } from '@/components/sections/15_AboutSection';
import { FaqSection } from '@/components/sections/16_FaqSection';
import { LocationContactSection } from '@/components/sections/17_LocationContactSection';
import { FinalCtaSection } from '@/components/sections/18_FinalCtaSection';

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'President Tailor',
    description:
      'Penjahit pakaian pria berkualitas di Sukoharjo, Jawa Tengah. Melayani pembuatan jas formal, hem batik berpola presisi, dan celana panjang berukuran personal.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sukoharjo',
      addressRegion: 'Jawa Tengah',
      addressCountry: 'ID',
    },
    areaServed: ['Sukoharjo', 'Solo', 'Surakarta', 'Karanganyar', 'Klaten'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Jahit Pria',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jahit Jas Formal',
            description: 'Pembuatan jas pria berstruktur presisi untuk acara formal dan pernikahan.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jahit Hem Batik',
            description: 'Pembuatan hem batik pria dengan penyambungan pola motif simetris dan furing katun adem.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jahit Celana Panjang',
            description: 'Pembuatan celana panjang formal dan santai dengan kenyamanan pesak dan jatuhnya pipa kain.',
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {/* 01. Hero - First Impression */}
          <HeroSection />

          {/* 02. Brand Introduction & Trust */}
          <BrandTrustSection />

          {/* 03. Customer Needs & Pain Points */}
          <PainPointsSection />

          {/* 04. Our Tailoring Services Overview */}
          <ServicesOverviewSection />

          {/* 05. Jas Collection Spotlight */}
          <JasSpotlightSection />

          {/* 06. Hem Batik Spotlight */}
          <BatikSpotlightSection />

          {/* 07. Celana Panjang Spotlight */}
          <CelanaSpotlightSection />

          {/* 08. Tailoring for Different Occasions */}
          <OccasionsSection />

          {/* 09. Personal Measurement Experience */}
          <MeasurementSection />

          {/* 10. Detail & Personalization */}
          <DetailsCraftSection />

          {/* 11. How to Order */}
          <HowToOrderSection />

          {/* 12. Tailoring Gallery */}
          <GallerySection />

          {/* 13. Before You Order */}
          <BeforeOrderSection />

          {/* 14. Why Consult President Tailor */}
          <WhyConsultSection />

          {/* 15. About President Tailor */}
          <AboutSection />

          {/* 16. Frequently Asked Questions */}
          <FaqSection />

          {/* 17. Location & Contact */}
          <LocationContactSection />

          {/* 18. Final Conversion CTA */}
          <FinalCtaSection />
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </>
  );
}
