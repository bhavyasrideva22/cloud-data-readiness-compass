import { AssessmentAnswer, AssessmentResults, WISCARScores } from '@/types/assessment';
import { getAllQuestions } from '@/data/questions';

export const calculateAssessmentResults = (answers: AssessmentAnswer[]): AssessmentResults => {
  const questions = getAllQuestions();
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));

  // Calculate psychological fit (0-100)
  const psychometricAnswers = answers.filter(a => 
    questions.find(q => q.id === a.questionId)?.category === 'psychometric'
  );
  const psychological_fit = calculatePsychometricScore(psychometricAnswers);

  // Calculate technical readiness (0-100)
  const technicalAnswers = answers.filter(a => 
    questions.find(q => q.id === a.questionId)?.category === 'technical'
  );
  const technical_readiness = calculateTechnicalScore(technicalAnswers, questions);

  // Calculate WISCAR scores
  const wiscarAnswers = answers.filter(a => 
    questions.find(q => q.id === a.questionId)?.category === 'wiscar'
  );
  const wiscar = calculateWISCARScores(wiscarAnswers, questions);

  // Overall confidence score
  const overall_score = (psychological_fit + technical_readiness + wiscar.overall_confidence) / 3;

  // Determine recommendation
  let recommendation: 'Yes' | 'Maybe' | 'No';
  if (overall_score >= 70) recommendation = 'Yes';
  else if (overall_score >= 50) recommendation = 'Maybe';
  else recommendation = 'No';

  // Generate next steps and career alignment
  const next_steps = generateNextSteps(recommendation, technical_readiness, wiscar);
  const career_alignment = generateCareerAlignment(psychological_fit, technical_readiness);
  const skill_gaps = identifySkillGaps(technicalAnswers, questions);
  const ideal_path = generateLearningPath(recommendation, skill_gaps);

  return {
    psychological_fit: Math.round(psychological_fit),
    technical_readiness: Math.round(technical_readiness),
    wiscar,
    recommendation,
    confidence_score: Math.round(overall_score),
    next_steps,
    career_alignment,
    skill_gaps,
    ideal_path
  };
};

const calculatePsychometricScore = (answers: AssessmentAnswer[]): number => {
  if (answers.length === 0) return 0;
  
  const totalScore = answers.reduce((sum, answer) => {
    const numValue = typeof answer.value === 'number' ? answer.value : parseFloat(answer.value as string);
    // Normalize to 0-100 scale (assuming most questions are 1-5 Likert or 0-100 slider)
    const normalizedScore = numValue <= 5 ? (numValue - 1) * 25 : numValue;
    return sum + normalizedScore;
  }, 0);
  
  return totalScore / answers.length;
};

const calculateTechnicalScore = (answers: AssessmentAnswer[], questions: any[]): number => {
  if (answers.length === 0) return 0;
  
  let correctAnswers = 0;
  let totalQuestions = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question?.type === 'multiple-choice') {
      totalQuestions++;
      // Define correct answers for technical questions
      const correctAnswer = getCorrectAnswer(answer.questionId);
      if (answer.value === correctAnswer) {
        correctAnswers++;
      }
    }
  });
  
  return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
};

const getCorrectAnswer = (questionId: string): string => {
  const correctAnswers: Record<string, string> = {
    'tech_1': 'Counts unique customers who placed orders in 2023',
    'tech_2': 'They provide elastic scaling and pay-per-use pricing',
    'tech_3': 'Provide descriptive attributes for analysis',
    'tech_4': 'A compute cluster that processes queries',
    'tech_5': 'Accessing historical data and recovering from changes',
    'tech_6': '2000 queries',
    'tech_7': 'VARIANT'
  };
  return correctAnswers[questionId] || '';
};

const calculateWISCARScores = (answers: AssessmentAnswer[], questions: any[]): WISCARScores => {
  const scoresByDimension: Record<string, number[]> = {
    will: [],
    interest: [],
    skill: [],
    cognitive: [],
    ability_to_learn: [],
    real_world_alignment: []
  };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question?.subcategory) {
      const subcategory = question.subcategory;
      let normalizedScore: number;
      
      if (question.type === 'likert') {
        normalizedScore = (typeof answer.value === 'number' ? answer.value : parseFloat(answer.value as string) - 1) * 25;
      } else if (question.type === 'multiple-choice' || question.type === 'scenario') {
        // Score multiple choice based on "quality" of answer
        normalizedScore = getScenarioScore(answer.questionId, answer.value as string);
      } else {
        normalizedScore = typeof answer.value === 'number' ? answer.value : parseFloat(answer.value as string);
      }
      
      scoresByDimension[subcategory]?.push(normalizedScore);
    }
  });

  const averageScore = (scores: number[]) => 
    scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 50;

  const W = Math.round(averageScore(scoresByDimension.will));
  const I = Math.round(averageScore(scoresByDimension.interest));
  const S = Math.round(averageScore(scoresByDimension.skill));
  const C = Math.round(averageScore(scoresByDimension.cognitive));
  const A = Math.round(averageScore(scoresByDimension.ability_to_learn));
  const R = Math.round(averageScore(scoresByDimension.real_world_alignment));
  
  const overall_confidence = Math.round((W + I + S + C + A + R) / 6);

  return { W, I, S, C, A, R, overall_confidence };
};

