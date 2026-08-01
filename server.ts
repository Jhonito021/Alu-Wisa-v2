import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

export interface FenetreRecord {
  id: number;
  longueur: number;
  largeur: number;
  type_fenetre: string;
  profil_alu: string;
  type_vitre: string;
  surface: number;
  prix: number;
  nombre: number;
  date_creation: string;
}

export interface PorteRecord {
  id: number;
  longueur: number;
  largeur: number;
  type_porte: string;
  profil_alu: string;
  type_vitre: string;
  surface: number;
  prix: number;
  nombre: number;
  date_creation: string;
}

// In-memory data store seeded from db/aluwisa (1).sql
let fenetresStore: FenetreRecord[] = [
  { id: 1, longueur: 1, largeur: 1, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1, prix: 460000, nombre: 1, date_creation: '2025-08-28 17:24:11' },
  { id: 2, longueur: 1.5, largeur: 2.6, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3.9, prix: 1794000, nombre: 1, date_creation: '2025-08-28 17:25:24' },
  { id: 3, longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:37:08' },
  { id: 4, longueur: 1.5, largeur: 12, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 18, prix: 8280000, nombre: 1, date_creation: '2025-08-28 17:37:16' },
  { id: 5, longueur: 1.5, largeur: 12, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 18, prix: 8280000, nombre: 1, date_creation: '2025-08-28 17:37:29' },
  { id: 6, longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:37:32' },
  { id: 7, longueur: 1.5, largeur: 2, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:42:02' },
  { id: 8, longueur: 1, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, date_creation: '2025-08-28 17:42:53' },
  { id: 9, longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:47:10' },
  { id: 10, longueur: 1.5, largeur: 2, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:47:54' },
  { id: 11, longueur: 2, largeur: 2.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 5, prix: 2300000, nombre: 1, date_creation: '2025-08-28 17:49:35' },
  { id: 12, longueur: 1, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, date_creation: '2025-08-28 17:50:29' },
  { id: 13, longueur: 1.8, largeur: 1.9, type_fenetre: 'coulissante', profil_alu: 'B65', type_vitre: 'claire', surface: 3.42, prix: 14364000, nombre: 10, date_creation: '2025-08-29 05:29:32' }
];

let portesStore: PorteRecord[] = [
  { id: 1, longueur: 1.5, largeur: 1.2, type_porte: 'Toute vitré', profil_alu: 'T45', type_vitre: 'claire', surface: 1.8, prix: 972000, nombre: 1, date_creation: '2025-08-28 18:03:24' }
];

let nextFenetreId = 14;
let nextPorteId = 2;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Static directory for assets in public/
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // --- API Routes ---

  // Get all fenetres
  app.get('/api/fenetres', (_req, res) => {
    res.json(fenetresStore);
  });

  // Create a new fenetre record
  app.post('/api/fenetres', (req, res) => {
    const { longueur, largeur, type_fenetre, profil_alu, type_vitre, surface, prix, nombre } = req.body;
    
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newRecord: FenetreRecord = {
      id: nextFenetreId++,
      longueur: Number(longueur) || 0,
      largeur: Number(largeur) || 0,
      type_fenetre: type_fenetre || 'coulissante',
      profil_alu: profil_alu || 'K56',
      type_vitre: type_vitre || 'claire',
      surface: Number(surface) || 0,
      prix: Number(prix) || 0,
      nombre: Number(nombre) || 1,
      date_creation: formattedDate
    };

    fenetresStore.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  // Delete fenetre record by ID
  app.delete('/api/fenetres/:id', (req, res) => {
    const id = Number(req.params.id);
    fenetresStore = fenetresStore.filter(item => item.id !== id);
    res.json({ success: true, message: `Fenêtre #${id} supprimée` });
  });

  // Get all portes
  app.get('/api/portes', (_req, res) => {
    res.json(portesStore);
  });

  // Create a new porte record
  app.post('/api/portes', (req, res) => {
    const { longueur, largeur, type_porte, profil_alu, type_vitre, surface, prix, nombre } = req.body;
    
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newRecord: PorteRecord = {
      id: nextPorteId++,
      longueur: Number(longueur) || 0,
      largeur: Number(largeur) || 0,
      type_porte: type_porte || 'Toute vitré',
      profil_alu: profil_alu || 'T45',
      type_vitre: type_vitre || 'claire',
      surface: Number(surface) || 0,
      prix: Number(prix) || 0,
      nombre: Number(nombre) || 1,
      date_creation: formattedDate
    };

    portesStore.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  // Delete porte record by ID
  app.delete('/api/portes/:id', (req, res) => {
    const id = Number(req.params.id);
    portesStore = portesStore.filter(item => item.id !== id);
    res.json({ success: true, message: `Porte #${id} supprimée` });
  });

  // --- Vite / Static Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
