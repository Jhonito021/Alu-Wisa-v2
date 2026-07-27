import React, { useState, useEffect } from 'react';

export const Acceuil = ({ setCurrentPage }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const fullText = "Bienvenue sur DevisTrack !";
    const stopText = "Bienvenue sur ";
    let index = 0;
    let isDeleting = false;
    let timer;

    const animateTyping = () => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
        if (index === fullText.length) {
          isDeleting = true;
          timer = setTimeout(animateTyping, 2000);
          return;
        }
      } else {
        setDisplayText(fullText.substring(0, index));
        index--;
        if (fullText.substring(0, index) === stopText) {
          isDeleting = false;
          timer = setTimeout(animateTyping, 1500);
          return;
        }
      }
      timer = setTimeout(animateTyping, 80);
    };

    timer = setTimeout(animateTyping, 100);
    return () => clearTimeout(timer);
  }, []);

  const conseils = [
    "Rendons les calculs entièrement automatique afin de gagne du temps.",
    "Accéder à l'ensemble des archives afin de consulter les documents ou enregistrements précédemment sauvegardés, pour un meuilleur suivi et une traçabilité compltète."
  ];

  const [randomConseil] = useState(() => conseils[Math.floor(Math.random() * conseils.length)]);

  return (
    <div className="container mt-5 fade-in">
      <div className="p-5 rounded-3 shadow-sm custom-hero">
        <div className="container-fluid py-5">
          <div className="content-hero">
            <h1 id="hero-title" className="display-5 fw-bold">{displayText}</h1>
            <p className="lead">
              Effectuer des calculs de manière automatique, précise et fiable afin de garantir des résultats cohérents.
            </p>
          </div>

          <div className="logo-track">
            <img src="/img/LogoAluWisa.png" alt="Logo AluWisa" className="logo-wisa" />
          </div>
        </div>
      </div>

      <div className="row text-center" style={{ margin: '3rem 0' }}>
        <div className="col-md-4" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('devis')}>
          <div className="card custom-card fade-in-cascade mb-4 h-100">
            <div className="card-body">
              <i className="fas fa-file-invoice fa-3x mb-3 text-primary"></i>
              <h5 className="card-title">Devis</h5>
              <p className="card-text text-muted">Estimer et calculer les coûts pour vos projets de menuiserie alu.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('commande')}>
          <div className="card custom-card fade-in-cascade mb-4 h-100">
            <div className="card-body">
              <i className="fas fa-shopping-cart fa-3x mb-3 text-success"></i>
              <h5 className="card-title">Commande</h5>
              <p className="card-text text-muted">Gérer les commandes clients et le suivi de production.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('historique')}>
          <div className="card custom-card fade-in-cascade mb-4 h-100">
            <div className="card-body">
              <i className="fas fa-history fa-3x mb-3 text-danger"></i>
              <h5 className="card-title">Historiques</h5>
              <p className="card-text text-muted">Consulter l'historique de tous les devis de fenêtres et portes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <h6><i className="fas fa-info-circle"></i> Notre Application:</h6>
        <p className="mb-0">{randomConseil}</p>
      </div>
    </div>
  );
};
