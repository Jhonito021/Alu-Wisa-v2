import React, { useState, useEffect } from 'react';
import { generateDevisPDF } from '../utils/pdfGenerator';

export const HistoriqueView = () => {
  const [fenetres, setFenetres] = useState([]);
  const [portes, setPortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleExportFenetrePDF = (fenetre) => {
    generateDevisPDF({
      devisId: fenetre.id,
      title: "Devis - Fenêtre Aluminium",
      items: [{
        designation: `Fenêtre ${fenetre.type_fenetre.toUpperCase()}`,
        dimensions: `${fenetre.longueur}m x ${fenetre.largeur}m`,
        surface: fenetre.surface,
        profil_alu: fenetre.profil_alu,
        type_vitre: fenetre.type_vitre,
        nombre: fenetre.nombre,
        prixTotal: fenetre.prix
      }]
    });
  };

  const handleExportPortePDF = (porte) => {
    generateDevisPDF({
      devisId: porte.id,
      title: "Devis - Porte Aluminium",
      items: [{
        designation: `Porte ${porte.type_porte.toUpperCase()}`,
        dimensions: `${porte.longueur}m x ${porte.largeur}m`,
        surface: porte.surface,
        profil_alu: porte.profil_alu,
        type_vitre: porte.type_vitre,
        nombre: porte.nombre,
        prixTotal: porte.prix
      }]
    });
  };

  const handleExportAllPDF = () => {
    const allItems = [
      ...filteredFenetres.map(f => ({
        designation: `Fenêtre ${f.type_fenetre.toUpperCase()} (#${f.id})`,
        dimensions: `${f.longueur}m x ${f.largeur}m`,
        surface: f.surface,
        profil_alu: f.profil_alu,
        type_vitre: f.type_vitre,
        nombre: f.nombre,
        prixTotal: f.prix
      })),
      ...filteredPortes.map(p => ({
        designation: `Porte ${p.type_porte.toUpperCase()} (#${p.id})`,
        dimensions: `${p.longueur}m x ${p.largeur}m`,
        surface: p.surface,
        profil_alu: p.profil_alu,
        type_vitre: p.type_vitre,
        nombre: p.nombre,
        prixTotal: p.prix
      }))
    ];

    if (allItems.length === 0) {
      alert("Aucun devis disponible dans l'historique.");
      return;
    }

    generateDevisPDF({
      title: "Récapitulatif Général de l'Historique des Devis",
      items: allItems
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resFen, resPortes] = await Promise.all([
        fetch('/api/fenetres'),
        fetch('/api/portes')
      ]);

      if (resFen.ok) {
        const dataFen = await resFen.json();
        setFenetres(dataFen);
      }
      if (resPortes.ok) {
        const dataPortes = await resPortes.json();
        setPortes(dataPortes);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFenetre = async (id) => {
    if (!window.confirm(`Voulez-vous supprimer le devis fenêtre #${id} ?`)) return;
    try {
      const res = await fetch(`/api/fenetres/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFenetres(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression fenêtre:", err);
    }
  };

  const handleDeletePorte = async (id) => {
    if (!window.confirm(`Voulez-vous supprimer le devis porte #${id} ?`)) return;
    try {
      const res = await fetch(`/api/portes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortes(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression porte:", err);
    }
  };

  const filteredFenetres = fenetres.filter(f =>
    f.type_fenetre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.profil_alu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toString().includes(searchTerm)
  );

  const filteredPortes = portes.filter(p =>
    p.type_porte.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profil_alu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="container-historique mt-5 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>
          <i className="fas fa-history text-primary mr-2"></i> Historique des Devis
        </h2>
        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
          <button
            className="btn btn-danger d-flex align-items-center font-weight-bold"
            onClick={handleExportAllPDF}
            title="Exporter tous les devis de l'historique en un document PDF"
            style={{ gap: '6px' }}
          >
            <i className="fas fa-file-pdf"></i> Exporter Tout (PDF)
          </button>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '200px' }}
          />
          <button className="btn btn-outline-secondary" onClick={fetchData} title="Rafraîchir">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p className="mt-2 text-muted">Chargement de l'historique...</p>
        </div>
      ) : (
        <div className="row">
          {/* Fenêtres */}
          <div className="col-lg-6 mb-5">
            <div className="historique-fenetre card shadow-sm border-0">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-window-restore mr-2"></i> Fenêtres ({filteredFenetres.length})
                </h4>
              </div>
              <div className="card-body p-0 table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-bordered table-striped mb-0">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Dimensions</th>
                      <th>Surface</th>
                      <th>Nbr</th>
                      <th>Prix</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFenetres.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          Aucun devis fenêtre enregistré.
                        </td>
                      </tr>
                    ) : (
                      filteredFenetres.map((fenetre) => (
                        <tr key={fenetre.id}>
                          <td><strong>#{fenetre.id}</strong></td>
                          <td>
                            <span className="badge badge-info">{fenetre.type_fenetre}</span><br />
                            <small className="text-muted">{fenetre.profil_alu} - {fenetre.type_vitre}</small>
                          </td>
                          <td>{fenetre.longueur}m x {fenetre.largeur}m</td>
                          <td>{fenetre.surface} m²</td>
                          <td>{fenetre.nombre}</td>
                          <td className="text-success font-weight-bold">
                            {Math.round(fenetre.prix).toLocaleString('fr-FR')} Ar
                          </td>
                          <td><small>{fenetre.date_creation}</small></td>
                          <td className="text-center d-flex justify-content-center" style={{ gap: '5px' }}>
                            <button
                              className="btn btn-sm btn-danger font-weight-bold d-inline-flex align-items-center"
                              onClick={() => handleExportFenetrePDF(fenetre)}
                              title="Télécharger le devis en PDF"
                              style={{ gap: '4px' }}
                            >
                              <i className="fas fa-file-pdf"></i> PDF
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteFenetre(fenetre.id)}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Portes */}
          <div className="col-lg-6 mb-5">
            <div className="historique-porte card shadow-sm border-0">
              <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-door-open mr-2"></i> Portes ({filteredPortes.length})
                </h4>
              </div>
              <div className="card-body p-0 table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-bordered table-striped mb-0">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Dimensions</th>
                      <th>Surface</th>
                      <th>Nbr</th>
                      <th>Prix</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPortes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          Aucun devis porte enregistré.
                        </td>
                      </tr>
                    ) : (
                      filteredPortes.map((porte) => (
                        <tr key={porte.id}>
                          <td><strong>#{porte.id}</strong></td>
                          <td>
                            <span className="badge badge-success">{porte.type_porte}</span><br />
                            <small className="text-muted">{porte.profil_alu} - {porte.type_vitre}</small>
                          </td>
                          <td>{porte.longueur}m x {porte.largeur}m</td>
                          <td>{porte.surface} m²</td>
                          <td>{porte.nombre}</td>
                          <td className="text-success font-weight-bold">
                            {Math.round(porte.prix).toLocaleString('fr-FR')} Ar
                          </td>
                          <td><small>{porte.date_creation}</small></td>
                          <td className="text-center d-flex justify-content-center" style={{ gap: '5px' }}>
                            <button
                              className="btn btn-sm btn-danger font-weight-bold d-inline-flex align-items-center"
                              onClick={() => handleExportPortePDF(porte)}
                              title="Télécharger le devis en PDF"
                              style={{ gap: '4px' }}
                            >
                              <i className="fas fa-file-pdf"></i> PDF
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeletePorte(porte.id)}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
