import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a PDF quote (devis) document for clients
 * @param {Object} options
 * @param {Object} options.clientInfo - Client details { nom, telephone, adresse, notes }
 * @param {Array} options.items - List of items [{ designation, type, dimensions, surface, profil, vitre, nbr, unitPrice, totalPrice }]
 * @param {string|number} options.devisId - Quote reference number
 * @param {string} [options.title] - Custom document title
 */
export const generateDevisPDF = ({
  clientInfo = {},
  items = [],
  devisId = null,
  title = "DEVIS ESTIMATIF DE MENUISERIE ALUMINIUM"
}) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [30, 51, 120];  // #1e3378 (Alu WISA Blue)
  const secondaryColor = [235, 125, 38]; // #eb7d26 (Alu WISA Orange)
  const darkTextColor = [33, 37, 41];
  const lightBgColor = [242, 236, 232];

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const refNum = devisId ? `DEV-${String(devisId).padStart(4, '0')}` : `DEV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*900 + 100)}`;

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 32, 'F');

  // Decorative Accent line
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 32, 210, 3, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ALU WISA - DEVIS TRACK', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Menuiserie Aluminium & Vitrerie sur mesure', 14, 23);

  // Document Reference & Date in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`RÉF: ${refNum}`, 196, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Date: ${dateStr}`, 196, 21, { align: 'right' });
  doc.text(`Validité: 30 jours`, 196, 27, { align: 'right' });

  let y = 43;

  // Company Info Block & Client Info Block
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(14, y, 88, 36, 3, 3, 'F');
  doc.roundedRect(108, y, 88, 36, 3, 3, 'F');

  // Company Details
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ÉMETTEUR :', 18, y + 7);

  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ALU WISA MADAGASCAR', 18, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Atelier de fabrication Aluminium', 18, y + 19);
  doc.text('Antananarivo, Madagascar', 18, y + 24);
  doc.text('Tél: +261 34 12 345 67 / +261 32 00 000 00', 18, y + 29);

  // Client Details
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DESTINATAIRE (CLIENT) :', 112, y + 7);

  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  const clientNom = clientInfo.nom || 'Client Particulier';
  doc.text(clientNom.toUpperCase(), 112, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Téléphone: ${clientInfo.telephone || 'Non renseigné'}`, 112, y + 20);
  doc.text(`Adresse/Chantier: ${clientInfo.adresse || 'Antananarivo'}`, 112, y + 25);
  if (clientInfo.notes) {
    const noteShort = clientInfo.notes.length > 38 ? clientInfo.notes.substring(0, 35) + '...' : clientInfo.notes;
    doc.text(`Notes: ${noteShort}`, 112, y + 30);
  }

  y += 43;

  // Document Section Title
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), 14, y);

  y += 5;

  // Table Data Formatting
  const tableHead = [['Désignation', 'Dimensions', 'Profil / Vitre', 'Qté', 'Surface Total', 'Prix Total (Ar)']];
  
  const tableRows = items.map((item, index) => {
    const name = item.designation || `Ouvrage #${index + 1}`;
    const dims = item.dimensions || `${item.longueur || 0}m x ${item.largeur || 0}m`;
    const specs = `${item.profil_alu || item.profilAlu || 'Standard'} (${item.type_vitre || item.typeVitre || 'Claire'})`;
    const qty = item.nombre || item.nbr || 1;
    const surf = item.surface ? `${Number(item.surface).toFixed(2)} m²` : '-';
    const totalAr = Math.round(item.prix || item.prixTotal || 0).toLocaleString('fr-FR') + ' Ar';

    return [name, dims, specs, qty, surf, totalAr];
  });

  // Render Table
  autoTable(doc, {
    startY: y,
    head: tableHead,
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    bodyStyles: {
      textColor: darkTextColor,
      fontSize: 8.5
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 32 },
      2: { cellWidth: 40 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 24, halign: 'center' },
      5: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : y + 40;

  // Total Calculation
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.prix || item.prixTotal) || 0), 0);
  const formattedGrandTotal = Math.round(grandTotal).toLocaleString('fr-FR') + ' Ar';

  // Total Summary Box
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(118, finalY, 78, 26, 2, 2, 'F');
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(118, finalY, 78, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text('Total Hors Taxe (HT) :', 122, finalY + 8);
  doc.text('TVA (0% / Exonéré) :', 122, finalY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...secondaryColor);
  doc.text('NET À PAYER :', 122, finalY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(`${formattedGrandTotal}`, 192, finalY + 8, { align: 'right' });
  doc.text('0 Ar', 192, finalY + 14, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(`${formattedGrandTotal}`, 192, finalY + 21, { align: 'right' });

  // Terms & Conditions Block
  const termsY = finalY + 34;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('CONDITIONS & MODALITÉS DE PAIEMENT :', 14, termsY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('• Modalité de règlement: 50% d\'acompte à la commande, solde à la livraison.', 14, termsY + 5);
  doc.text('• Délai de réalisation estimé: 5 à 10 jours ouvrés à compter de la validation.', 14, termsY + 9);
  doc.text('• Les prix figurant sur ce devis sont valables pour une durée de 30 jours.', 14, termsY + 13);

  // Signatures
  const sigY = termsY + 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkTextColor);
  doc.text('Signature & Cachet ALU WISA', 25, sigY);
  doc.text('Bon pour accord (Signature Client)', 135, sigY);

  doc.setDrawColor(180, 180, 180);
  doc.line(20, sigY + 18, 80, sigY + 18);
  doc.line(130, sigY + 18, 190, sigY + 18);

  // Footer Page Number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `ALU WISA - DevisTrack Express | Document généré le ${dateStr} - Page ${i} sur ${pageCount}`,
      105,
      287,
      { align: 'center' }
    );
  }

  // Save the PDF file
  const fileName = `Devis_AluWisa_${refNum}.pdf`;
  doc.save(fileName);
};
