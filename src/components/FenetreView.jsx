import React, { useState } from 'react';
import { generateDevisPDF } from '../utils/pdfGenerator';

export const FenetreView = () => {
  const [formData, setFormData] = useState({
    longueur: '',
    largeur: '',
    type_fenetre: 'coulissante',
    profil_alu: 'K56',
    type_vitre: 'claire',
    nombre: 1
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState({ nom: '', telephone: '', adresse: '' });
  const [showClientModal, setShowClientModal] = useState(false);

  const handleExportPDF = () => {
    if (!result) return;
    generateDevisPDF({
      clientInfo: clientInfo,
      devisId: result.id || Math.floor(Math.random() * 9000 + 1000),
      title: "Devis Estimatif - Fenêtre Aluminium",
      items: [{
        designation: `Fenêtre ${result.typeFenetre.toUpperCase()}`,
        longueur: result.longueur,
        largeur: result.largeur,
        dimensions: `${result.longueur}m x ${result.largeur}m`,
        surface: result.surface,
        profil_alu: result.profilAlu,
        type_vitre: result.typeVitre,
        nombre: result.nombre,
        prixTotal: result.prixTotal
      }]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const L = parseFloat(formData.longueur);
    const l = parseFloat(formData.largeur);
    const N = parseInt(formData.nombre, 10);

    if (isNaN(L) || isNaN(l) || L <= 0 || l <= 0) {
      alert("Veuillez saisir des dimensions valides.");
      return;
    }

    setLoading(true);

    try {
      // Calcul local
      let surfaceUnit = L * l;
      let prixMetreCarre = 150000;
      let formuleText = "";

      if (formData.profil_alu === 'K56') {
        prixMetreCarre = 180000;
      } else if (formData.profil_alu === 'B65') {
        prixMetreCarre = 220000;
      }

      if (formData.type_fenetre === 'coulissante') {
        formuleText = "((L + l) * 2) * Tarif";
        surfaceUnit = (L + l) * 2;
      } else if (formData.type_fenetre === 'ouvrante') {
        formuleText = "(L * l) * Tarif + Supplément Ouvrant";
        surfaceUnit = L * l;
        prixMetreCarre += 30000;
      } else if (formData.type_fenetre === 'naco') {
        formuleText = "(L * l) * Tarif Naco";
        surfaceUnit = L * l;
        prixMetreCarre = 140000;
      }

      if (formData.type_vitre === 'teinte') {
        prixMetreCarre *= 1.10;
      }

      const prixTotal = surfaceUnit * prixMetreCarre * N;

      const payload = {
        longueur: L,
        largeur: l,
        type_fenetre: formData.type_fenetre,
        profil_alu: formData.profil_alu,
        type_vitre: formData.type_vitre,
        surface: L * l,
        formule: formuleText,
        nombre: N,
        prix: prixTotal
      };

      // Sauvegarde dans l'API backend
      let savedRecord = null;
      const res = await fetch('/api/fenetres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        savedRecord = await res.json();
      }

      setResult({
        ...payload,
        id: savedRecord ? savedRecord.id : null,
        typeFenetre: formData.type_fenetre,
        typeVitre: formData.type_vitre,
        profilAlu: formData.profil_alu,
        prixTotal: prixTotal
      });

    } catch (err) {
      console.error("Erreur lors du calcul:", err);
      alert("Calcul effectué localement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">
        Fenêtre <i className="fas fa-window-restore"></i>
      </h1>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-white text-center">
              <h4 className="mb-0">
                <i className="fas fa-gear mr-2"></i> Configurer votre Fenêtre
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="longueur"
                    id="longueur"
                    className="form-control form-control-lg"
                    placeholder=" "
                    value={formData.longueur}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-control-placeholder" htmlFor="longueur">
                    Longueur (m)
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="largeur"
                    id="largeur"
                    className="form-control form-control-lg"
                    placeholder=" "
                    value={formData.largeur}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-control-placeholder" htmlFor="largeur">
                    Largeur (m)
                  </label>
                </div>

                <div className="form-group">
                  <select
                    name="type_fenetre"
                    id="type_fenetre"
                    className="form-control form-control-lg"
                    value={formData.type_fenetre}
                    onChange={handleChange}
                    required
                  >
                    <option value="coulissante">Coulissante</option>
                    <option value="ouvrante">Ouvrante</option>
                    <option value="naco">Naco</option>
                  </select>
                  <label className="form-control-placeholder" htmlFor="type_fenetre">
                    Type de fenêtre
                  </label>
                </div>

                <div className="form-group">
                  <select
                    name="profil_alu"
                    id="profil_alu"
                    className="form-control form-control-lg"
                    value={formData.profil_alu}
                    onChange={handleChange}
                    required
                  >
                    <option value="K56">K56</option>
                    <option value="B65">B65</option>
                  </select>
                  <label className="form-control-placeholder" htmlFor="profil_alu">
                    Alu
                  </label>
                </div>

                <div className="form-group">
                  <select
                    name="type_vitre"
                    id="type_vitre"
                    className="form-control form-control-lg"
                    value={formData.type_vitre}
                    onChange={handleChange}
                    required
                  >
                    <option value="claire">Claire</option>
                    <option value="teinte">Teintée (+10%)</option>
                  </select>
                  <label className="form-control-placeholder" htmlFor="type_vitre">
                    Type de vitre
                  </label>
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    name="nombre"
                    id="nombre"
                    className="form-control form-control-lg"
                    placeholder=" "
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-control-placeholder" htmlFor="nombre">
                    Nombres
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-block btn-lg"
                  disabled={loading}
                >
                  <i className="fas fa-calculator mr-2"></i>
                  {loading ? 'Calcul en cours...' : 'Calculer le prix'}
                </button>
              </form>
            </div>
          </div>

          {result && (
            <div className="alert alert-info mt-4 shadow-sm fade-in">
              <h5 className="text-primary font-weight-bold mb-3">
                <i className="fas fa-check-circle mr-2"></i> Résultat du Calcul :
              </h5>
              <p className="mb-2">
                Fenêtre <strong>{result.typeFenetre}</strong> avec vitre <strong>{result.typeVitre}</strong>
              </p>
              <p className="mb-2">
                Dimensions : {result.longueur} m x {result.largeur}<sup>(ht)</sup> m
              </p>
              <p className="mb-2">
                Profil Alu: <strong>{result.profilAlu}</strong>
              </p>
              <p className="mb-2">
                Surface totale : <strong>{result.surface.toFixed(2)} m²</strong>
              </p>
              <p className="mb-2">
                Formule appliquée : <strong className="text-danger">{result.formule}</strong>
              </p>
              <p className="mb-2">
                Quantités: <strong>{result.nombre}</strong>
              </p>
              <p className="h4 text-success font-weight-bold mt-3 mb-3">
                Prix estimé : {Math.round(result.prixTotal).toLocaleString('fr-FR')} Ar
              </p>

              <hr />

              <h6 className="font-weight-bold text-dark mb-2">
                <i className="fas fa-user-edit mr-2"></i> Informations Client pour le Devis PDF :
              </h6>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nom du Client (ex: M. Rakoto)"
                  value={clientInfo.nom}
                  onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                />
              </div>
              <div className="form-row mb-3">
                <div className="col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Téléphone (ex: 034 12 345 67)"
                    value={clientInfo.telephone}
                    onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Adresse / Chantier"
                    value={clientInfo.adresse}
                    onChange={(e) => setClientInfo({ ...clientInfo, adresse: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block btn-lg font-weight-bold shadow-sm"
                onClick={handleExportPDF}
              >
                <i className="fas fa-file-pdf mr-2"></i> Télécharger le Devis en PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
