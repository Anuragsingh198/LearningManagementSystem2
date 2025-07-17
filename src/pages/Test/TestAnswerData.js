export const testAnswerData = {
  totalQuestions: 5,
  answered: 4,
  unanswered: 1,
   title: "Introduction to POSH",
  description: "Assessment on Introduction to POSH",
  correct: 3,
  completedIn: 1800,
  wrong: 1,
  passed: true, // >= 60% = pass
  questions: [
    {
      questionId: "q1",
      type: "mcq",
      questionText: "Which of the following is not considered sexual harassment?",
      options: [
        { _id: "o1", optionText: "Repeatedly sending inappropriate messages after being told no" },
        { _id: "o2", optionText: "Asking a colleague out for dinner once" },
        { _id: "o3", optionText: "Sending emails with sexual overtones" },
        { _id: "o4", optionText: "Ignoring a clear rejection and continuing advances" }
      ],
      yourAnswer: "o1",
      correctAnswer: "o2",
      correct: false
    },
    {
      questionId: "q2",
      type: "mcq",
      questionText: "What does POSH stand for?",
      options: [
        { _id: "o5", optionText: "Prevention of Sexual Harassment" },
        { _id: "o6", optionText: "Policy on Sexual Harassment" },
        { _id: "o7", optionText: "Protection of Sexual Harassment" },
        { _id: "o8", optionText: "Prevention of Social Harassment" }
      ],
      yourAnswer: "o5",
      correctAnswer: "o5",
      correct: true
    },
    {
      questionId: "q3",
      type: "mcq",
      questionText: "Which act governs POSH in India?",
      options: [
        { _id: "o9", optionText: "The Sexual Harassment of Women at Workplace Act 2013" },
        { _id: "o10", optionText: "The Women Protection Act 2012" },
        { _id: "o11", optionText: "The Gender Equality Act 2014" },
        { _id: "o12", optionText: "The Workplace Safety Act 2011" }
      ],
      yourAnswer: "o9",
      correctAnswer: "o9",
      correct: true
    },
    {
      questionId: "q4",
      type: "coding",
      questionText: "Write a function that returns the number of vowels in a string.",
      yourAnswer: "function countVowels(str) { return str.match(/[aeiou]/gi).length; }",
      correctAnswer: "Function passes all test cases",
      correct: true
    },
    {
      questionId: "q17",
      type: "mcq",
      questionText: "Which act governs POSH in India?",
      options: [
        { _id: "o9", optionText: "The Sexual Harassment of Women at Workplace Act 2013" },
        { _id: "o10", optionText: "The Women Protection Act 2012" },
        { _id: "o11", optionText: "The Gender Equality Act 2014" },
        { _id: "o12", optionText: "The Workplace Safety Act 2011" }
      ],
      yourAnswer: null,
      correctAnswer: "o9",
      correct: false
    }
  ]
};
