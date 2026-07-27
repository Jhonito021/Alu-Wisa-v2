import React from 'react';

export const Devis = ({ setCurrentPage }) => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Devis</h1>
      <p className="text-center text-muted">Sélectionnez la catégorie de menuiserie pour laquelle calculer un devis</p>
      
      <div className="row justify-content-center align-items-center mt-4 text-center">
        <div className="col-md-4 mb-4">
          <div
            className="card custom-card fade-in-cascade h-100 shadow-sm"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            onClick={() => setCurrentPage('fenetre')}
          >
            <div className="card-body text-primary p-4">
              <i className="fas fa-window-restore fa-4x mb-3"></i>
              <h4 className="card-title font-weight-bold">Fenêtre</h4>
              <p className="card-text text-muted">Coulissante, Ouvrante, Naco (Profils K56, B65)</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div
            className="card custom-card fade-in-cascade h-100 shadow-sm"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
            onClick={() => setCurrentPage('porte')}
          >
            <div className="card-body text-success p-4">
              <i className="fas fa-door-open fa-4x mb-3"></i>
              <h4 className="card-title font-weight-bold">Porte</h4>
              <p className="card-text text-muted">Toute vitrée, Demi-vitrée, Porte pleine (Profil T45)</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div
            className="card custom-card fade-in-cascade h-100 shadow-sm"
            style={{ cursor: 'pointer', opacity: 0.85 }}
            onClick={() => alert("Option Volet Roulant bientôt disponible dans la prochaine version!")}
          >
            <div className="card-body text-danger p-4">
              <i className="fas fa-window-maximize fa-4x mb-3"></i>
              <h4 className="card-title font-weight-bold">Volet Roulant</h4>
              <p className="card-text text-muted">Sur mesure (Bientôt disponible)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
