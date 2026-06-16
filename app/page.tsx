import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import AboutSection from './components/AboutSection';
import ContactAndFooter from './components/ContactAndFooter';
import ProgramSection from "./components/ProgramSection"; 
import ArticleSection from './components/ArticleSection';
import CampaignSection from './components/CampaignSection';
import TransparansiPreview from './components/TransparansiPreview';


export default function Home() {
  return (
    <div className="min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection/>
        <AboutSection />
        <CampaignSection />
        <ProgramSection initialPrograms={[]} />
        <TransparansiPreview />
        <ArticleSection />
        <ContactAndFooter />
      </main>
      
    </div>
  );
}