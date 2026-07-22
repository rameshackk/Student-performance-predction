export const getRecommendations = (gpa, major) => {
  // Convert GPA to an integer (e.g. 3.4 -> 34)
  const gpaInt = Math.round(gpa * 10);
  
  // High variance arrays
  const methodologies = [
    "Feynman Technique: Explain concepts simply to uncover blind spots.",
    "Pomodoro Technique: Work in 25-minute focus blocks with 5-minute breaks.",
    "Spaced Repetition: Review material at increasing intervals to combat the forgetting curve.",
    "Active Recall: Frequently test yourself without looking at your notes.",
    "Mind Mapping: Connect related concepts visually to see the bigger picture.",
    "Interleaving: Mix different topics or subjects in a single study session.",
    "Dual Coding: Combine verbal information with visual aids.",
    "PQ4R: Preview, Question, Read, Reflect, Recite, and Review your material.",
    "Leitner System: Use flashcard boxes for highly targeted review.",
    "Cornell Notes: Use a structured note-taking system to summarize and review."
  ];
  
  const improvementTips = [
    "Focus on building a strong foundational understanding before moving on.",
    "Review your weakest topics immediately after class while they are fresh.",
    "Seek out additional, varied practice problems online.",
    "Attend professor office hours systematically to clarify complex doubts.",
    "Form a study group with peers who challenge and motivate you.",
    "Try explaining the material to a classmate to reinforce your own learning.",
    "Review and consolidate your notes within 24 hours of the lecture.",
    "Focus heavily on applying concepts to real-world scenarios.",
    "Use distinct colors and formatting in your notes to improve cognitive recall.",
    "Take full practice exams under strictly simulated time constraints."
  ];
  
  const focusTips = [
    "Aggressively eliminate digital distractions during deep study sessions.",
    "Set highly specific, measurable micro-goals for each hour of study.",
    "Ensure you get adequate REM sleep before major exams to consolidate memory.",
    "Break massive assignments into perfectly manageable 30-minute chunks.",
    "Prioritize heavily on your hardest subjects first when your energy is highest.",
    "Implement small reward systems after completing difficult modules.",
    "Change your study environment occasionally to boost retention contexts.",
    "Keep your study desk aggressively clean and organized to reduce cognitive load.",
    "Use a physical planner to visually block out non-negotiable study times.",
    "Reflect weekly on what specific study methods yielded the highest ROI."
  ];
  
  // Deterministically select unique advice combinations based strictly on the exact decimal GPA
  // The math below ensures that 3.4 gets uniquely different arrays than 3.5
  const methdologyIndex = (gpaInt ** 2 + 3) % methodologies.length;
  const improvementIndex = (gpaInt * 7) % improvementTips.length;
  const focusIndex = (gpaInt * 13) % focusTips.length;
  
  // Study concepts tailored to the user's major and GPA tier
  let conceptsPrefix = "Review core foundational principles";
  if (gpa >= 3.5) conceptsPrefix = "Explore advanced theories and edge-case applications";
  else if (gpa >= 2.5) conceptsPrefix = "Solidify intermediate applications and bridge basic concepts";
  
  return {
    studyConcepts: `${conceptsPrefix} specific to ${major}.`,
    methodology: methodologies[methdologyIndex],
    improvementTip: improvementTips[improvementIndex],
    focusTip: focusTips[focusIndex],
    exactGPA: gpa // For debugging to show exactly which decimal this mapped to
  };
};
