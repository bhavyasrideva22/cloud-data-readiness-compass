import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AssessmentQuestion } from "@/types/assessment";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: AssessmentQuestion;
  onAnswer: (value: number | string) => void;
  currentAnswer?: number | string;
}

export const QuestionCard = ({ question, onAnswer, currentAnswer }: QuestionCardProps) => {
  const [answer, setAnswer] = useState<number | string>(currentAnswer || '');

  const handleSubmit = () => {
    if (answer !== '') {
      onAnswer(answer);
    }
  };

  const isAnswered = answer !== '';

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {question.type === 'likert' && (
          <div className="space-y-4">
            <RadioGroup value={answer?.toString() || ''} onValueChange={(value) => setAnswer(parseInt(value))}>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`option-${value}`}
                      className="cursor-pointer"
                    />
                    <Label 
                      htmlFor={`option-${value}`}
                      className="cursor-pointer flex-1 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span>{value}</span>
                        {value === 1 && <span className="text-sm text-muted-foreground">{question.minLabel}</span>}
                        {value === 5 && <span className="text-sm text-muted-foreground">{question.maxLabel}</span>}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {question.type === 'slider' && (
          <div className="space-y-4">
            <div className="px-3">
              <Slider
                value={[typeof answer === 'number' ? answer : 50]}
                onValueChange={(value) => setAnswer(value[0])}
                min={question.minValue || 0}
                max={question.maxValue || 100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-3">
              <span>{question.minLabel}</span>
              <span className="font-medium text-primary">
                {typeof answer === 'number' ? answer : 50}
              </span>
              <span>{question.maxLabel}</span>
            </div>
          </div>
        )}

        {(question.type === 'multiple-choice' || question.type === 'scenario') && (
          <RadioGroup value={answer as string} onValueChange={setAnswer}>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="mt-1 cursor-pointer"
                  />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="cursor-pointer flex-1 py-3 px-4 rounded-lg hover:bg-accent transition-colors border border-transparent hover:border-border"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={!isAnswered}
            variant={isAnswered ? "default" : "outline"}
            className={cn(
              "transition-all duration-200",
              isAnswered && "shadow-primary hover:shadow-glow"
            )}
          >
            Next Question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};