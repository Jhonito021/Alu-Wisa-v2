import React from 'react';

export const Footer = () => {
  const dateObj = new Date();
  const monthYear = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

  return (
    <footer className="footer mt-5">
      <div className="container">
        <p>&copy; <span>{monthYear}</span> Jhonito 021. Tous droits réservés.</p>
      </div>
    </footer>
  );
};
