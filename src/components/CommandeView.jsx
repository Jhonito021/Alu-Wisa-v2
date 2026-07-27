import React, { useState } from 'react';
import { generateDevisPDF } from '../utils/pdfGenerator';

export const CommandeView = () => {
  const [clientInfo, setClientInfo] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleExportOrderPDF = () => {
    generateDevisPDF({
      clientInfo: clientInfo,
      devisId: Math.floor(Math.random() * 9000 + 1000),
      title: "Bon de Commande & Devis - Alu WISA",
      items: [{
        designation: "Commande Sur Mesure Menuiserie",
        dimensions: "Sur Mesure",
        surface: "-",
        profil_alu: "Standard",
        type_vitre: "Sur mesure",
        nombre: 1,
        prixTotal: 0
      }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientInfo.nom || !clientInfo.telephone) {
      alert("Veuillez remplir les champs obligatoires (Nom et Téléphone).");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">
        Gestion des Commandes <i className="fas fa-shopping-cart"></i>
      </h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header text-white text-center">
              <h4 className="mb-0">
                <i className="fas fa-file-signature mr-2"></i> Enregistrer une Commande Client
              </h4>
            </div>
            <div className="card-body">
              {submitted ? (
                <div className="alert alert-success text-center">
                  <h4><i className="fas fa-check-circle text-success mr-2"></i> Commande enregistrée avec succès!</h4>
                  <p className="mt-2">
                    Client: <strong>{clientInfo.nom}</strong> ({clientInfo.telephone})<br />
                    Adresse: {clientInfo.adresse || 'N/A'}<br />
                    Notes: {clientInfo.notes || 'Aucune note'}
                  </p>
                  <div className="d-flex justify-content-center align-items-center mt-4 flex-wrap" style={{ gap: '10px' }}>
                    <button
                      className="btn btn-primary btn-lg font-weight-bold"
                      onClick={handleExportOrderPDF}
                    >
                      <i className="fas fa-file-pdf mr-2"></i> Télécharger le Bon de Commande PDF
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => {
                        setSubmitted(false);
                        setClientInfo({ nom: '', telephone: '', adresse: '', notes: '' });
                      }}
                    >
                      Autre commande
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="nomClient" className="font-weight-bold">Nom du Client *</label>
                    <input
                      type="text"
                      id="nomClient"
                      className="form-control"
                      placeholder="ex: Randria Paul"
                      value={clientInfo.nom}
                      onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="telClient" className="font-weight-bold">Téléphone *</label>
                    <input
                      type="tel"
                      id="telClient"
                      className="form-control"
                      placeholder="ex: 034 12 345 67"
                      value={clientInfo.telephone}
                      onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="adresseClient" className="font-weight-bold">Adresse de livraison / Chantier</label>
                    <input
                      type="text"
                      id="adresseClient"
                      className="form-control"
                      placeholder="ex: Lot II M 40 Antananarivo"
                      value={clientInfo.adresse}
                      onChange={(e) => setClientInfo({ ...clientInfo, adresse: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="notesCommande" className="font-weight-bold">Spécifications / Remarques</label>
                    <textarea
                      id="notesCommande"
                      className="form-control"
                      rows="3"
                      placeholder="Détails des finitions, délais souhaités, etc."
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block btn-lg">
                    <i className="fas fa-check-circle mr-2"></i> Valider la commande
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
