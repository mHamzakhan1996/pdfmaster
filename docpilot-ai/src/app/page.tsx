import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { AiToolsShowcase } from "@/components/landing/AiToolsShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <AiToolsShowcase />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}
