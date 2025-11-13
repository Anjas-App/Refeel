export const affirmations = [
  "Ich bin genug - genau so, wie ich bin",
  "Meine Gefühle sind richtig und wichtig",
  "Ich verdiene Liebe und Mitgefühl - besonders von mir selbst",
  "Jeder Tag ist eine neue Chance, zu wachsen",
  "Ich bin stärker, als ich denke",
  "Meine Gedanken sind nur Gedanken - sie definieren mich nicht",
  "Ich erlaube mir, Fehler zu machen und daraus zu lernen",
  "Ich bin auf meinem eigenen Weg und das ist vollkommen richtig",
  "Meine Intuition führt mich in die richtige Richtung",
  "Ich bin dankbar für alles, was ich bereits erreicht habe",
  "Ich vertraue dem Prozess meines Lebens",
  "Ich bin würdig, glücklich zu sein",
  "Meine Verletzlichkeit ist eine Stärke, keine Schwäche",
  "Ich wähle Selbstmitgefühl statt Selbstkritik",
  "Ich bin genau dort, wo ich sein soll",
  "Meine Gefühle sind temporär - sie werden vorübergehen",
  "Ich habe die Kraft, mein Leben positiv zu gestalten",
  "Ich bin einzigartig und wertvoll",
  "Ich erlaube mir, in meinem eigenen Tempo zu heilen",
  "Ich bin stolz auf meinen Mut, an mir zu arbeiten",
  "Meine Selbstfürsorge ist wichtig und notwendig",
  "Ich verdiene Ruhe und Entspannung",
  "Ich bin offen für neue Möglichkeiten",
  "Meine Vergangenheit definiert nicht meine Zukunft",
  "Ich bin dankbar für meinen Körper und alles, was er für mich tut",
  "Ich wähle Hoffnung über Angst",
  "Ich bin umgeben von Liebe, auch wenn ich sie nicht immer spüre",
  "Meine Träume sind wichtig und erreichbar",
  "Ich erlaube mir, authentisch zu sein",
  "Heute ist ein guter Tag, um freundlich zu mir selbst zu sein"
];

export const getRandomAffirmation = () => {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

export const getDailyAffirmation = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return affirmations[dayOfYear % affirmations.length];
};
