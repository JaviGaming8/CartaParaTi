import React, { useEffect, useState, useRef } from "react";

// Se divide el texto largo en un arreglo de párrafos
const textoCarta = [
  "Holaaaa, niña linda. La carta se irá mostrando automáticamente, tal vez vaya rápido o lento, pero puedes deslizar sobre la carta para leerla con calma. Espero que te guste y espero que te acuerdes de mí, porque yo nunca me olvidaré de ti. Eres una persona que me ha marcado mucho y siempre estaré agradecido por todo lo que has hecho.",
  "Te amo mucho, eres la persona más especial en mi vida.",
  "Espero que te guste la canción de fondo.",
  "Lee esta carta con calma y recuerda que siempre estaré aquí para ti.",
  "Quisiera parar el tiempo para que siempre me amaras, abrazarte fuertemente y que de mí nunca te vayas. Quisiera ser la persona que tú siempre echas de menos, compartir malos momentos y disfrutar de los buenos.",
  "Quisiera tener valor para mirarte a los ojos, decirte cuánto te quiero, pero vivo y muero solo. Quisiera ser el pañuelo con el que secas tu llanto, ser motivo de alegría en tus días grises y largos.",
  "Quisiera tener millones y comprarte un palacio, que fueras dueña de todo, de mi tiempo y de mi espacio. Quisiera ser ese hombre que comparte tus tristezas, curarte las heridas con mi amor y no promesas.",
  "Quisiera que tú supieras que siempre cuentas conmigo, pero matas mi ilusión al decirme “buen amigo”. Quisiera ser el poeta que te escribe lindos versos, dedicarte mil poemas llenos de mis sentimientos.",
  "Quisiera poder ver tu cara sin algún temor, enfocar esa linda mirada que me inspira amor. Quisiera poder tocar tu piel y tu cabello, sentirme acompañado y recordar que no es un sueño.",
  "Quisiera ser el hombre que rece por ti en el día, contemplando tu belleza que me produce alegría. Quisiera que todo fuera eternidad en el planeta, vivir todos los recuerdos que se van en línea recta.",
  "Quisiera que todo fuera con aroma a primavera, que el mundo no girara y que el aire se detuviera. Quisiera cambiar el mundo como a ti te guste más, que las cosas sean más bellas y nunca mirar atrás.",
  "Quisiera que nuestra vida fuese en un lindo jardín, y entre rosas y claveles declarar mi amor por ti. Quisiera que comprendieras que por ti lo haría todo: secuestrar alguna estrella o convertir el lodo en oro.",
  "Quisiera volver atrás, todo lo malo arreglar, para volver a soñar con un mejor futuro, sí, con un mejor futuro... un futuro juntos.",
  "Quisiera poder llevarte de la mano todo el tiempo, acompañarte en los senderos en los que te empuja el viento. Quisiera vencer tormentas sabiendo que tú me quieres, decirle a los cuatro vientos que perfecta es lo que eres.",
  "Quisiera que por las noches no tuviera que soñarte, porque mi única ilusión es algún día poder besarte. Quisiera que algún día leyeras esta carta y te des cuenta que te quiero, y tuyo es mi corazón.",
  "Quisiera que me apoyaras cuando necesite ayuda, tenerte siempre a mi lado cuando todo sea penumbra. Quisiera que comprendieras mis deseos e ilusiones, tener cosas en común y no puras complicaciones.",
  "Quisiera ser la frazada que te abriga en el invierno, tras el calor de mi alma que quema como un incendio. Quisiera acompañarte cuando te sientas tan sola, solo te quiero a ti, no puedo querer a otra.",
  "Quisiera verte contenta disfrutando de la vida, levantarte en los tropiezos para que conmigo sigas. Quisiera sentir tus labios y juntarlos con los míos, que toques mi corazón y sintieras mis latidos.",
  "Quisiera deslizarme por las curvas de tu cuerpo, recorriendo tus rincones, saber lo que llevas dentro.",
  "Quisiera que en las mañanas lo primero fueras tú, embriagarme de caricias viendo el brillo de tu luz. Quisiera ser como el mago que te cumple los deseos, darte todo lo que quieres.",
  "¡Gracias por ser parte de mi vida!",
  "Puedes escuchar ya el audio extra y puedes dar click en los collages para ver las imágenes."
];

export default function Carta() {
  const [parrafosMostrados, setParrafosMostrados] = useState([]); // Párrafos terminados
  const [textoActual, setTextoActual] = useState("");              // Animación letra por letra
  const [parrafoIndex, setParrafoIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const contenidoRef = useRef(null);
  const [usuarioScrolleo, setUsuarioScrolleo] = useState(false);

  // Animación letra por letra
  useEffect(() => {
    if (parrafoIndex >= textoCarta.length) return;

    const texto = textoCarta[parrafoIndex];
    if (charIndex < texto.length) {
      const timer = setTimeout(() => {
        setTextoActual((prev) => prev + texto[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 33);
      return () => clearTimeout(timer);
    } else {
      // Cuando termina el párrafo, lo añadimos al array final
      const delay = setTimeout(() => {
        setParrafosMostrados((prev) => [...prev, texto]);
        setTextoActual("");
        setCharIndex(0);
        setParrafoIndex((prev) => prev + 1);
      }, 800); // Espera un poco antes de pasar al siguiente
      return () => clearTimeout(delay);
    }
  }, [charIndex, parrafoIndex]);

  // Scroll automático
  useEffect(() => {
    if (!usuarioScrolleo) {
      const contenedor = contenidoRef.current;
      if (contenedor) {
        contenedor.scrollTop = contenedor.scrollHeight;
      }
    }
  }, [parrafosMostrados, textoActual, usuarioScrolleo]);

  const handleScroll = () => {
    const contenedor = contenidoRef.current;
    if (!contenedor) return;

    const { scrollTop, scrollHeight, clientHeight } = contenedor;
    const distanciaAlFondo = scrollHeight - scrollTop - clientHeight;

    setUsuarioScrolleo(distanciaAlFondo > 20);
  };

  return (
    <div
      className="contenido-carta"
      ref={contenidoRef}
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        maxHeight: "70vh",
        padding: "1rem",
        whiteSpace: "pre-wrap",
      }}
    >
      {parrafosMostrados.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {textoActual && <p>{textoActual}</p>}
    </div>
  );
}
