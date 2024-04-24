"use client";
import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import Features from "./components/Features";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Features />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
