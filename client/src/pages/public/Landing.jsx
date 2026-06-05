import HeroSection from "../../components/public/HeroSection";
import FeatureSection from "../../components/public/FeatureSection";
import PricingSection from "../../components/public/PricingSection";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/public/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    // wait for page render
    const timer = setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - 30,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Landing;
