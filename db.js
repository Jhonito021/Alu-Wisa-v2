import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION;
const DB_DIR = isServerless ? '/tmp' : process.cwd();
const DB_FILE = path.join(DB_DIR, 'devis_data.sqlite');
const SEED_FILE = path.join(process.cwd(), 'devis_data.sqlite');

let dbInstance = null;

export async function initDatabase() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('SQLite database loaded from:', DB_FILE);
    } catch (err) {
      console.error('Failed to read existing DB file:', err);
      dbInstance = new SQL.Database();
    }
  } else if (fs.existsSync(SEED_FILE)) {
    try {
      const seedBuffer = fs.readFileSync(SEED_FILE);
      dbInstance = new SQL.Database(seedBuffer);
      console.log('SQLite database loaded from seed:', SEED_FILE);
    } catch (err) {
      console.error('Failed to read seed DB file:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
    console.log('Created new SQLite database');
  }

  // Ensure tables exist
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS fenetres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      longueur REAL NOT NULL,
      largeur REAL NOT NULL,
      type_fenetre TEXT NOT NULL,
      profil_alu TEXT NOT NULL,
      type_vitre TEXT NOT NULL,
      surface REAL NOT NULL,
      prix REAL NOT NULL,
      nombre INTEGER NOT NULL DEFAULT 1,
      date_creation TEXT NOT NULL
    );
  `);

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS portes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      longueur REAL NOT NULL,
      largeur REAL NOT NULL,
      type_porte TEXT NOT NULL,
      profil_alu TEXT NOT NULL,
      type_vitre TEXT NOT NULL,
      surface REAL NOT NULL,
      prix REAL NOT NULL,
      nombre INTEGER NOT NULL DEFAULT 1,
      date_creation TEXT NOT NULL
    );
  `);

  // Seed initial fenetres if empty
  const countFenetresResult = dbInstance.exec("SELECT COUNT(*) as count FROM fenetres");
  const countFenetres = countFenetresResult[0]?.values[0]?.[0] || 0;

  if (countFenetres === 0) {
    const initialFenetres = [
      { longueur: 1, largeur: 1, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1, prix: 460000, nombre: 1, date_creation: '2025-08-28 17:24:11' },
      { longueur: 1.5, largeur: 2.6, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3.9, prix: 1794000, nombre: 1, date_creation: '2025-08-28 17:25:24' },
      { longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:37:08' },
      { longueur: 1.5, largeur: 12, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 18, prix: 8280000, nombre: 1, date_creation: '2025-08-28 17:37:16' },
      { longueur: 1.5, largeur: 12, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 18, prix: 8280000, nombre: 1, date_creation: '2025-08-28 17:37:29' },
      { longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:37:32' },
      { longueur: 1.5, largeur: 2, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:42:02' },
      { longueur: 1, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, date_creation: '2025-08-28 17:42:53' },
      { longueur: 2, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:47:10' },
      { longueur: 1.5, largeur: 2, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 3, prix: 1380000, nombre: 1, date_creation: '2025-08-28 17:47:54' },
      { longueur: 2, largeur: 2.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 5, prix: 2300000, nombre: 1, date_creation: '2025-08-28 17:49:35' },
      { longueur: 1, largeur: 1.5, type_fenetre: 'coulissante', profil_alu: 'K56', type_vitre: 'claire', surface: 1.5, prix: 690000, nombre: 1, date_creation: '2025-08-28 17:50:29' },
      { longueur: 1.8, largeur: 1.9, type_fenetre: 'coulissante', profil_alu: 'B65', type_vitre: 'claire', surface: 3.42, prix: 14364000, nombre: 10, date_creation: '2025-08-29 05:29:32' }
    ];

    for (const f of initialFenetres) {
      dbInstance.run(
        `INSERT INTO fenetres (longueur, largeur, type_fenetre, profil_alu, type_vitre, surface, prix, nombre, date_creation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [f.longueur, f.largeur, f.type_fenetre, f.profil_alu, f.type_vitre, f.surface, f.prix, f.nombre, f.date_creation]
      );
    }
  }

  // Seed initial portes if empty
  const countPortesResult = dbInstance.exec("SELECT COUNT(*) as count FROM portes");
  const countPortes = countPortesResult[0]?.values[0]?.[0] || 0;

  if (countPortes === 0) {
    const initialPortes = [
      { longueur: 1.5, largeur: 1.2, type_porte: 'Toute vitré', profil_alu: 'T45', type_vitre: 'claire', surface: 1.8, prix: 972000, nombre: 1, date_creation: '2025-08-28 18:03:24' }
    ];

    for (const p of initialPortes) {
      dbInstance.run(
        `INSERT INTO portes (longueur, largeur, type_porte, profil_alu, type_vitre, surface, prix, nombre, date_creation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.longueur, p.largeur, p.type_porte, p.profil_alu, p.type_vitre, p.surface, p.prix, p.nombre, p.date_creation]
      );
    }
  }

  saveDatabase(dbInstance);
  return dbInstance;
}

export function saveDatabase(db = dbInstance) {
  if (!db) return;
  try {
    const binaryArray = db.export();
    const buffer = Buffer.from(binaryArray);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error persisting SQLite database to disk:', err);
  }
}

/** Helper to convert sql.js exec result array to clean objects */
export function queryObjects(db, sql, params = []) {
  const result = db.exec(sql, params);
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}
