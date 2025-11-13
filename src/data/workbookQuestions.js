export const workbookQuestions = {
  emotionen: {
    title: "Emotionen verstehen",
    icon: "heart",
    color: "#E8A5A5",
    questions: [
      {
        id: "em1",
        question: "Welche Emotion spürst du gerade am stärksten?",
        placeholder: "Beschreibe, was du fühlst..."
      },
      {
        id: "em2", 
        question: "Wo in deinem Körper spürst du diese Emotion?",
        placeholder: "Brust, Bauch, Kopf, Schultern..."
      },
      {
        id: "em3",
        question: "Was könnte der Auslöser für dieses Gefühl gewesen sein?",
        placeholder: "Denke an die letzten Stunden zurück..."
      },
      {
        id: "em4",
        question: "Was würde diese Emotion dir gerne mitteilen?",
        placeholder: "Jede Emotion hat eine Botschaft..."
      },
      {
        id: "em5",
        question: "Wie kannst du liebevoll mit diesem Gefühl umgehen?",
        placeholder: "Was brauchst du gerade?"
      }
    ]
  },
  innereRuhe: {
    title: "Innere Ruhe finden",
    icon: "leaf",
    color: "#A8C09A",
    questions: [
      {
        id: "ir1",
        question: "Was bringt dich normalerweise zur Ruhe?",
        placeholder: "Aktivitäten, Orte, Menschen..."
      },
      {
        id: "ir2",
        question: "Welche Gedanken rauben dir gerade den Frieden?",
        placeholder: "Sei ehrlich zu dir selbst..."
      },
      {
        id: "ir3",
        question: "Wie fühlt sich innere Ruhe für dich an?",
        placeholder: "Beschreibe das Gefühl..."
      },
      {
        id: "ir4",
        question: "Was hindert dich daran, öfter zur Ruhe zu kommen?",
        placeholder: "Äußere oder innere Hindernisse..."
      },
      {
        id: "ir5",
        question: "Welche kleine Veränderung könnte mehr Ruhe in deinen Alltag bringen?",
        placeholder: "Denke an realistische Schritte..."
      }
    ]
  },
  selbstbild: {
    title: "Selbstbild reflektieren",
    icon: "mirror",
    color: "#B8A9D9",
    questions: [
      {
        id: "sb1",
        question: "Wie würdest du dich selbst jemandem beschreiben, der dich nicht kennt?",
        placeholder: "Stelle dir vor, du beschreibst dich einem Fremden..."
      },
      {
        id: "sb2",
        question: "Was schätzt du an dir selbst - ehrlich?",
        placeholder: "Deine Stärken, Eigenschaften, Fähigkeiten..."
      },
      {
        id: "sb3",
        question: "Welche kritische Stimme in dir ist am lautesten?",
        placeholder: "Was sagt dein innerer Kritiker?"
      },
      {
        id: "sb4",
        question: "Wie sprichst du mit dir selbst, wenn du Fehler machst?",
        placeholder: "Beobachte deinen inneren Dialog..."
      },
      {
        id: "sb5",
        question: "Was würdest du an deinem Selbstbild gerne verändern?",
        placeholder: "Welche Sichtweise auf dich selbst?"
      }
    ]
  },
  beziehungen: {
    title: "Beziehungen verstehen",
    icon: "people",
    color: "#F4D03F",
    questions: [
      {
        id: "bz1",
        question: "Welche Beziehung in deinem Leben ist dir gerade am wichtigsten?",
        placeholder: "Familie, Freunde, Partner..."
      },
      {
        id: "bz2",
        question: "Wo fühlst du dich in Beziehungen manchmal unverstanden?",
        placeholder: "Beschreibe die Situation..."
      },
      {
        id: "bz3",
        question: "Was gibst du gerne in Beziehungen und was brauchst du?",
        placeholder: "Geben und Nehmen..."
      },
      {
        id: "bz4",
        question: "Welche Grenzen fällt es dir schwer zu setzen?",
        placeholder: "Bei welchen Menschen oder Situationen?"
      },
      {
        id: "bz5",
        question: "Wie zeigst du anderen Menschen, dass sie dir wichtig sind?",
        placeholder: "Deine Art der Zuneigung..."
      }
    ]
  }
};

export const getWorkbookSection = (sectionKey) => {
  return workbookQuestions[sectionKey];
};

export const getAllWorkbookSections = () => {
  return Object.keys(workbookQuestions).map(key => ({
    key,
    ...workbookQuestions[key]
  }));
};
