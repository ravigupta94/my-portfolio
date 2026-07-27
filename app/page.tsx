import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Stats from '@/sections/Stats';
import Skills from '@/sections/Skills';
import ExperienceSection from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Company from '@/sections/Company';
import Contact from '@/sections/Contact';

/**
 * Home page — assembles all sections in order.
 * All heavy animations are handled client-side within each section component.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Skills />
      <ExperienceSection />
      <Projects />
      <Company />
      <Contact />
    </>
  );
}
