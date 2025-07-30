import React, { useEffect, useRef, useState } from "react";
import Carta from "./components/Carta";
import CollageSuperior from "./components/Collage";
import "./App.css";
import cancion from "./assets/TeAmo.mp3";
import audioExtra from "./assets/audioextra.mp3";

function App() {
  const audioRef = useRef(null);
  const audioExtraRef = useRef(null);
  const [extraReproduciendo, setExtraReproduciendo] = useState(false);

  // Estado para controlar la imagen ampliada desde aquí
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  // Función para cerrar imagen (la pasamos al Collage)
  const cerrarImagen = () => {
    setImagenAmpliada(null);
  };

  // Función para abrir imagen (la pasamos al Collage)
  const abrirImagen = (src) => {
    setImagenAmpliada(src);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = true;
      audio.play()
        .then(() => {
          setTimeout(() => {
            audio.muted = false;
          }, 1000);
        })
        .catch((error) => {
          console.log("Error reproduciendo audio:", error);
        });
    }
  }, []);

  const toggleAudioExtra = () => {
    const principal = audioRef.current;
    const extra = audioExtraRef.current;

    if (!extra) return;

    if (extra.paused) {
      if (principal && !principal.paused) principal.pause();

      extra.play().then(() => {
        setExtraReproduciendo(true);
      }).catch((err) => {
        console.log("No se pudo reproducir el audio extra:", err);
      });
    } else {
      extra.pause();
      setExtraReproduciendo(false);
      if (principal && principal.paused) {
        principal.play().catch((err) => {
          console.log("No se pudo reanudar la canción principal:", err);
        });
      }
    }
  };

  // NUEVO: Manejar movimiento del mouse en el fondo para cerrar imagen ampliada si el mouse no está en collage ni modal
  const handleFondoMouseMove = (e) => {
    if (!imagenAmpliada) return;

    const collageContainer = document.querySelector(".collage-container");
    const modalImagen = document.querySelector(".modal-imagen");

    const x = e.clientX;
    const y = e.clientY;

    let dentroCollage = false;
    let dentroModal = false;

    if (collageContainer) {
      const rectCollage = collageContainer.getBoundingClientRect();
      dentroCollage =
        x >= rectCollage.left &&
        x <= rectCollage.right &&
        y >= rectCollage.top &&
        y <= rectCollage.bottom;
    }

    if (modalImagen) {
      const rectModal = modalImagen.getBoundingClientRect();
      dentroModal =
        x >= rectModal.left &&
        x <= rectModal.right &&
        y >= rectModal.top &&
        y <= rectModal.bottom;
    }

    if (!dentroCollage && !dentroModal) {
      cerrarImagen();
    }
  };

  return (
    <div className="fondo" onMouseMove={handleFondoMouseMove}>
      <CollageSuperior
        imagenAmpliada={imagenAmpliada}
        abrirImagen={abrirImagen}
        cerrarImagen={cerrarImagen}
      />

      <div className="contenedor-carta">
        <Carta />
      </div>

      <audio ref={audioRef} src={cancion} loop />
      <audio ref={audioExtraRef} src={audioExtra} />

      <div className="boton-extra-audio">
        <button onClick={toggleAudioExtra}>
          {extraReproduciendo ? "⏸ Pausar" : " Escuchar al Final"}
        </button>
      </div>

      
    </div>
  );
}

export default App;
