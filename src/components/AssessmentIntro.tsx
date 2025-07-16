import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Target, TrendingUp, Snowflake, Cloud, Database, BarChart3, Cog, Users } from "lucide-react";

interface AssessmentIntroProps {
  onStartAssessment: () => void;
}

export const AssessmentIntro = ({ onStartAssessment }: AssessmentIntroProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <Card className="bg-gradient-hero text-primary-foreground shadow-glow border-0">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Snowflake className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Discover Your Snowflake Career Potential
          </h1>
          <p className="text-xl mb-6 text-white/90">
            Take our comprehensive assessment to evaluate your psychological fit,
            technical readiness, and career alignment for a future in Snowflake
            development and administration.
          </p>
          <div className="flex justify-center items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>25-30 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Personalized Results</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Career Guidance</span>
            </div>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={onStartAssessment}
            className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Assessment
          </Button>
        </CardContent>
      </Card>

      {/* What is Snowflake Section */}
      <Card className="shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Snowflake className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">What is Snowflake?</h2>
          </div>
          <p className="text-lg mb-6 text-muted-foreground">
            Snowflake is a powerful <strong className="text-primary">cloud-native data platform</strong> that specializes in{" "}
            <strong className="text-primary">data warehousing, engineering, and analytics</strong>. It enables scalable SQL-based data pipelines,
            real-time querying, and secure data sharing across organizations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Cloud className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-primary mb-2">Cloud Platform</h3>
              <p className="text-sm text-muted-foreground">
                Scalable, secure, and accessible from anywhere
              </p>
            </div>
            <div className="text-center p-4">
              <Cog className="h-12 w-12 text-success mx-auto mb-3" />
              <h3 className="font-semibold text-success mb-2">Data Engineering</h3>
              <p className="text-sm text-muted-foreground">
                Build robust data pipelines and transformations
              </p>
            </div>
            <div className="text-center p-4">
              <BarChart3 className="h-12 w-12 text-warning mx-auto mb-3" />
              <h3 className="font-semibold text-warning mb-2">Enterprise Scale</h3>
              <p className="text-sm text-muted-foreground">
                Used by Fortune 500 companies worldwide
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Opportunities */}
      <Card className="shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Career Opportunities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Snowflake Data Engineer",
                description: "Build workflows and automation",
                icon: Database
              },
              {
                title: "Cloud Data Architect", 
                description: "Design cloud-native data platforms",
                icon: Cloud
              },
              {
                title: "ETL/ELT Developer",
                description: "Create transformation logic in SQL",
                icon: Cog
              },
              {
                title: "BI Engineer/Analyst",
                description: "Create dashboards from Snowflake",
                icon: BarChart3
              },
              {
                title: "DataOps Engineer",
                description: "Manage Snowflake + automation",
                icon: TrendingUp
              },
              {
                title: "Data Platform Engineer",
                description: "Advanced system design & optimization",
                icon: Target
              }
            ].map((role, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <role.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ideal Traits */}
      <Card className="shadow-card">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Ideal Traits & Skills</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Strong analytical thinking",
              "Process-oriented mindset", 
              "Logical problem-solving",
              "Interest in data platforms",
              "Comfort with SQL/scripting",
              "Attention to detail"
            ].map((trait, index) => (
              <div key={index} className="text-center p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium">{trait}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Modules */}
      <Card className="shadow-card">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">What You'll Discover</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Assessment Modules:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <span className="font-medium">Psychological Fit Evaluation</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="font-medium">Technical Aptitude Testing</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="font-medium">WISCAR Framework Analysis</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Your Results Include:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Personalized fit score (0-100)",
                  "Detailed trait analysis", 
                  "Technical readiness assessment",
                  "Career pathway recommendations",
                  "Next steps and learning resources",
                  "WISCAR dimensional analysis"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};