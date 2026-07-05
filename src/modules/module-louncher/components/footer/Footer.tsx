import React from "react";

export const Footer = () => {
  return (
    <footer className="mt-20 pt-8 border-t border-gray-200/60 flex flex-col sm:flex-row justify-between items-center gap-6">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-medium text-gray-400">
          © 2024 Club Atlético Nacional • Plataforma Administrativa
        </span>
      </div>
      <div className="flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <a className="hover:text-primary transition-colors" href="#">
          Términos
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Privacidad
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Documentación
        </a>
      </div>
    </footer>
  );
};
