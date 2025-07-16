import { useState } from "react";
import { AssessmentIntro } from "@/components/AssessmentIntro";
import { QuestionCard } from "@/components/QuestionCard";
import { AssessmentResults } from "@/components/AssessmentResults";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionTabs } from "@/components/SectionTabs";
import { assessmentSections, getTotalQuestions } from "@/data/questions";
import { calculateAssessmentResults } from "@/utils/scoring";
import { AssessmentAnswer, UserProgress, AssessmentResults as Results } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const totalQuestions = getTotalQuestions();
  const progress = (answers.length / totalQuestions) * 100;

  const getCurrentSection = () => {
    if (currentSection === 0) return null; // Introduction
    if (currentSection === 4) return null; // Results
    return assessmentSections[currentSection - 1];
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    if (!section) return null;
    return section.questions[currentQuestionIndex] || null;
  };

  const handleStartAssessment = () => {
    setCurrentSection(1);
    setCurrentQuestionIndex(0);
    toast({
      title: "Assessment Started",
      description: "Good luck! Take your time with each question.",
    });
  };

  const handleAnswer = (value: number | string) => {
    const question = getCurrentQuestion();
    if (!question) return;

    const newAnswer: AssessmentAnswer = {
      questionId: question.id,
      value
    };

    const updatedAnswers = answers.filter(a => a.questionId !== question.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // Move to next question
    const section = getCurrentSection();
    if (!section) return;

    if (currentQuestionIndex < section.questions.length - 1) {
      // Next question in current section
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to next section
      const completedSectionId = currentSection;
      setCompletedSections(prev => [...prev, completedSectionId]);
      
      if (currentSection < 3) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestionIndex(0);
        toast({
          title: "Section Complete",
          description: `Great job! Moving to the next section.`,
        });
      } else {
        // Assessment complete
        const finalResults = calculateAssessmentResults(updatedAnswers);
        setResults(finalResults);
        setCurrentSection(4);
        toast({
          title: "Assessment Complete!",
          description: "Your personalized results are ready.",
        });
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSection > 1) {
      const prevSection = currentSection - 1;
      const prevSectionData = assessmentSections[prevSection - 1];
      setCurrentSection(prevSection);
      setCurrentQuestionIndex(prevSectionData.questions.length - 1);
    }
  };

  const handleRestartAssessment = () => {
    setCurrentSection(0);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
    setCompletedSections([]);
    toast({
      title: "Assessment Reset",
      description: "Starting fresh! Good luck!",
    });
  };

  const getCurrentAnswer = () => {
    const question = getCurrentQuestion();
    if (!question) return undefined;
    return answers.find(a => a.questionId === question.id)?.value;
  };

  const canGoPrevious = currentSection > 1 || currentQuestionIndex > 0;
  const questionNumber = answers.length + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">❄️ "Should I Learn Snowflake?"</h1>
              <p className="text-muted-foreground">A Smart Assessment to Explore Your Fit for Cloud Data Engineering</p>
            </div>
            {currentSection > 0 && currentSection < 4 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Question {questionNumber} of {totalQuestions}
                </p>
              </div>
            )}
          </div>
          
          <SectionTabs 
            currentSection={currentSection}
            completedSections={completedSections}
          />

          {currentSection > 0 && currentSection < 4 && (
            <ProgressBar progress={progress} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentSection === 0 && (
          <AssessmentIntro onStartAssessment={handleStartAssessment} />
        )}

        {currentSection > 0 && currentSection < 4 && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">
                  {getCurrentSection()?.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} of {getCurrentSection()?.questions.length}
                </span>
              </div>
              <p className="text-muted-foreground">
                {getCurrentSection()?.description}
              </p>
            </div>

            {getCurrentQuestion() && (
              <QuestionCard
                question={getCurrentQuestion()!}
                onAnswer={handleAnswer}
                currentAnswer={getCurrentAnswer()}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={!canGoPrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Section: {getCurrentSection()?.title}
                </p>
              </div>
              
              <div className="w-24" /> {/* Spacer for alignment */}
            </div>
          </div>
        )}

        {currentSection === 4 && results && (
          <div className="max-w-5xl mx-auto">
            <AssessmentResults 
              results={results} 
              onRestart={handleRestartAssessment}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
