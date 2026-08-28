"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import EventHighlightsSection from "@/components/EventHighlightsSection";
import MobileEventHighlightsSection from "@/components/mobile/MobileEventHighlightsSection";
import LocationTimelineSection from "@/components/LocationTimelineSection";
import MobileLocationTimelineSection from "@/components/mobile/MobileLocationTimelineSection";

// Desktop Components
import IntroLoader from "@/components/IntroLoader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventDetailsBar from "@/components/EventDetailsBar";
import AboutSection from "@/components/AboutSection";
import TracksSection from "@/components/TracksSection";
import ScheduleSection from "@/components/ScheduleSection";
import RewardsSection from "@/components/RewardsSection";
import SponsorsMarquee from "@/components/SponsorsMarquee";
import JuriesSection from "@/components/JuriesSection";
import TeamSection from "@/components/TeamSection";
import FAQSection from "@/components/FAQSection";
import RegisterCTASection from "@/components/RegisterCTASection";
import Footer from "@/components/Footer";
import QRModal from "@/components/QRModal";

// Mobile Components (SEPARATE MOBILE VIEW)
import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileHeroSection from "@/components/mobile/MobileHeroSection";
import MobileEventDetailsBar from "@/components/mobile/MobileEventDetailsBar";
import MobileAboutSection from "@/components/mobile/MobileAboutSection";
import MobileTracksSection from "@/components/mobile/MobileTracksSection";
import MobileScheduleSection from "@/components/mobile/MobileScheduleSection";
import MobileRewardsSection from "@/components/mobile/MobileRewardsSection";
import MobileSponsorsMarquee from "@/components/mobile/MobileSponsorsMarquee";
import MobileJuriesSection from "@/components/mobile/MobileJuriesSection";
import MobileTeamSection from "@/components/mobile/MobileTeamSection";
import MobileFAQSection from "@/components/mobile/MobileFAQSection";
import MobileRegisterCTASection from "@/components/mobile/MobileRegisterCTASection";
import MobileFooter from "@/components/mobile/MobileFooter";

export default function Home() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleOpenQRModal = () => {
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-ink text-white selection:bg-crimson selection:text-white">
      {/* Pre-loader video overlay */}
      {!loaderComplete && (
        <IntroLoader onComplete={() => setLoaderComplete(true)} />
      )}

      {/* Main Website Flow */}
      <div className={!loaderComplete ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>

        {/* ========================================== */}
        {/* DESKTOP VIEW (100% ORIGINAL & UNTOUCHED)   */}
        {/* ========================================== */}
        <div className="hidden md:block">
          {/* Fixed Navbar */}
          <Navbar onRegisterClick={handleOpenQRModal} />

          {/* Hero Section */}
          <HeroSection onRegisterClick={handleOpenQRModal} />

          {/* Sticky Details Bar */}
          <EventDetailsBar onRegisterClick={handleOpenQRModal} />

          {/* Event Highlights Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <EventHighlightsSection />
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <AboutSection />
          </motion.div>

          {/* Juries & Chief Guests Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <JuriesSection />
          </motion.div>

          {/* Tracks Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <TracksSection />
          </motion.div>

          {/* Location & Timeline Command Hub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <LocationTimelineSection onRegisterClick={handleOpenQRModal} />
          </motion.div>

          {/* Rewards Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <RewardsSection />
          </motion.div>

          {/* Sponsors Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <SponsorsMarquee />
          </motion.div>

          {/* Core Organizing Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <TeamSection />
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <FAQSection />
          </motion.div>

          {/* Register CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <RegisterCTASection onRegisterClick={handleOpenQRModal} />
          </motion.div>

          {/* Footer */}
          <Footer />
        </div>

        {/* ========================================== */}
        {/* MOBILE VIEW (DEDICATED SEPARATE MOBILE UI) */}
        {/* ========================================== */}
        <div className="block md:hidden">
          <MobileNavbar onRegisterClick={handleOpenQRModal} />
          <MobileHeroSection onRegisterClick={handleOpenQRModal} />
          <MobileEventHighlightsSection />
          <MobileAboutSection />
          <MobileJuriesSection />
          <MobileTracksSection />
          <MobileLocationTimelineSection onRegisterClick={handleOpenQRModal} />
          <MobileRewardsSection />
          <MobileSponsorsMarquee />
          <MobileTeamSection />
          <MobileFAQSection />
          <MobileRegisterCTASection onRegisterClick={handleOpenQRModal} />
          <MobileFooter />
          <MobileEventDetailsBar onRegisterClick={handleOpenQRModal} />
        </div>

        {/* Registration QR Modal */}
        <QRModal isOpen={isQRModalOpen} onClose={handleCloseQRModal} />
      </div>
    </main>
  );
}
