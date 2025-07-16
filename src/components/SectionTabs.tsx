import { cn } from "@/lib/utils";
import { Brain, Code, Radar, Target, CheckCircle } from "lucide-react";

interface SectionTabsProps {
  currentSection: number;
  completedSections: number[];
  onSectionChange?: (section: number) => void;
  disabled?: boolean;
}

const sections = [
  { id: 0, title: "Introduction", icon: Target },
  { id: 1, title: "Psychological Fit", icon: Brain },
  { id: 2, title: "Technical Aptitude", icon: Code },
  { id: 3, title: "WISCAR Analysis", icon: Radar },
  { id: 4, title: "Your Results", icon: CheckCircle }
];

export const SectionTabs = ({ 
  currentSection, 
  completedSections, 
  onSectionChange,
  disabled = false 
}: SectionTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {sections.map((section) => {
        const isActive = currentSection === section.id;
        const isCompleted = completedSections.includes(section.id);
        const isClickable = !disabled && onSectionChange && (isCompleted || section.id <= currentSection + 1);
        
        return (
          <button
            key={section.id}
            onClick={() => isClickable && onSectionChange(section.id)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "border border-transparent",
              isActive && "bg-primary text-primary-foreground shadow-primary",
              !isActive && isCompleted && "bg-success/10 text-success border-success/20",
              !isActive && !isCompleted && "bg-muted text-muted-foreground",
              isClickable && !isActive && "hover:bg-accent hover:text-accent-foreground",
              !isClickable && "cursor-not-allowed opacity-50"
            )}
          >
            <section.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{section.title}</span>
            {isCompleted && !isActive && (
              <CheckCircle className="h-3 w-3" />
            )}
          </button>
        );
      })}
    </div>
  );
};