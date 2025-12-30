import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  BarChart3, 
  MessageSquareText, 
  GraduationCap, 
  Shield,
  Target,
  BookOpen
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "NLP-Powered Grading",
    description: "Advanced natural language processing using TF-IDF vectorization and cosine similarity for accurate semantic analysis.",
    color: "from-primary to-orange-400",
  },
  {
    icon: Zap,
    title: "Instant Evaluation",
    description: "Get results in seconds. Evaluate hundreds of answers simultaneously with our optimized processing pipeline.",
    color: "from-accent to-cyan-400",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track progress over time with detailed visualizations, identify weak areas, and monitor improvement trends.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquareText,
    title: "Detailed Feedback",
    description: "Receive constructive feedback highlighting missing concepts and areas for improvement on every answer.",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: Target,
    title: "Spelling Tolerance",
    description: "Levenshtein distance algorithm allows for minor spelling errors, ensuring fair grading for one-word answers.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: BookOpen,
    title: "Question Bank",
    description: "Create and manage custom question banks with support for one-word and short-answer question types.",
    color: "from-amber-500 to-yellow-400",
  },
  {
    icon: GraduationCap,
    title: "Practice Mode",
    description: "Students can practice with immediate feedback, building confidence before taking actual exams.",
    color: "from-rose-500 to-red-400",
  },
  {
    icon: Shield,
    title: "Consistent Grading",
    description: "Eliminate human bias with standardized evaluation criteria that's fair and reproducible every time.",
    color: "from-teal-500 to-cyan-400",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-4 mb-6">
            Everything You Need for
            <br />
            <span className="gradient-text">Intelligent Evaluation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built on advanced NLP techniques including lemmatization, stop word removal, 
            and semantic similarity analysis for precise and fair grading.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card-hover p-6 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-background" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
