'use client'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TestimonialsSection from './components/TestimonialsSection'
import Features from './components/Features'


export default function Page() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <Features/>
      <TestimonialsSection/>
    </>
  )
}