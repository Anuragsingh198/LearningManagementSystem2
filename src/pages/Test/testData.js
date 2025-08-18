export const testData = {
  _id: "686cbf48c811dbae8cf9a387",
  title: "Introduction to POSH",
  description: "Assessment on Introduction to POSH",
  topics: ["POSH", "Ethics", "Manners"],
  questions: [
    {
      _id: "q1",
      questionText: "Which of the following is not considered sexual harassment?",
      type: "mcq",
      options: [
        { _id: "o1", optionText: "Repeatedly sending inappropriate messages after being told no" },
        { _id: "o2", optionText: "Asking a colleague out for dinner once" },
        { _id: "o3", optionText: "Sending emails with sexual overtones" },
        { _id: "o4", optionText: "Ignoring a clear rejection and continuing advances" }
      ]
    },
    {
      _id: "q2",
      questionText: "What does POSH stand for?",
      type: "mcq",
      options: [
        { _id: "o5", optionText: "Prevention of Sexual Harassment" },
        { _id: "o6", optionText: "Policy on Sexual Harassment" },
        { _id: "o7", optionText: "Protection of Sexual Harassment" },
        { _id: "o8", optionText: "Prevention of Social Harassment" }
      ]
    },
    {
      _id: "q3",
      questionText: "Which act governs POSH in India?",
      type: "mcq",
      options: [
        { _id: "o9", optionText: "The Sexual Harassment of Women at Workplace Act 2013" },
        { _id: "o10", optionText: "The Women Protection Act 2012" },
        { _id: "o11", optionText: "The Gender Equality Act 2014" },
        { _id: "o12", optionText: "The Workplace Safety Act 2011" }
      ]
    },
   
       {
      _id: "q17",
      questionText: "Which act governs POSH in India?",
      type: "mcq",
      options: [
        { _id: "o9", optionText: "The Sexual Harassment of Women at Workplace Act 2013" },
        { _id: "o10", optionText: "The Women Protection Act 2012" },
        { _id: "o11", optionText: "The Gender Equality Act 2014" },
        { _id: "o12", optionText: "The Workplace Safety Act 2011" }
      ]
    },
    {
      _id: "q4",
      questionText: "Write a function that returns the number of vowels in a string.",
      type: "coding",
      codingDetails: {
        title: "Count Vowels",
        description: "Write a function that counts and returns the number of vowels in a given string.",
        examples: [
          {
            input: "'hello'",
            output: "2",
            explanation: "The string 'hello' contains 2 vowels: e and o"
          }
        ],
        constraints: [
          "Input string will only contain alphabetic characters",
          "The function should be case insensitive"
        ],
        testCases: [
          {
            input: "'hello'",
            expectedOutput: "2"
          },
          {
            input: "'AEIOU'",
            expectedOutput: "5"
          }
        ]
      }
    }
  ]
};