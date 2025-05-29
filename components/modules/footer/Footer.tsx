import React from 'react';

import '@/app/global-style/footer.css';

export const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="copyright">
          © 2023–{new Date().getFullYear()} Интернет-магазин «Online shop»
        </div>
      </div>
    </div>
  );
};
