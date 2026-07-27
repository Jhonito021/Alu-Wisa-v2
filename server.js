import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase, saveDatabase, queryObjects } from './db.js';

async function startServer() {
  const db = await initDatabase();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Static directory for assets in public/
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // --- API Routes ---

  // Get all fenetres
  app.get('/api/fenetres', (_req, res) => {
    try {
      const records = queryObjects(db, "SELECT * FROM fenetres ORDER BY id DESC");
      res.json(records);
    } catch (err) {
      console.error('Error fetching fenetres:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Create a new fenetre record
  app.post('/api/fenetres', (req, res) => {
    try {
      const { longueur, largeur, type_fenetre, profil_alu, type_vitre, surface, prix, nombre } = req.body;
      
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

      const params = [
        Number(longueur) || 0,
        Number(largeur) || 0,
        type_fenetre || 'coulissante',
        profil_alu || 'K56',
        type_vitre || 'claire',
        Number(surface) || 0,
        Number(prix) || 0,
        Number(nombre) || 1,
        formattedDate
      ];

      db.run(
        `INSERT INTO fenetres (longueur, largeur, type_fenetre, profil_alu, type_vitre, surface, prix, nombre, date_creation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      saveDatabase(db);

      const createdList = queryObjects(db, "SELECT * FROM fenetres ORDER BY id DESC LIMIT 1");
      const newRecord = createdList[0];

      res.status(201).json(newRecord);
    } catch (err) {
      console.error('Error creating fenetre:', err);
      res.status(500).json({ error: 'Failed to create quote record in database' });
    }
  });

  // Delete fenetre record by ID
  app.delete('/api/fenetres/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      db.run("DELETE FROM fenetres WHERE id = ?", [id]);
      saveDatabase(db);
      res.json({ success: true, message: `Fenêtre #${id} supprimée` });
    } catch (err) {
      console.error('Error deleting fenetre:', err);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  });

  // Get all portes
  app.get('/api/portes', (_req, res) => {
    try {
      const records = queryObjects(db, "SELECT * FROM portes ORDER BY id DESC");
      res.json(records);
    } catch (err) {
      console.error('Error fetching portes:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Create a new porte record
  app.post('/api/portes', (req, res) => {
    try {
      const { longueur, largeur, type_porte, profil_alu, type_vitre, surface, prix, nombre } = req.body;
      
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

      const params = [
        Number(longueur) || 0,
        Number(largeur) || 0,
        type_porte || 'Toute vitré',
        profil_alu || 'T45',
        type_vitre || 'claire',
        Number(surface) || 0,
        Number(prix) || 0,
        Number(nombre) || 1,
        formattedDate
      ];

      db.run(
        `INSERT INTO portes (longueur, largeur, type_porte, profil_alu, type_vitre, surface, prix, nombre, date_creation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      saveDatabase(db);

      const createdList = queryObjects(db, "SELECT * FROM portes ORDER BY id DESC LIMIT 1");
      const newRecord = createdList[0];

      res.status(201).json(newRecord);
    } catch (err) {
      console.error('Error creating porte:', err);
      res.status(500).json({ error: 'Failed to create quote record in database' });
    }
  });

  // Delete porte record by ID
  app.delete('/api/portes/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      db.run("DELETE FROM portes WHERE id = ?", [id]);
      saveDatabase(db);
      res.json({ success: true, message: `Porte #${id} supprimée` });
    } catch (err) {
      console.error('Error deleting porte:', err);
      res.status(500).json({ error: 'Failed to delete record' });
    }
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
