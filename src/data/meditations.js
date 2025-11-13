export const meditations = {
  beruhigung: [
    {
      id: 1,
      title: "Atemruhe",
      duration: 3,
      category: "beruhigung",
      text: `Setze oder lege dich bequem hin. Schließe sanft deine Augen.

Atme natürlich ein und aus. Spüre, wie sich dein Bauch hebt und senkt.

Zähle beim Einatmen bis vier... eins, zwei, drei, vier.
Halte den Atem für zwei Sekunden... eins, zwei.
Atme aus und zähle bis sechs... eins, zwei, drei, vier, fünf, sechs.

Wiederhole diesen Rhythmus. Mit jedem Atemzug wirst du ruhiger.

Wenn Gedanken kommen, lass sie wie Wolken vorbeiziehen.
Kehre sanft zu deinem Atem zurück.

Du bist sicher. Du bist ruhig. Du bist genau richtig, so wie du bist.

Atme noch dreimal tief ein und aus.
Öffne langsam deine Augen und kehre in den Moment zurück.`
    },
    {
      id: 2,
      title: "Körperreise",
      duration: 5,
      category: "beruhigung",
      text: `Mache es dir bequem und schließe deine Augen.

Beginne bei deinen Füßen. Spüre deine Zehen, deine Fußsohlen.
Lass alle Anspannung los und erlaube deinen Füßen, schwer zu werden.

Wandere zu deinen Waden, deinen Knien, deinen Oberschenkeln.
Mit jedem Atemzug entspannst du dich mehr.

Spüre dein Becken, deinen unteren Rücken. Lass alles los.

Dein Bauch wird weich, deine Brust öffnet sich.
Deine Schultern sinken nach unten, deine Arme werden schwer.

Entspanne deinen Nacken, dein Gesicht.
Lass deine Stirn glatt werden, deine Augen weich.

Dein ganzer Körper ist nun entspannt und ruhig.
Du bist getragen und sicher.

Genieße diese Ruhe noch einen Moment.
Atme tief ein und kehre langsam zurück.`
    }
  ],
  selbstmitgefuehl: [
    {
      id: 3,
      title: "Liebende Güte",
      duration: 4,
      category: "selbstmitgefuehl",
      text: `Lege eine Hand auf dein Herz. Spüre die Wärme deiner Berührung.

Atme in dein Herz hinein und sage zu dir selbst:
"Möge ich glücklich sein."
"Möge ich gesund sein."
"Möge ich in Frieden leben."
"Möge ich mir selbst vergeben."

Stelle dir vor, wie sich dein Herz mit warmer, goldener Liebe füllt.
Diese Liebe gehört dir. Du verdienst sie.

Denke an einen Menschen, den du liebst.
Sende ihm die gleichen Wünsche:
"Mögest du glücklich sein."
"Mögest du gesund sein."
"Mögest du in Frieden leben."

Erweitere diese Liebe auf alle Wesen.
Wir alle verdienen Mitgefühl und Liebe.

Kehre zu dir zurück. Spüre die Liebe in deinem Herzen.
Sie ist immer da, wann immer du sie brauchst.`
    },
    {
      id: 4,
      title: "Innerer Freund",
      duration: 3,
      category: "selbstmitgefuehl",
      text: `Schließe deine Augen und atme ruhig.

Stelle dir vor, du begegnest dir selbst als Kind.
Sieh dieses Kind mit liebevollen Augen.

Was würdest du diesem Kind sagen?
Welche Worte der Ermutigung würdest du wählen?

Sprich nun diese Worte zu dir selbst:
"Du bist wertvoll."
"Du machst das gut."
"Ich bin stolz auf dich."
"Du bist nicht allein."

Umarme dich selbst, innerlich oder äußerlich.
Spüre die Wärme dieser Selbstumarmung.

Du bist dein eigener bester Freund.
Du verdienst deine eigene Freundlichkeit.

Nimm diese liebevolle Stimme mit in deinen Tag.
Sie ist immer bei dir.`
    }
  ],
  loslassen: [
    {
      id: 5,
      title: "Gedanken wie Blätter",
      duration: 4,
      category: "loslassen",
      text: `Setze dich bequem hin und schließe deine Augen.

Stelle dir einen ruhigen Fluss vor. Du sitzt am Ufer.

Beobachte deine Gedanken. Jeder Gedanke ist wie ein Blatt,
das auf dem Wasser vorbeitreibt.

Da ist ein Sorgen-Blatt... lass es vorbeiziehen.
Ein Ärger-Blatt... auch das darf weiterfließen.
Ein Angst-Blatt... beobachte es liebevoll und lass es los.

Du musst die Blätter nicht festhalten.
Du musst nicht ins Wasser springen und sie verfolgen.

Sitze einfach da und beobachte.
Manche Blätter sind groß, manche klein.
Alle dürfen vorbeiziehen.

Du bist nicht deine Gedanken.
Du bist der ruhige Beobachter am Ufer.

Atme tief ein und spüre diese Ruhe.
Du kannst jederzeit hierher zurückkehren.`
    },
    {
      id: 6,
      title: "Ballons steigen lassen",
      duration: 3,
      category: "loslassen",
      text: `Stehe oder sitze aufrecht. Atme tief ein.

Denke an etwas, was dich belastet.
Einen Schmerz, eine Sorge, eine Enttäuschung.

Stelle dir vor, du hältst einen Ballon in deinen Händen.
In diesem Ballon ist alles, was du loslassen möchtest.

Spüre das Gewicht in deinen Händen.
Du hast es lange getragen.

Nun ist es Zeit loszulassen.
Öffne deine Hände und lass den Ballon steigen.

Sieh zu, wie er höher und höher steigt.
Kleiner und kleiner wird.

Du musst diese Last nicht tragen.
Du darfst sie gehen lassen.

Atme tief ein. Du bist leichter geworden.
Du bist frei.

Wann immer du bereit bist, kannst du weitere Ballons steigen lassen.
Du hast die Kraft loszulassen.`
    }
  ]
};

export const getMeditationsByCategory = (category) => {
  return meditations[category] || [];
};

export const getAllMeditations = () => {
  return Object.values(meditations).flat();
};

export const getMeditationById = (id) => {
  const allMeditations = getAllMeditations();
  return allMeditations.find(meditation => meditation.id === id);
};

// Audio file imports
const Atemruhe = require('./MP3/Atemruhe.mp3');
const Koerperreise = require('./MP3/Körperreise.mp3');
const LiebendeGuete = require('./MP3/Liebende Güte.mp3');
const InnererFreund = require('./MP3/Innerer Freund.mp3');
const GedankenWieBlaetter = require('./MP3/Gedanken wie Blätter.mp3');
const BallonsSteigenLassen = require('./MP3/Ballons steigen lassen.mp3');

export const getMeditationAudio = (title) => {
  switch (title) {
    case "Ballons steigen lassen":
      return BallonsSteigenLassen;
    case "Gedanken wie Blätter":
      return GedankenWieBlaetter;
    case "Innerer Freund":
      return InnererFreund;
    case "Liebende Güte":
      return LiebendeGuete;
    case "Körperreise":
      return Koerperreise;
    case "Atemruhe":
      return Atemruhe;
    default:
      return null;
  }
};
  
