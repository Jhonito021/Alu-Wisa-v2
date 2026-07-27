import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Acceuil } from './components/Acceuil';
import { Devis } from './components/Devis';
import { FenetreView } from './components/FenetreView';
import { PorteView } from './components/PorteView';
import { CommandeView } from './components/CommandeView';
import { HistoriqueView } from './components/HistoriqueView';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('acceuil');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'devis':
        return <Devis setCurrentPage={setCurrentPage} />;
      case 'fenetre':
        return <FenetreView onRecordCreated={handleRecordCreated} />;
      case 'porte':
        return <PorteView onRecordCreated={handleRecordCreated} />;
      case 'commande':
        return <CommandeView />;
      case 'historique':
        return <HistoriqueView refreshTrigger={refreshTrigger} />;
      case 'acceuil':
      default:
        return <Acceuil setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
