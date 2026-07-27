//Horloge
function afficherDateHeure() {
    const maintenant = new Date();

    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                  'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const jourSemaine = jours[maintenant.getDay()];
    const jour = String(maintenant.getDate()).padStart(2, '0');
    const moisTxt = mois[maintenant.getMonth()];
    const annee = maintenant.getFullYear();

    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');

    // Mise à jour heure
    document.getElementById('h').textContent = heures;
    document.getElementById('m').textContent = minutes;
    document.getElementById('s').textContent = secondes;

    // Mise à jour date
    const dateTexte = `${jourSemaine} ${jour} ${moisTxt} ${annee}`;
    const dateEl = document.getElementById('date');
    dateEl.textContent = dateTexte;

    // Redémarrer animation de la date (rejouer à chaque seconde)
    dateEl.style.animation = 'none';
    dateEl.offsetHeight; // Forcer reflow
    dateEl.style.animation = '';
  }

  setInterval(afficherDateHeure, 1000);
  afficherDateHeure();
