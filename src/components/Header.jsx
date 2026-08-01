import React, { useState, useEffect } from 'react';

export const Header = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [timeState, setTimeState] = useState({
    h: '--',
    m: '--',
    s: '--',
    dateStr: 'Chargement...'
  });

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      console.log('PWA installée avec succès');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const updateTime = () => {
      const now = new Date();
      const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const mois = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
        'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];

      const jourSemaine = jours[now.getDay()];
      const jour = String(now.getDate()).padStart(2, '0');
      const moisTxt = mois[now.getMonth()];
      const annee = now.getFullYear();

      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      setTimeState({
        h,
        m,
        s,
        dateStr: `${jourSemaine} ${jour} ${moisTxt} ${annee}`
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('L\'utilisateur a accepté l\'installation de la PWA');
    }
    setDeferredPrompt(null);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="logo-nav">
          <a
            href="#acceuil"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('acceuil');
            }}
            className="d-flex align-items-center text-decoration-none"
            style={{ gap: '10px' }}
          >
            <img
              src="/img/LogoAluWisa.png"
              alt="Logo AluWisa"
              className="nav-logo-img"
            />
            <span>DevisTrack</span>
          </a>
        </div>

        <button
          className="mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="nav-item">
            <a
              href="#acceuil"
              className={`nav-link ${currentPage === 'acceuil' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('acceuil');
              }}
            >
              <i className="fas fa-home"></i> Acceuil
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#devis"
              className={`nav-link ${currentPage === 'devis' || currentPage === 'fenetre' || currentPage === 'porte' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('devis');
              }}
            >
              <i className="fas fa-file-invoice"></i> Devis
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#commande"
              className={`nav-link ${currentPage === 'commande' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('commande');
              }}
            >
              <i className="fas fa-shopping-cart"></i> Commande
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#historique"
              className={`nav-link ${currentPage === 'historique' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('historique');
              }}
            >
              <i className="fas fa-history"></i> Historique
            </a>
          </li>

          {deferredPrompt && !isAppInstalled && (
            <li className="nav-item ml-md-2">
              <button
                className="btn btn-warning btn-sm font-weight-bold d-flex align-items-center"
                onClick={handleInstallPWA}
                style={{ gap: '6px', borderRadius: '20px', padding: '0.4rem 0.9rem' }}
                title="Installer l'application DevisTrack sur votre appareil"
              >
                <i className="fas fa-download"></i> Installer PWA
              </button>
            </li>
          )}
        </ul>

        <div className="horloge">
          <div id="dateTime">
            <div id="heure">
              <span id="h">{timeState.h}</span>
              <span className="blink-colon">:</span>
              <span id="m">{timeState.m}</span>
              <span className="blink-colon">:</span>
              <span id="s">{timeState.s}</span>
            </div>
            <div id="date">{timeState.dateStr}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
