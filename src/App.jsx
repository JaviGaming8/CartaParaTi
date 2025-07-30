import React, { useRef, useState, useEffect } from "react";
import Carta from "./components/Carta";
import CollageSuperior from "./components/Collage";
import "./App.css";
import cancion from "./assets/TeAmo.mp3";
import audioExtra from "./assets/audioextra.mp3";
import cartaAnimada from "./assets/carta-animada.gif";

function App() {
  const audioRef = useRef(null);
  const audioExtraRef = useRef(null);
  const [extraReproduciendo, setExtraReproduciendo] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [abierta, setAbierta] = useState(false);
  const [cancionPrincipalReproduciendo, setCancionPrincipalReproduciendo] = useState(false);

  const cerrarImagen = () => setImagenAmpliada(null);
  const abrirImagen = (src) => setImagenAmpliada(src);

  const abrirCarta = () => {
    const audio = audioRef.current;
    const extra = audioExtraRef.current;

    if (extra && !extra.paused) {
      extra.pause();
      extra.currentTime = 0;
      setExtraReproduciendo(false);
    }

    setAbierta(true);

    if (audio) {
      console.log("Intentando reproducir audio principal...");
      audio.currentTime = 0;
      audio.play()
        .then(() => {
          console.log("Reproducción iniciada");
          setCancionPrincipalReproduciendo(true);
        })
        .catch(err => {
          console.log("Error al reproducir:", err);
        });
    }
  };

  useEffect(() => {
    console.log('audioRef.current:', audioRef.current);
    console.log('audioExtraRef.current:', audioExtraRef.current);
  }, [abierta]); // <--- ahora espera que `abierta` cambie para mostrar refs ya montados

  const toggleAudioExtra = () => {
    const principal = audioRef.current;
    const extra = audioExtraRef.current;

    if (!extra) return;

    if (extra.paused) {
      if (principal && !principal.paused) {
        principal.pause();
        setCancionPrincipalReproduciendo(false);
      }

      extra.currentTime = 0;
      extra.play()
        .then(() => {
          console.log("Audio extra iniciado");
          setExtraReproduciendo(true);
        })
        .catch((err) => {
          console.log("No se pudo reproducir el audio extra:", err);
        });
    } else {
      extra.pause();
      extra.currentTime = 0;
      setExtraReproduciendo(false);

      if (principal) {
        principal.play()
          .then(() => {
            setCancionPrincipalReproduciendo(true);
          })
          .catch((err) => {
            console.log("No se pudo reanudar la canción principal:", err);
          });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleAudioEnd = () => setCancionPrincipalReproduciendo(false);
      const handleAudioPlay = () => setCancionPrincipalReproduciendo(true);
      const handleAudioPause = () => setCancionPrincipalReproduciendo(false);

      audio.addEventListener('ended', handleAudioEnd);
      audio.addEventListener('play', handleAudioPlay);
      audio.addEventListener('pause', handleAudioPause);

      return () => {
        audio.removeEventListener('ended', handleAudioEnd);
        audio.removeEventListener('play', handleAudioPlay);
        audio.removeEventListener('pause', handleAudioPause);
      };
    }
  }, []);

  useEffect(() => {
    const extra = audioExtraRef.current;

    if (extra) {
      const handleExtraEnd = () => {
        setExtraReproduciendo(false);
        const principal = audioRef.current;
        if (principal && abierta) {
          principal.play()
            .then(() => setCancionPrincipalReproduciendo(true))
            .catch(console.error);
        }
      };

      extra.addEventListener('ended', handleExtraEnd);

      return () => {
        extra.removeEventListener('ended', handleExtraEnd);
      };
    }
  }, [abierta]);

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
      dentroCollage = x >= rectCollage.left && x <= rectCollage.right && y >= rectCollage.top && y <= rectCollage.bottom;
    }

    if (modalImagen) {
      const rectModal = modalImagen.getBoundingClientRect();
      dentroModal = x >= rectModal.left && x <= rectModal.right && y >= rectModal.top && y <= rectModal.bottom;
    }

    if (!dentroCollage && !dentroModal) {
      cerrarImagen();
    }
  };

  return (
    <>
      {/* Audios SIEMPRE montados, para que los refs NO sean null */}
      <audio
        ref={audioRef}
        src={cancion}
        preload="auto"
        playsInline
      />
      <audio
        ref={audioExtraRef}
        src={audioExtra}
        preload="auto"
        playsInline
      />

      {!abierta ? (
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={cartaAnimada}
            alt="Carta animada"
            style={{
              width: "300px",
              height: "auto",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
              marginBottom: "2rem",
              zIndex: 1,
            }}
            draggable={false}
          />
          <button
            onClick={abrirCarta}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.5rem",
              cursor: "pointer",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              transition: "background-color 0.3s ease",
              zIndex: 2,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
          >
            Abrir Carta
          </button>
        </div>
      ) : (
        <div className="fondo" onMouseMove={handleFondoMouseMove}>
          <CollageSuperior
            imagenAmpliada={imagenAmpliada}
            abrirImagen={abrirImagen}
            cerrarImagen={cerrarImagen}
          />

          <div className="contenedor-carta">
            <Carta />
          </div>

          <div className="boton-extra-audio" style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={toggleAudioExtra}>
              {extraReproduciendo ? "⏸ Pausar Audio Extra" : "🎵 Escuchar al Final"}
            </button>

            <div style={{ marginTop: 10, fontSize: "0.8rem", color: "#666" }}>
              Canción principal: {cancionPrincipalReproduciendo ? "🎵 Reproduciendo" : "⏸ Pausada"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
