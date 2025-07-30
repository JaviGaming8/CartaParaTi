import React, { useRef } from "react";
import "./Collage.css";

import collage1 from "../assets/Collage1.png";
import collage2 from "../assets/Collage2.png";
import collage3 from "../assets/Collage3.png";

export default function Collage({ imagenAmpliada, abrirImagen, cerrarImagen }) {
  const timeoutRef = useRef(null);

  // Mostrar imagen ampliada cuando mouse entra a la imagen
  const handleMouseEnter = (src) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    abrirImagen(src);
  };

  // Cuando mouse sale de una imagen
  const handleMouseLeave = (e) => {
    const toElement = e.relatedTarget;

    if (!toElement) {
      cerrarImagen();
      return;
    }

    if (
      toElement.classList.contains("collage") ||
      toElement.classList.contains("modal-imagen") ||
      toElement.closest(".modal-imagen")
    ) {
      return;
    }

    if (
      toElement.classList.contains("fondo") ||
      toElement.closest(".fondo")
    ) {
      cerrarImagen();
      return;
    }

    cerrarImagen();
  };

  // Cuando mouse entra al modal, cancelar cierre
  const handleModalMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cuando mouse sale del modal, cerrar imagen ampliada
  const handleModalMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      cerrarImagen();
    }, 100);
  };

  return (
    <div className="collage-container">
      <img
        className="collage collage-superior"
        src={collage1}
        alt="Collage Superior"
        onClick={() => abrirImagen(collage1)}
      />
      <img
        className="collage collage-medio"
        src={collage2}
        alt="Collage Medio"
        onClick={() => abrirImagen(collage2)}
      />
      <img
        className="collage collage-inferior"
        src={collage3}
        alt="Collage Inferior"
        onClick={() => abrirImagen(collage3)}
      />

      {imagenAmpliada && (
        <div
          className="modal-imagen activa"
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleModalMouseLeave}
        >
          <button
            className="btn-cerrar"
            onClick={cerrarImagen}
            aria-label="Cerrar imagen"
          >
            ×
          </button>

          <img className="imagen-grande" src={imagenAmpliada} alt="Ampliada" />
        </div>
      )}
    </div>
  );
}