const getScenarioScore = (questionId: string, answer: string): number => {
  const scenarioScores: Record<string, Record<string, number>> = {
    'wiscar_i2': {
      'Accept the performance and work around it': 25,
      'Ask someone else to optimize it': 50,
      'Investigate and learn how to improve it myself': 100,
      'Switch to a different approach entirely': 40
    },
    'wiscar_c1': {
      'Copy an existing schema from online': 30,
      'Start building tables without planning': 10,
      'Analyze business requirements and design accordingly': 100,
      'Use a pre-built template regardless of needs': 40
    },
    'wiscar_c2': {
      'Try random solutions until something works': 20,
      'Ask for help immediately': 50,
      'Systematically isolate and test each component': 100,
      'Restart the entire pipeline': 30
    },
    'wiscar_r1': {
      'Tell them it\'s impossible and reject the request': 20,
      'Rush through it without considering data quality': 30,
      'Negotiate timeline while ensuring accuracy and reliability': 100,
      'Delegate it to someone else': 50
    }
  };
  
  return scenarioScores[questionId]?.[answer] || 50;
};

const generateNextSteps = (recommendation: string, technical_readiness: number, wiscar: WISCARScores): string[] => {
  const steps: string[] = [];
  
  if (recommendation === 'Yes') {
    steps.push('Enroll in Snowflake Fundamentals Training');
    steps.push('Set up a free Snowflake trial account for hands-on practice');
    if (technical_readiness < 80) {
      steps.push('Strengthen SQL skills with advanced querying techniques');
    }
    steps.push('Build a portfolio project demonstrating data pipeline creation');
  } else if (recommendation === 'Maybe') {
    if (wiscar.S < 70) {
      steps.push('Complete foundational SQL and database courses');
      steps.push('Learn cloud computing basics (AWS, Azure, or GCP)');
    }
    if (wiscar.W < 60) {
      steps.push('Reflect on your motivation and commitment to data engineering');
    }
    steps.push('Consider starting with broader data analysis roles');
  } else {
    steps.push('Explore data literacy and basic analytics courses');
    steps.push('Consider business analyst or project management roles in data teams');
    steps.push('Gain experience with data visualization tools like Tableau or Power BI');
  }
  
  return steps;
};

const generateCareerAlignment = (psychological_fit: number, technical_readiness: number): string[] => {
  const roles: string[] = [];
  
  if (psychological_fit >= 70 && technical_readiness >= 70) {
    roles.push('Snowflake Data Engineer', 'Cloud Data Architect', 'DataOps Engineer');
  } else if (psychological_fit >= 60) {
    roles.push('Data Analyst', 'BI Developer', 'ETL Developer');
  } else {
    roles.push('Business Analyst', 'Data Coordinator', 'Technical Project Manager');
  }
  
  return roles;
};

const identifySkillGaps = (answers: AssessmentAnswer[], questions: any[]): Record<string, string> => {
  const gaps: Record<string, string> = {};
  
  // Analyze technical performance by subcategory
  const subcategoryScores: Record<string, number[]> = {};
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question?.subcategory && question.type === 'multiple-choice') {
      const correct = getCorrectAnswer(answer.questionId);
      const isCorrect = answer.value === correct;
      
      if (!subcategoryScores[question.subcategory]) {
        subcategoryScores[question.subcategory] = [];
      }
      subcategoryScores[question.subcategory].push(isCorrect ? 100 : 0);
    }
  });
  
  Object.entries(subcategoryScores).forEach(([subcategory, scores]) => {
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (average < 60) {
      gaps[subcategory] = 'High';
    } else if (average < 80) {
      gaps[subcategory] = 'Medium';
    } else {
      gaps[subcategory] = 'Low';
    }
  });
  
  return gaps;
};

const generateLearningPath = (recommendation: string, skill_gaps: Record<string, string>): string[] => {
  const path: string[] = [];
  
  if (Object.values(skill_gaps).includes('High')) {
    path.push('Foundation: SQL Fundamentals & Database Concepts');
    path.push('Cloud Computing Basics');
  }
  
  path.push('Snowflake Fundamentals Training');
  path.push('Advanced Snowflake Features (Time Travel, Streams, Tasks)');
  path.push('Data Modeling & Warehouse Design');
  path.push('Performance Optimization & Query Tuning');
  path.push('Data Engineering Capstone Project');
  
  return path;
};