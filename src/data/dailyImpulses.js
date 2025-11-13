export const dailyImpulses = [
  "Was hast du dir heute Gutes getan?",
  "Welche Stimme in dir brauchst du gerade am meisten?",
  "Wofür bist du heute dankbar?",
  "Was würdest du einem guten Freund in deiner Situation raten?",
  "Welches Gefühl möchtest du heute mehr in dein Leben einladen?",
  "Was bedeutet Selbstfürsorge für dich heute?",
  "Welcher Teil von dir braucht gerade besondere Aufmerksamkeit?",
  "Was würde dir helfen, dich heute sicherer zu fühlen?",
  "Welche kleine Veränderung könnte deinen Tag verbessern?",
  "Was hast du heute über dich selbst gelernt?",
  "Welche Eigenschaft an dir schätzt du besonders?",
  "Was brauchst du gerade, um dich geliebt zu fühlen?",
  "Welcher Gedanke beschäftigt dich am meisten heute?",
  "Was würdest du tun, wenn du keine Angst hättest?",
  "Welche Erinnerung bringt dir heute Freude?",
  "Was möchtest du loslassen?",
  "Welche Hoffnung trägst du in dir?",
  "Was macht dich einzigartig?",
  "Welche Unterstützung brauchst du gerade?",
  "Was würde dein weisestes Ich dir heute sagen?",
  "Welche Emotion möchtest du heute vollständig fühlen?",
  "Was bringt dich zur Ruhe?",
  "Welcher Aspekt deines Lebens verdient mehr Aufmerksamkeit?",
  "Was würdest du dir selbst vergeben wollen?",
  "Welche Grenze möchtest du heute setzen?",
  "Was nährt deine Seele?",
  "Welche Geschichte erzählst du dir über dich selbst?",
  "Was brauchst du, um dich heute vollständig zu fühlen?",
  "Welche Kraft in dir ist stärker als deine Angst?",
  "Was möchtest du dir selbst heute versprechen?"
];

export const getRandomImpulse = () => {
  return dailyImpulses[Math.floor(Math.random() * dailyImpulses.length)];
};

export const getDailyImpulse = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return dailyImpulses[dayOfYear % dailyImpulses.length];
};
