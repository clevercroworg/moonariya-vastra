import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryMarquee } from "@/components/home/CategoryMarquee";
import { CategoryArc } from "@/components/home/CategoryArc";
import { NewArrivals } from "@/components/home/NewArrivals";
import { SareeShow } from "@/components/home/SareeShow";
import { FabricGuide } from "@/components/home/FabricGuide";
import { FestiveBanner } from "@/components/home/FestiveBanner";
import { OccasionBento } from "@/components/home/OccasionBento";
import { BrandStory } from "@/components/home/BrandStory";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryMarquee />
      <CategoryArc />
      <NewArrivals />
      <SareeShow />
      <FabricGuide />
      <FestiveBanner />
      <OccasionBento />
      <BrandStory />
      <TrustStrip />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
