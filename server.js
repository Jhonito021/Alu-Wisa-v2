import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.js';
import { fenetres, portes } from './src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Seed initial data if tables are empty
const initialFenetres = [
  { longueur: 1, largeur: 1, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 1, prix: 460000, nombre: 1, dateCreation: '2025-08-28 17:24:11' },
  { longueur: 1.5, largeur: 2.6, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3.9, prix: 1794000, nombre: 1, dateCreation: '2025-08-28 17:25:24' },
  { longueur: 2, largeur: 1.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3, prix: 1380000, nombre: 1, dateCreation: '2025-08-28 17:37:08' },
  { longueur: 1.5, largeur: 12, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 18, prix: 8280000, nombre: 1, dateCreation: '2025-08-28 17:37:16' },
  { longueur: 1.5, largeur: 12, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 18, prix: 8280000, nombre: 1, dateCreation: '2025-08-28 17:37:29' },
  { longueur: 2, largeur: 1.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3, prix: 1380000, nombre: 1, dateCreation: '2025-08-28 17:37:32' },
  { longueur: 1.5, largeur: 2, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3, prix: 1380000, nombre: 1, dateCreation: '2025-08-28 17:42:02' },
  { longueur: 1, largeur: 1.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, dateCreation: '2025-08-28 17:42:53' },
  { longueur: 2, largeur: 1.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3, prix: 1380000, nombre: 1, dateCreation: '2025-08-28 17:47:10' },
  { longueur: 1.5, largeur: 2, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 3, prix: 1380000, nombre: 1, dateCreation: '2025-08-28 17:47:54' },
  { longueur: 2, largeur: 2.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 5, prix: 2300000, nombre: 1, dateCreation: '2025-08-28 17:49:35' },
  { longueur: 1, largeur: 1.5, typeFenetre: 'coulissante', profilAlu: 'K56', typeVitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, dateCreation: '2025-08-28 17:50:29' },
  { longueur: 1.8, largeur: 1.9, typeFenetre: 'coulissante', profilAlu: 'B65', typeVitre: 'claire', surface: 3.42, prix: 14364000, nombre: 10, dateCreation: '2025-08-29 05:29:32' }
];

const initialPortes = [
  { longueur: 1.5, largeur: 1.2, typePorte: 'Toute vitré', profilAlu: 'T45', typeVitre: 'claire', surface: 1.8, prix: 972000, nombre: 1, dateCreation: '2025-08-28 18:03:24' }
];

async function seedDatabaseIfEmpty() {
  try {
    const existingFenetres = await db.select().from(fenetres).limit(1);
    if (existingFenetres.length === 0) {
      await db.insert(fenetres).values(initialFenetres);
    }
    const existingPortes = await db.select().from(portes).limit(1);
    if (existingPortes.length === 0) {
      await db.insert(portes).values(initialPortes);
    }
  } catch (err) {
    console.error('Initial database seed info:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Static directory for assets in public/
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // Seed database
  await seedDatabaseIfEmpty();

  // --- API Routes ---

  // Get all fenetres
  app.get('/api/fenetres', async (_req, res) => {
    try {
      const records = await db.select().from(fenetres).orderBy(desc(fenetres.id));
      const formatted = records.map(r => ({
        id: r.id,
        longueur: r.longueur,
        largeur: r.largeur,
        type_fenetre: r.typeFenetre,
        profil_alu: r.profilAlu,
        type_vitre: r.typeVitre,
        surface: r.surface,
        prix: r.prix,
        nombre: r.nombre,
        date_creation: r.dateCreation
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Failed to fetch fenetres:', error);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

  // Create a new fenetre record
  app.post('/api/fenetres', async (req, res) => {
    try {
      const { longueur, largeur, type_fenetre, profil_alu, type_vitre, surface, prix, nombre } = req.body;
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

      const inserted = await db.insert(fenetres).values({
        longueur: Number(longueur) || 0,
        largeur: Number(largeur) || 0,
        typeFenetre: type_fenetre || 'coulissante',
        profilAlu: profil_alu || 'K56',
        typeVitre: type_vitre || 'claire',
        surface: Number(surface) || 0,
        prix: Number(prix) || 0,
        nombre: Number(nombre) || 1,
        dateCreation: formattedDate
      }).returning();

      const r = inserted[0];
      res.status(201).json({
        id: r.id,
        longueur: r.longueur,
        largeur: r.largeur,
        type_fenetre: r.typeFenetre,
        profil_alu: r.profilAlu,
        type_vitre: r.typeVitre,
        surface: r.surface,
        prix: r.prix,
        nombre: r.nombre,
        date_creation: r.dateCreation
      });
    } catch (error) {
      console.error('Failed to create fenetre:', error);
      res.status(500).json({ error: 'Failed to create record' });
    }
  });

  // Delete fenetre record by ID
  app.delete('/api/fenetres/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(fenetres).where(eq(fenetres.id, id));
      res.json({ success: true, message: `Fenêtre #${id} supprimée` });
    } catch (error) {
      console.error('Failed to delete fenetre:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  });

  // Get all portes
  app.get('/api/portes', async (_req, res) => {
    try {
      const records = await db.select().from(portes).orderBy(desc(portes.id));
      const formatted = records.map(r => ({
        id: r.id,
        longueur: r.longueur,
        largeur: r.largeur,
        type_porte: r.typePorte,
        profil_alu: r.profilAlu,
        type_vitre: r.typeVitre,
        surface: r.surface,
        prix: r.prix,
        nombre: r.nombre,
        date_creation: r.dateCreation
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Failed to fetch portes:', error);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

  // Create a new porte record
  app.post('/api/portes', async (req, res) => {
    try {
      const { longueur, largeur, type_porte, profil_alu, type_vitre, surface, prix, nombre } = req.body;
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

      const inserted = await db.insert(portes).values({
        longueur: Number(longueur) || 0,
        largeur: Number(largeur) || 0,
        typePorte: type_porte || 'Toute vitré',
        profilAlu: profil_alu || 'T45',
        typeVitre: type_vitre || 'claire',
        surface: Number(surface) || 0,
        prix: Number(prix) || 0,
        nombre: Number(nombre) || 1,
        dateCreation: formattedDate
      }).returning();

      const r = inserted[0];
      res.status(201).json({
        id: r.id,
        longueur: r.longueur,
        largeur: r.largeur,
        type_porte: r.typePorte,
        profil_alu: r.profilAlu,
        type_vitre: r.typeVitre,
        surface: r.surface,
        prix: r.prix,
        nombre: r.nombre,
        date_creation: r.dateCreation
      });
    } catch (error) {
      console.error('Failed to create porte:', error);
      res.status(500).json({ error: 'Failed to create record' });
    }
  });

  // Delete porte record by ID
  app.delete('/api/portes/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(portes).where(eq(portes.id, id));
      res.json({ success: true, message: `Porte #${id} supprimée` });
    } catch (error) {
      console.error('Failed to delete porte:', error);
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
