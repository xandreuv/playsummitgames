document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");
  const currentAltitude = document.querySelector(".altitude-current-value");
  const rulerFill = document.querySelector(".ruler-fill");
  const compassNeedleWrap = document.getElementById("compassNeedleWrap");

  function updateActiveStop() {
    if (!sections.length || !stops.length) return;

    let activeId = sections[0].id;
    let activeIndex = 0;
    let activeMeter = "ALT 0 m";
    let activeBearing = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.42) {
        activeId = section.id;
        activeIndex = index;
      }
    });

    stops.forEach((stop) => {
      const isActive = stop.dataset.target === activeId;
      stop.classList.toggle("active", isActive);

      if (isActive) {
        const meterEl = stop.querySelector(".altitude-stop-meter");
        if (meterEl) {
          const rawValue = meterEl.textContent.trim();
          activeMeter = `ALT ${rawValue}`;
        }

        const bearing = parseFloat(stop.dataset.bearing || "0");
        activeBearing = Number.isFinite(bearing) ? bearing : 0;
      }
    });

    if (currentAltitude) {
      currentAltitude.textContent = activeMeter;
    }

    if (rulerFill) {
      const totalSections = Math.max(sections.length - 1, 1);
      const progressRatio = activeIndex / totalSections;
      const maxFillHeight = 248;
      const minFillHeight = 14;
      const fillHeight = minFillHeight + (maxFillHeight - minFillHeight) * progressRatio;
      rulerFill.style.height = `${fillHeight}px`;
    }

    if (compassNeedleWrap) {
      compassNeedleWrap.style.transform = `rotate(${activeBearing}deg)`;
    }
  }

  const translations = {
    index: {
      es: {
        title: "Play Summit Games | Juegos diseñados en los Pirineos",
        description:
          "Summit Series: juegos de cartas inspirados en la alta montaña. Descubre Objetivo Monte Perdido 3.355 m y Objectiu Pedraforca 2.506 m.",
        strings: {
          "brand.subtitle": "Juegos diseñados en los Pirineos",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inicio",
          "nav.games": "Juegos",
          "nav.series": "Summit Series",
          "nav.how": "Cómo se juega",
          "nav.buy": "Compra",

          "hero.kicker": "Fondo del valle · 0 m",
          "hero.title": "Summit Series",
          "hero.lead": "Juegos de cartas inspirados en la alta montaña.",
          "hero.p1":
            "Una colección creada para vivir la tensión, la estrategia, el clima variable y la emoción de una ascensión real.",
          "hero.p2":
            "Cada partida combina progresión en altitud, toma de decisiones, gestión del riesgo, energía, meteorología y espíritu de expedición, con una ambientación basada en montañas y territorios reales.",
          "hero.cta1": "Descubrir juegos",
          "hero.cta2": "Ver reglas básicas",
          "hero.panel.title": "Una colección para ascender jugando",
          "hero.panel.li1": "Inspirada en la experiencia real de la montaña",
          "hero.panel.li2": "Ediciones temáticas con identidad territorial propia",
          "hero.panel.li3": "Modos competitivo, cooperativo y solitario",
          "hero.panel.li4": "Escalable en complejidad y profundidad de partida",

          "products.kicker": "Campamento base · 1.450 m",
          "products.title": "Dos primeras ascensiones de la colección",
          "products.intro":
            "Summit Series arranca con dos juegos ambientados en dos grandes montañas del Pirineo: Monte Perdido y Pedraforca.",

          "products.mp.subtitle": "Ambientación específica Monte Perdido",
          "products.mp.li1": "Jugadores: 1–4",
          "products.mp.li2": "Duración: 20–40 minutos",
          "products.mp.li3": "Modos: competitivo, cooperativo y solitario",
          "products.mp.li4": "Mecánicas: gestión de mano y colección de mazo",
          "products.mp.text":
            "Una ascensión lúdica al Monte Perdido con clima, energía, eventos, decisiones tácticas y sensación de expedición.",
          "products.mp.cta": "Ver landing del juego",

          "products.pf.subtitle": "Ambientación específica Pedraforca",
          "products.pf.li1": "Jugadores: 1–4",
          "products.pf.li2": "Duración: 20–40 minutos",
          "products.pf.li3": "Modos: competitivo, cooperativo y solitario",
          "products.pf.li4": "Mecánicas: gestión de mano y colección de mazo",
          "products.pf.text":
            "Un juego de ascensión inspirado en la montaña más emblemática de Catalunya, con identidad territorial, cultura excursionista y emoción de cima.",
          "products.pf.cta": "Ver landing del juego",

          "features.kicker": "Primera cordada · 1.850 m",
          "features.title": "Características comunes de Summit Series",
          "features.c1.title": "Gestión de energía",
          "features.c1.text":
            "Subir no es suficiente: hay que dosificar el esfuerzo y saber cuándo reservar fuerzas.",
          "features.c2.title": "Clima cambiante",
          "features.c2.text":
            "La meteorología modifica el ritmo de partida y obliga a adaptarse en cada ascensión.",
          "features.c3.title": "Altitud progresiva",
          "features.c3.text":
            "El avance hacia la cima se vive por cotas, con sensación real de aproximación a la cumbre.",
          "features.c4.title": "Sensación de expedición",
          "features.c4.text":
            "El juego transmite progresión, tensión, prudencia, desgaste y momentos clave de ataque.",
          "features.c5.title": "Riesgo y protección",
          "features.c5.text":
            "Clima, eventos y decisiones exigen prepararse bien y protegerse en el momento adecuado.",
          "features.c6.title": "Rejugabilidad",
          "features.c6.text":
            "La variabilidad de cartas, modos y decisiones hace que cada partida tenga un recorrido distinto.",

          "modes.kicker": "Refugio guardado · 2.200 m",
          "modes.title": "Estilos de ascensión y modos de juego",
          "modes.intro":
            "Summit Series puede jugarse con distintos estilos de partida según el modo elegido y el nivel de complejidad que se quiera añadir mediante reglas y componentes.",
          "modes.comp.title": "Modo competitivo",
          "modes.comp.c1.title": "Sprint running",
          "modes.comp.c1.text":
            "Partida rápida, directa y más ligera, centrada en la velocidad de ascensión.",
          "modes.comp.c2.title": "Cross running",
          "modes.comp.c2.text":
            "Mayor interacción, más decisiones tácticas y equilibrio entre ritmo y gestión.",
          "modes.comp.c3.title": "Sky running",
          "modes.comp.c3.text":
            "Versión más completa y exigente, con más tensión, riesgo y profundidad de juego.",
          "modes.coop.title": "Modo cooperativo",
          "modes.coop.c1.title": "Solo",
          "modes.coop.c1.text":
            "Experiencia individual para superar la montaña y optimizar tu propia ascensión.",
          "modes.coop.c2.title": "Estilo Alpino",
          "modes.coop.c2.text":
            "Cooperativo ágil, con pocos apoyos y fuerte gestión de recursos y decisiones clave.",
          "modes.coop.c3.title": "Estilo Clásico",
          "modes.coop.c3.text":
            "Cooperativo más completo, con más herramientas, reglas y construcción de expedición.",

          "values.kicker": "Zona técnica · 2.506 m",
          "values.title": "Puntos fuertes de cada juego Summit Series",
          "values.c1.title": "Identidad territorial",
          "values.c1.text":
            "Las cartas y la ambientación conectan con paisajes, refugios, fuentes y elementos reconocibles de cada montaña y su territorio.",
          "values.c2.title": "Sensibilización ambiental",
          "values.c2.text":
            "La fauna, la flora y el clima variable ayudan a acercar al jugador a la realidad natural de cada entorno.",
          "values.c3.title": "Difusión de buenas prácticas en la montaña",
          "values.c3.text":
            "Prevención, preparación, conocimiento del clima, elección de material, adecuación de la ruta a las capacidades técnicas, gestión de energía y observación del medio.",
          "values.c4.title": "Transmisión de valores",
          "values.c4.text":
            "Cooperación, ética en la montaña, compartir, esperar, apoyar, aconsejar y tomar decisiones responsables.",
          "values.c5.title": "Divulgación del patrimonio cultural",
          "values.c5.text":
            "Cada juego puede vehicular relatos, referencias, cultura excursionista y memoria de las montañas representadas.",

          "rules.kicker": "Ataque a la cima · 3.000 m",
          "rules.title": "Información básica de las reglas del juego",
          "rules.c1.title": "Objetivo",
          "rules.c1.text":
            "Alcanzar la cima antes que los demás, o lograrla juntos en el modo cooperativo.",
          "rules.c2.title": "Tu mano de cartas",
          "rules.c2.text":
            "Gestionas cartas de avance, clima, equipo, protección, eventos y otros apoyos de ascensión.",
          "rules.c3.title": "Energía y progreso",
          "rules.c3.text":
            "Avanzar consume recursos, exige cálculo y obliga a decidir cuándo arriesgar y cuándo resistir.",
          "rules.c4.title": "Clima y montaña",
          "rules.c4.text":
            "El tiempo puede frenar, complicar o transformar la estrategia de una ronda a otra.",
          "rules.c5.title": "Distintos estilos de partida",
          "rules.c5.text":
            "La experiencia cambia según el modo elegido y el nivel de complejidad añadido.",
          "rules.c6.title": "Sensación real de ascensión",
          "rules.c6.text":
            "La partida reproduce la tensión de planificar, progresar y atacar la cima en el momento oportuno.",

          "buy.kicker": "Cima · 3.355 m",
          "buy.title": "Dos cimas, dos experiencias de juego",
          "buy.intro":
            "Descubre la primera cordada de Summit Series y elige tu montaña.",
          "buy.mp.alt": "Objetivo Monte Perdido 3.355",
          "buy.mp.title": "Ascensión a una gran cumbre pirenaica",
          "buy.mp.text":
            "Una experiencia de montaña con energía, clima y gestión táctica en torno al macizo de Monte Perdido.",
          "buy.mp.cta": "Ver juego",
          "buy.pf.alt": "Objectiu Pedraforca 2.506",
          "buy.pf.title": "La montaña más emblemática de Catalunya",
          "buy.pf.text":
            "Una edición con fuerte identidad territorial, cultural y excursionista inspirada en el Pedraforca.",
          "buy.pf.cta": "Ver juego",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correo electrónico"
        }
      },
      cat: {
        title: "Play Summit Games | Jocs dissenyats als Pirineus",
        description:
          "Summit Series: jocs de cartes inspirats en l'alta muntanya. Descobreix Objetivo Monte Perdido 3.355 m i Objectiu Pedraforca 2.506 m.",
        strings: {
          "brand.subtitle": "Jocs dissenyats als Pirineus",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inici",
          "nav.games": "Jocs",
          "nav.series": "Summit Series",
          "nav.how": "Com es juga",
          "nav.buy": "Compra",

          "hero.kicker": "Fons de la vall · 0 m",
          "hero.title": "Summit Series",
          "hero.lead": "Jocs de cartes inspirats en l'alta muntanya.",
          "hero.p1":
            "Una col·lecció creada per viure la tensió, l'estratègia, el clima variable i l'emoció d'una ascensió real.",
          "hero.p2":
            "Cada partida combina progressió en altitud, presa de decisions, gestió del risc, energia, meteorologia i esperit d'expedició, amb una ambientació basada en muntanyes i territoris reals.",
          "hero.cta1": "Descobrir jocs",
          "hero.cta2": "Veure regles bàsiques",
          "hero.panel.title": "Una col·lecció per ascendir jugant",
          "hero.panel.li1": "Inspirada en l'experiència real de la muntanya",
          "hero.panel.li2": "Edicions temàtiques amb identitat territorial pròpia",
          "hero.panel.li3": "Modes competitiu, cooperatiu i solitari",
          "hero.panel.li4": "Escalable en complexitat i profunditat de partida",

          "products.kicker": "Campament base · 1.450 m",
          "products.title": "Dues primeres ascensions de la col·lecció",
          "products.intro":
            "Summit Series arrenca amb dos jocs ambientats en dues grans muntanyes del Pirineu: Monte Perdido i Pedraforca.",

          "products.mp.subtitle": "Ambientació específica Monte Perdido",
          "products.mp.li1": "Jugadors: 1–4",
          "products.mp.li2": "Durada: 20–40 minuts",
          "products.mp.li3": "Modes: competitiu, cooperatiu i solitari",
          "products.mp.li4": "Mecàniques: gestió de mà i construcció de mazo",
          "products.mp.text":
            "Una ascensió lúdica al Monte Perdido amb clima, energia, esdeveniments, decisions tàctiques i sensació d'expedició.",
          "products.mp.cta": "Veure landing del joc",

          "products.pf.subtitle": "Ambientació específica Pedraforca",
          "products.pf.li1": "Jugadors: 1–4",
          "products.pf.li2": "Durada: 20–40 minuts",
          "products.pf.li3": "Modes: competitiu, cooperatiu i solitari",
          "products.pf.li4": "Mecàniques: gestió de mà i construcció de mazo",
          "products.pf.text":
            "Un joc d'ascensió inspirat en la muntanya més emblemàtica de Catalunya, amb identitat territorial, cultura excursionista i emoció de cim.",
          "products.pf.cta": "Veure landing del joc",

          "features.kicker": "Primera cordada · 1.850 m",
          "features.title": "Característiques comunes de Summit Series",
          "features.c1.title": "Gestió d'energia",
          "features.c1.text":
            "Pujar no és suficient: cal dosificar l'esforç i saber quan reservar forces.",
          "features.c2.title": "Clima canviant",
          "features.c2.text":
            "La meteorologia modifica el ritme de la partida i obliga a adaptar-se en cada ascensió.",
          "features.c3.title": "Altitud progressiva",
          "features.c3.text":
            "L'avanç cap al cim es viu per cotes, amb sensació real d'aproximació a la cinglera final.",
          "features.c4.title": "Sensació d'expedició",
          "features.c4.text":
            "El joc transmet progressió, tensió, prudència, desgast i moments clau d'atac.",
          "features.c5.title": "Risc i protecció",
          "features.c5.text":
            "Clima, esdeveniments i decisions exigeixen preparar-se bé i protegir-se en el moment adequat.",
          "features.c6.title": "Rejugabilitat",
          "features.c6.text":
            "La variabilitat de cartes, modes i decisions fa que cada partida tingui un recorregut diferent.",

          "modes.kicker": "Refugi guardat · 2.200 m",
          "modes.title": "Estils d'ascensió i modes de joc",
          "modes.intro":
            "Summit Series es pot jugar amb diferents estils de partida segons el mode escollit i el nivell de complexitat que es vulgui afegir mitjançant regles i components.",
          "modes.comp.title": "Mode competitiu",
          "modes.comp.c1.title": "Sprint running",
          "modes.comp.c1.text":
            "Partida ràpida, directa i més lleugera, centrada en la velocitat d'ascensió.",
          "modes.comp.c2.title": "Cross running",
          "modes.comp.c2.text":
            "Més interacció, més decisions tàctiques i equilibri entre ritme i gestió.",
          "modes.comp.c3.title": "Sky running",
          "modes.comp.c3.text":
            "Versió més completa i exigent, amb més tensió, risc i profunditat de joc.",
          "modes.coop.title": "Mode cooperatiu",
          "modes.coop.c1.title": "Solo",
          "modes.coop.c1.text":
            "Experiència individual per superar la muntanya i optimitzar la teva pròpia ascensió.",
          "modes.coop.c2.title": "Estil Alpí",
          "modes.coop.c2.text":
            "Cooperatiu àgil, amb pocs suports i forta gestió de recursos i decisions clau.",
          "modes.coop.c3.title": "Estil Clàssic",
          "modes.coop.c3.text":
            "Cooperatiu més complet, amb més eines, regles i construcció d'expedició.",

          "values.kicker": "Zona tècnica · 2.506 m",
          "values.title": "Punts forts de cada joc Summit Series",
          "values.c1.title": "Identitat territorial",
          "values.c1.text":
            "Les cartes i l'ambientació connecten amb paisatges, refugis, fonts i elements recognoscibles de cada muntanya i el seu territori.",
          "values.c2.title": "Sensibilització ambiental",
          "values.c2.text":
            "La fauna, la flora i el clima variable ajuden a apropar el jugador a la realitat natural de cada entorn.",
          "values.c3.title": "Difusió de bones pràctiques a la muntanya",
          "values.c3.text":
            "Prevenció, preparació, coneixement del clima, elecció de material, adequació de la ruta a les capacitats tècniques, gestió de l'energia i observació del medi.",
          "values.c4.title": "Transmissió de valors",
          "values.c4.text":
            "Cooperació, ètica a la muntanya, compartir, esperar, donar suport, aconsellar i prendre decisions responsables.",
          "values.c5.title": "Divulgació del patrimoni cultural",
          "values.c5.text":
            "Cada joc pot vehicular relats, referències, cultura excursionista i memòria de les muntanyes representades.",

          "rules.kicker": "Atac al cim · 3.000 m",
          "rules.title": "Informació bàsica de les regles del joc",
          "rules.c1.title": "Objectiu",
          "rules.c1.text":
            "Assolir el cim abans que la resta, o aconseguir-lo plegats en el mode cooperatiu.",
          "rules.c2.title": "La teva mà de cartes",
          "rules.c2.text":
            "Gestiones cartes d'avanç, clima, equip, protecció, esdeveniments i altres suports d'ascensió.",
          "rules.c3.title": "Energia i progrés",
          "rules.c3.text":
            "Avançar consumeix recursos, exigeix càlcul i obliga a decidir quan arriscar i quan resistir.",
          "rules.c4.title": "Clima i muntanya",
          "rules.c4.text":
            "El temps pot frenar, complicar o transformar l'estratègia d'una ronda a l'altra.",
          "rules.c5.title": "Diferents estils de partida",
          "rules.c5.text":
            "L'experiència canvia segons el mode escollit i el nivell de complexitat afegit.",
          "rules.c6.title": "Sensació real d'ascensió",
          "rules.c6.text":
            "La partida reprodueix la tensió de planificar, progressar i atacar el cim en el moment oportú.",

          "buy.kicker": "Cim · 3.355 m",
          "buy.title": "Dos cims, dues experiències de joc",
          "buy.intro":
            "Descobreix la primera cordada de Summit Series i tria la teva muntanya.",
          "buy.mp.alt": "Objetivo Monte Perdido 3.355",
          "buy.mp.title": "Ascensió a un gran cim pirinenc",
          "buy.mp.text":
            "Una experiència de muntanya amb energia, clima i gestió tàctica al voltant del massís de Monte Perdido.",
          "buy.mp.cta": "Veure joc",
          "buy.pf.alt": "Objectiu Pedraforca 2.506",
          "buy.pf.title": "La muntanya més emblemàtica de Catalunya",
          "buy.pf.text":
            "Una edició amb forta identitat territorial, cultural i excursionista inspirada en el Pedraforca.",
          "buy.pf.cta": "Veure joc",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correu electrònic"
        }
      }
    },

    monte: {
      es: {
        title: "Objetivo Monte Perdido 3.355 | Play Summit Games",
        description:
          "Landing page de Objetivo Monte Perdido 3.355, juego de cartas de Summit Series.",
        strings: {
          "brand.subtitle": "Juegos diseñados en los Pirineos",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inicio",
          "nav.game": "El juego",
          "nav.territory": "Territorio",
          "nav.rules": "Reglas",
          "nav.summit": "Cima",

          "hero.back": "← Volver a Play Summit Games",
          "hero.kicker": "Fondo del valle · 0 m",
          "hero.title": "Objetivo Monte Perdido 3.355",
          "hero.lead": "Una ascensión lúdica a una de las grandes cumbres del Pirineo.",
          "hero.p1":
            "Gestión de energía, clima cambiante, progresión en altitud, riesgo, protección y tensión estratégica en una experiencia de montaña inspirada en el Monte Perdido.",
          "hero.cta1": "Descubrir el juego",
          "hero.cta2": "Volver a la colección",
          "hero.panel.title": "Datos básicos",
          "hero.panel.li1": "1–4 jugadores",
          "hero.panel.li2": "20–40 minutos",
          "hero.panel.li3": "Modo competitivo, cooperativo y solitario",
          "hero.panel.li4": "Gestión de mano y colección de mazo",

          "game.kicker": "Campamento base · 1.450 m",
          "game.title": "Una montaña real convertida en experiencia de juego",
          "game.text":
            "Objetivo Monte Perdido traslada a la mesa la emoción de una ascensión: avanzar, dosificar recursos, adaptarse al clima y escoger el momento adecuado para atacar la cima.",

          "exp.kicker": "Primera cordada · 2.200 m",
          "exp.title": "Qué se siente al jugar",
          "exp.c1.title": "Progresión real",
          "exp.c1.text":
            "La partida da sensación de ganar altura y acercarse a la cumbre por fases.",
          "exp.c2.title": "Decisión táctica",
          "exp.c2.text":
            "No siempre conviene avanzar más: a veces lo decisivo es protegerse y esperar.",
          "exp.c3.title": "Expedición",
          "exp.c3.text":
            "La experiencia transmite tensión, esfuerzo y planificación de alta montaña.",

          "territory.kicker": "Zona técnica · 2.800 m",
          "territory.title": "Territorio, paisaje y cultura de montaña",
          "territory.c1.title": "Identidad del macizo",
          "territory.c1.text":
            "El juego puede desarrollarse después con paisajes, refugios y referencias del entorno de Monte Perdido.",
          "territory.c2.title": "Divulgación",
          "territory.c2.text":
            "La temática facilita hablar de buenas prácticas, preparación y respeto por la montaña.",

          "rules.kicker": "Ataque a la cima · 3.000 m",
          "rules.title": "Base preparada para ampliar contenido",
          "rules.text":
            "Esta landing ya queda lista para añadir más adelante capítulos concretos: componentes, cartas, modos de juego, reglas detalladas, imágenes y compra.",

          "summit.kicker": "Cima · 3.355 m",
          "summit.title": "Objetivo Monte Perdido 3.355",
          "summit.text":
            "Estructura visual y técnica ya preparada para seguir desarrollando esta página específica.",
          "summit.cta": "Volver a la landing principal",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correo electrónico"
        }
      },
      cat: {
        title: "Objetivo Monte Perdido 3.355 | Play Summit Games",
        description:
          "Landing page d'Objetivo Monte Perdido 3.355, joc de cartes de Summit Series.",
        strings: {
          "brand.subtitle": "Jocs dissenyats als Pirineus",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inici",
          "nav.game": "El joc",
          "nav.territory": "Territori",
          "nav.rules": "Regles",
          "nav.summit": "Cim",

          "hero.back": "← Tornar a Play Summit Games",
          "hero.kicker": "Fons de la vall · 0 m",
          "hero.title": "Objetivo Monte Perdido 3.355",
          "hero.lead": "Una ascensió lúdica a un dels grans cims del Pirineu.",
          "hero.p1":
            "Gestió d'energia, clima canviant, progressió en altitud, risc, protecció i tensió estratègica en una experiència de muntanya inspirada en el Monte Perdido.",
          "hero.cta1": "Descobrir el joc",
          "hero.cta2": "Tornar a la col·lecció",
          "hero.panel.title": "Dades bàsiques",
          "hero.panel.li1": "1–4 jugadors",
          "hero.panel.li2": "20–40 minuts",
          "hero.panel.li3": "Mode competitiu, cooperatiu i solitari",
          "hero.panel.li4": "Gestió de mà i construcció de mazo",

          "game.kicker": "Campament base · 1.450 m",
          "game.title": "Una muntanya real convertida en experiència de joc",
          "game.text":
            "Objetivo Monte Perdido trasllada a la taula l'emoció d'una ascensió: avançar, dosificar recursos, adaptar-se al clima i escollir el moment adequat per atacar el cim.",

          "exp.kicker": "Primera cordada · 2.200 m",
          "exp.title": "Què se sent quan es juga",
          "exp.c1.title": "Progressió real",
          "exp.c1.text":
            "La partida dona sensació de guanyar altitud i acostar-se al cim per fases.",
          "exp.c2.title": "Decisió tàctica",
          "exp.c2.text":
            "No sempre convé avançar més: de vegades el decisiu és protegir-se i esperar.",
          "exp.c3.title": "Expedició",
          "exp.c3.text":
            "L'experiència transmet tensió, esforç i planificació d'alta muntanya.",

          "territory.kicker": "Zona tècnica · 2.800 m",
          "territory.title": "Territori, paisatge i cultura de muntanya",
          "territory.c1.title": "Identitat del massís",
          "territory.c1.text":
            "El joc es pot desenvolupar després amb paisatges, refugis i referències de l'entorn de Monte Perdido.",
          "territory.c2.title": "Divulgació",
          "territory.c2.text":
            "La temàtica facilita parlar de bones pràctiques, preparació i respecte per la muntanya.",

          "rules.kicker": "Atac al cim · 3.000 m",
          "rules.title": "Base preparada per ampliar contingut",
          "rules.text":
            "Aquesta landing ja queda llesta per afegir més endavant capítols concrets: components, cartes, modes de joc, regles detallades, imatges i compra.",

          "summit.kicker": "Cim · 3.355 m",
          "summit.title": "Objetivo Monte Perdido 3.355",
          "summit.text":
            "Estructura visual i tècnica ja preparada per continuar desenvolupant aquesta pàgina específica.",
          "summit.cta": "Tornar a la landing principal",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correu electrònic"
        }
      }
    },

    pedraforca: {
      es: {
        title: "Objectiu Pedraforca 2.506 | Play Summit Games",
        description:
          "Landing page de Objectiu Pedraforca 2.506, juego de cartas de Summit Series.",
        strings: {
          "brand.subtitle": "Juegos diseñados en los Pirineos",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inicio",
          "nav.game": "El juego",
          "nav.territory": "Territorio",
          "nav.rules": "Reglas",
          "nav.summit": "Cima",

          "hero.back": "← Volver a Play Summit Games",
          "hero.kicker": "Fondo del valle · 0 m",
          "hero.title": "Objectiu Pedraforca 2.506",
          "hero.lead":
            "Una ascensión lúdica inspirada en la montaña más emblemática de Catalunya.",
          "hero.p1":
            "Un juego de cartas de Summit Series con gestión de energía, clima cambiante, progresión en altitud, identidad territorial y cultura excursionista.",
          "hero.cta1": "Descubrir el juego",
          "hero.cta2": "Volver a la colección",
          "hero.panel.title": "Datos básicos",
          "hero.panel.li1": "1–4 jugadores",
          "hero.panel.li2": "20–40 minutos",
          "hero.panel.li3": "Modo competitivo, cooperativo y solitario",
          "hero.panel.li4": "Gestión de mano y colección de mazo",

          "game.kicker": "Campamento base · 1.450 m",
          "game.title": "Pedraforca convertido en experiencia de juego",
          "game.text":
            "Objectiu Pedraforca traslada a la mesa la emoción de una ascensión emblemática, combinando estrategia, tensión de montaña y fuerte conexión con el territorio.",

          "territory.kicker": "Primera cordada · 1.850 m",
          "territory.title": "Territorio e identidad",
          "territory.c1.title": "Montaña icónica",
          "territory.c1.text":
            "El Pedraforca aporta una fuerza visual y simbólica excepcional dentro del juego.",
          "territory.c2.title": "Cultura excursionista",
          "territory.c2.text":
            "La propuesta conecta con valores y memoria de la montaña catalana.",
          "territory.c3.title": "Experiencia compartida",
          "territory.c3.text":
            "Favorece conversaciones, recuerdos y vivencias ligadas a la excursión y la cima.",

          "culture.kicker": "Refugio guardado · 2.200 m",
          "culture.title": "Divulgación y valores",
          "culture.c1.title": "Buenas prácticas",
          "culture.c1.text":
            "El juego permite introducir ideas de prevención, preparación y respeto por la montaña.",
          "culture.c2.title": "Patrimonio cultural",
          "culture.c2.text":
            "La temática facilita incorporar paisaje, historia, referencias locales y valor territorial.",

          "rules.kicker": "Zona técnica · 2.450 m",
          "rules.title": "Base preparada para ampliar contenido",
          "rules.text":
            "Esta landing ya queda lista para añadir después cartas, componentes, reglas detalladas, imágenes, apoyos y llamada a compra.",

          "summit.kicker": "Cima · 2.506 m",
          "summit.title": "Objectiu Pedraforca 2.506",
          "summit.text":
            "Estructura visual y técnica ya preparada para seguir desarrollando esta página específica.",
          "summit.cta": "Volver a la landing principal",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correo electrónico"
        }
      },
      cat: {
        title: "Objectiu Pedraforca 2.506 | Play Summit Games",
        description:
          "Landing page d'Objectiu Pedraforca 2.506, joc de cartes de Summit Series.",
        strings: {
          "brand.subtitle": "Jocs dissenyats als Pirineus",
          "lang.es": "ES",
          "lang.cat": "CAT",
          "nav.home": "Inici",
          "nav.game": "El joc",
          "nav.territory": "Territori",
          "nav.rules": "Regles",
          "nav.summit": "Cim",

          "hero.back": "← Tornar a Play Summit Games",
          "hero.kicker": "Fons de la vall · 0 m",
          "hero.title": "Objectiu Pedraforca 2.506",
          "hero.lead":
            "Una ascensió lúdica inspirada en la muntanya més emblemàtica de Catalunya.",
          "hero.p1":
            "Un joc de cartes de Summit Series amb gestió d'energia, clima canviant, progressió en altitud, identitat territorial i cultura excursionista.",
          "hero.cta1": "Descobrir el joc",
          "hero.cta2": "Tornar a la col·lecció",
          "hero.panel.title": "Dades bàsiques",
          "hero.panel.li1": "1–4 jugadors",
          "hero.panel.li2": "20–40 minuts",
          "hero.panel.li3": "Mode competitiu, cooperatiu i solitari",
          "hero.panel.li4": "Gestió de mà i construcció de mazo",

          "game.kicker": "Campament base · 1.450 m",
          "game.title": "Pedraforca convertit en experiència de joc",
          "game.text":
            "Objectiu Pedraforca trasllada a la taula l'emoció d'una ascensió emblemàtica, combinant estratègia, tensió de muntanya i una forta connexió amb el territori.",

          "territory.kicker": "Primera cordada · 1.850 m",
          "territory.title": "Territori i identitat",
          "territory.c1.title": "Muntanya icònica",
          "territory.c1.text":
            "El Pedraforca aporta una força visual i simbòlica excepcional dins del joc.",
          "territory.c2.title": "Cultura excursionista",
          "territory.c2.text":
            "La proposta connecta amb valors i memòria de la muntanya catalana.",
          "territory.c3.title": "Experiència compartida",
          "territory.c3.text":
            "Afavoreix converses, records i vivències lligades a l'excursió i al cim.",

          "culture.kicker": "Refugi guardat · 2.200 m",
          "culture.title": "Divulgació i valors",
          "culture.c1.title": "Bones pràctiques",
          "culture.c1.text":
            "El joc permet introduir idees de prevenció, preparació i respecte per la muntanya.",
          "culture.c2.title": "Patrimoni cultural",
          "culture.c2.text":
            "La temàtica facilita incorporar paisatge, història, referències locals i valor territorial.",

          "rules.kicker": "Zona tècnica · 2.450 m",
          "rules.title": "Base preparada per ampliar contingut",
          "rules.text":
            "Aquesta landing ja queda llesta per afegir després cartes, components, regles detallades, imatges, suports i crida a compra.",

          "summit.kicker": "Cim · 2.506 m",
          "summit.title": "Objectiu Pedraforca 2.506",
          "summit.text":
            "Estructura visual i tècnica ja preparada per continuar desenvolupant aquesta pàgina específica.",
          "summit.cta": "Tornar a la landing principal",

          "footer.instagram": "@playsummitgames",
          "footer.email": "info@playsummitgames.es",
          "footer.instagram.aria": "Instagram",
          "footer.email.aria": "Correu electrònic"
        }
      }
    }
  };

  const pageKey = document.body.dataset.page;
  const htmlEl = document.documentElement;
  const metaDescription = document.querySelector('meta[name="description"]');
  const switchButtons = document.querySelectorAll(".lang-switch-button");

  function applyTranslations(lang) {
    const pageTranslations = translations[pageKey];
    if (!pageTranslations || !pageTranslations[lang]) return;

    const current = pageTranslations[lang];
    const strings = current.strings || {};

    document.title = current.title;
    if (metaDescription) {
      metaDescription.setAttribute("content", current.description);
    }

    htmlEl.setAttribute("lang", lang === "cat" ? "ca" : "es");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (strings[key] !== undefined) {
        el.textContent = strings[key];
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      if (strings[key] !== undefined) {
        el.setAttribute("aria-label", strings[key]);
      }
    });

    switchButtons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setLanguage(lang) {
    const normalized = lang === "cat" ? "cat" : "es";
    localStorage.setItem("psg-language", normalized);
    applyTranslations(normalized);
  }

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });

  const savedLanguage = localStorage.getItem("psg-language") || "es";
  applyTranslations(savedLanguage);

  updateActiveStop();
  window.addEventListener("scroll", updateActiveStop);
  window.addEventListener("resize", updateActiveStop);
});
