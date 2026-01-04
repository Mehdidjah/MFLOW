import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditorSection from '@/components/sections/EditorSection';
import TutorialSection from '@/components/sections/TutorialSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import CLISection from '@/components/sections/CLISection';
import DocsSection from '@/components/sections/DocsSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('editor');

  const renderSection = () => {
    switch (activeSection) {
      case 'editor':
        return <EditorSection />;
      case 'tutorial':
        return <TutorialSection />;
      case 'features':
        return <FeaturesSection />;
      case 'cli':
        return <CLISection />;
      case 'docs':
        return <DocsSection />;
      default:
        return <EditorSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background subtle-grid">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1">
        {renderSection()}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
