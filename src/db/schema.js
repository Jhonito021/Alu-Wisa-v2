import { relations } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const fenetres = pgTable('fenetres', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  longueur: doublePrecision('longueur').notNull().default(0),
  largeur: doublePrecision('largeur').notNull().default(0),
  typeFenetre: text('type_fenetre').notNull().default('coulissante'),
  profilAlu: text('profil_alu').notNull().default('K56'),
  typeVitre: text('type_vitre').notNull().default('claire'),
  surface: doublePrecision('surface').notNull().default(0),
  prix: doublePrecision('prix').notNull().default(0),
  nombre: integer('nombre').notNull().default(1),
  dateCreation: text('date_creation').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const portes = pgTable('portes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  longueur: doublePrecision('longueur').notNull().default(0),
  largeur: doublePrecision('largeur').notNull().default(0),
  typePorte: text('type_porte').notNull().default('Toute vitré'),
  profilAlu: text('profil_alu').notNull().default('T45'),
  typeVitre: text('type_vitre').notNull().default('claire'),
  surface: doublePrecision('surface').notNull().default(0),
  prix: doublePrecision('prix').notNull().default(0),
  nombre: integer('nombre').notNull().default(1),
  dateCreation: text('date_creation').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  fenetres: many(fenetres),
  portes: many(portes),
}));

export const fenetresRelations = relations(fenetres, ({ one }) => ({
  user: one(users, {
    fields: [fenetres.userId],
    references: [users.id],
  }),
}));

export const portesRelations = relations(portes, ({ one }) => ({
  user: one(users, {
    fields: [portes.userId],
    references: [users.id],
  }),
}));
