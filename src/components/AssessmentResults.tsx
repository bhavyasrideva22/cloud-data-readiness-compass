import { AssessmentResults as Results } from "@/types/assessment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Target, 
  TrendingUp, 
  BookOpen,
  Users,
  Lightbulb,
  Download
} from "lucide-react";

interface AssessmentResultsProps {
  results: Results;
  onRestart: () => void;
}

export const AssessmentResults = ({ results, onRestart }: AssessmentResultsProps) => {
  const getRecommendationIcon = () => {
    switch (results.recommendation) {
      case 'Yes': return <CheckCircle className="h-6 w-6 text-success" />;
      case 'Maybe': return <AlertCircle className="h-6 w-6 text-warning" />;
      case 'No': return <XCircle className="h-6 w-6 text-destructive" />;
    }
  };

  const getRecommendationColor = () => {
    switch (results.recommendation) {
      case 'Yes': return 'bg-success text-success-foreground';
      case 'Maybe': return 'bg-warning text-warning-foreground';
      case 'No': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getRecommendationMessage = () => {
    switch (results.recommendation) {
      case 'Yes': 
        return "Excellent! You show strong potential for a successful career in Snowflake data engineering. Your aptitude, motivation, and alignment make you an ideal candidate.";
      case 'Maybe': 
        return "You have promising potential for Snowflake, but some areas need development. Focus on the suggested next steps to strengthen your readiness.";
      case 'No': 
        return "Snowflake might not be the best fit right now. Consider exploring adjacent fields or building foundational skills before revisiting this path.";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Results Header */}
      <Card className="bg-gradient-hero text-primary-foreground shadow-glow border-0">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {getRecommendationIcon()}
          </div>
          <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
          <div className="flex justify-center mb-4">
            <Badge className={`${getRecommendationColor()} text-lg px-6 py-2`}>
              {results.recommendation === 'Yes' && 'Recommended'}
              {results.recommendation === 'Maybe' && 'Conditional Fit'}
              {results.recommendation === 'No' && 'Not Recommended'}
            </Badge>
          </div>
          <p className="text-xl text-white/90 mb-6">
            Overall Confidence Score: <strong>{results.confidence_score}%</strong>
          </p>
          <p className="text-white/80">
            {getRecommendationMessage()}
          </p>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Psychological Fit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{results.psychological_fit}%</span>
                <Badge variant={results.psychological_fit >= 70 ? "default" : "secondary"}>
                  {results.psychological_fit >= 70 ? "Strong" : results.psychological_fit >= 50 ? "Moderate" : "Weak"}
                </Badge>
              </div>
              <Progress value={results.psychological_fit} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Your personality traits, motivation, and mindset alignment with data engineering roles.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Technical Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{results.technical_readiness}%</span>
                <Badge variant={results.technical_readiness >= 70 ? "default" : "secondary"}>
                  {results.technical_readiness >= 70 ? "Ready" : results.technical_readiness >= 50 ? "Developing" : "Beginner"}
                </Badge>
              </div>
              <Progress value={results.technical_readiness} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Your current technical knowledge and aptitude for Snowflake concepts.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              WISCAR Overall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{results.wiscar.overall_confidence}%</span>
                <Badge variant={results.wiscar.overall_confidence >= 70 ? "default" : "secondary"}>
                  {results.wiscar.overall_confidence >= 70 ? "High" : results.wiscar.overall_confidence >= 50 ? "Medium" : "Low"}
                </Badge>
              </div>
              <Progress value={results.wiscar.overall_confidence} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Comprehensive evaluation across six key dimensions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WISCAR Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>WISCAR Dimensional Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { key: 'W', label: 'Will', score: results.wiscar.W },
              { key: 'I', label: 'Interest', score: results.wiscar.I },
              { key: 'S', label: 'Skill', score: results.wiscar.S },
              { key: 'C', label: 'Cognitive', score: results.wiscar.C },
              { key: 'A', label: 'Ability to Learn', score: results.wiscar.A },
              { key: 'R', label: 'Real-World Fit', score: results.wiscar.R }
            ].map((dimension) => (
              <div key={dimension.key} className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">{dimension.score}%</div>
                <div className="text-sm font-medium mb-2">{dimension.label}</div>
                <Progress value={dimension.score} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.next_steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Career Alignment */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Career Alignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {results.career_alignment.map((role, index) => (
              <div key={index} className="p-3 border rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="font-medium">{role}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.ideal_path.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
          Retake Assessment
        </Button>
        <Button variant="hero" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Full Report
        </Button>
      </div>
    </div>
  );
};