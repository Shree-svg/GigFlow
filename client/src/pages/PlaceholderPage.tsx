import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex">
      <Sidebar onNewLead={() => alert('Navigate to Leads page to add a new lead.')} />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: 72 }}>
        <Navbar search={search} onSearch={setSearch} />

        <main className="flex-1 flex flex-col items-center justify-center p-5">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center"
          >
            <span className="material-symbols-outlined text-6xl text-primary-container mb-4">construction</span>
            <h2 className="font-sora font-bold text-3xl text-on-surface">{title}</h2>
            <p className="font-hanken text-on-surface-variant mt-2 max-w-md mx-auto">{description}</p>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
