import React, { useState, useEffect } from 'react';

export const HistoriqueView = () => {
  const [fenetres, setFenetres] = useState([]);
  const [portes, setPortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '220px' }}
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
                          <td className="text-center">
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
                          <td className="text-center">
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
