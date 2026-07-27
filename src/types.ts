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

export type PageType = 'acceuil' | 'devis' | 'commande' | 'historique' | 'fenetre' | 'porte';
