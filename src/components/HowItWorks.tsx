import { motion } from "framer-motion";
import { UserCog, GraduationCap, Upload, PenTool, CheckCircle, TrendingUp } from "lucide-react";

const professorSteps = [
  {
    icon: Upload,
    title: "Upload Question Bank",
    description: "Import your questions via CSV or create them directly in the system with support for one-word and short-answer types.",
  },
  {
    icon: UserCog,
    title: "Configure Thresholds",
    description: "Set evaluation sensitivity and scoring criteria to match your grading standards and course requirements.",
  },
  {
    icon: CheckCircle,
    title: "Review Results",
    description: "Access detailed analytics, export grades, and monitor class-wide performance trends.",
  },
];

const studentSteps = [
  {
    icon: PenTool,
    title: "Take Exam",
    description: "Answer randomized questions from the question bank. Each session provides a unique set of questions.",
  },
  {
    icon: CheckCircle,
    title: "Get Instant Feedback",
    description: "Receive immediate scores with detailed feedback highlighting strengths and areas to improve.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "View your exam history, identify weak areas, and practice until you master every concept.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-4 mb-6">
            Two Powerful Modes,
            <br />
            <span className="gradient-text">One Intelligent System</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Professor Mode */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                  <UserCog className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">Professor Mode</h3>
                  <p className="text-muted-foreground">Full control over evaluation</p>
                </div>
              </div>

              <div className="space-y-6">
                {professorSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Pro tip:</span> Use the CSV format with columns: 
                  Question, Type (one-word/short-answer), Correct Answer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Student Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">Student Mode</h3>
                  <p className="text-muted-foreground">Learn and improve</p>
                </div>
              </div>

              <div className="space-y-6">
                {studentSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-accent">Step {index + 1}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-sm text-muted-foreground">
                  <span className="text-accent font-medium">Study tip:</span> Use Practice Mode regularly 
                  to identify weak areas before taking graded exams.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
