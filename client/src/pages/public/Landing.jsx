import HeroSection from "../../components/public/HeroSection";
import FeatureSection from "../../components/public/FeatureSection";
import PricingSection from "../../components/public/PricingSection";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/public/Navbar";

const Landing = () => {
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
