import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Send, RotateCcw } from "lucide-react";

interface EvaluationResult {
  score: number;
  maxScore: number;
  feedback: string;
  similarity?: number;
}

const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    type: "one-word",
    correctAnswer: "Paris",
    maxScore: 1,
  },
  {
    id: 2,
    question: "Explain the process of photosynthesis.",
    type: "short-answer",
    correctAnswer: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen using chlorophyll in their leaves.",
    maxScore: 2,
  },
  {
    id: 3,
    question: "What is the chemical symbol for water?",
    type: "one-word",
    correctAnswer: "H2O",
    maxScore: 1,
  },
];

// Simple evaluation simulation
const evaluateAnswer = (
  type: string,
  correct: string,
  student: string
): EvaluationResult => {
  const correctLower = correct.toLowerCase().trim();
  const studentLower = student.toLowerCase().trim();

  if (type === "one-word") {
    if (studentLower === correctLower) {
      return { score: 1, maxScore: 1, feedback: "Correct! Great job." };
    }
    // Simple Levenshtein check (simplified)
    if (Math.abs(correctLower.length - studentLower.length) <= 1) {
      let diff = 0;
      const shorter = correctLower.length < studentLower.length ? correctLower : studentLower;
      const longer = correctLower.length >= studentLower.length ? correctLower : studentLower;
      for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] !== longer[i]) diff++;
      }
      if (diff <= 1) {
        return { score: 0.5, maxScore: 1, feedback: "Partially correct. Minor spelling error detected." };
      }
    }
    return { score: 0, maxScore: 1, feedback: `Incorrect. The correct answer is: ${correct}` };
  }

  // Short answer - simple word overlap calculation
  const correctWords = new Set(correctLower.split(/\s+/).filter(w => w.length > 2));
  const studentWords = new Set(studentLower.split(/\s+/).filter(w => w.length > 2));
  
  let matches = 0;
  correctWords.forEach(word => {
    if (studentWords.has(word)) matches++;
  });
  
  const similarity = correctWords.size > 0 ? matches / correctWords.size : 0;

  let score: number;
  let feedback: string;

  if (similarity >= 0.8) {
    score = 2;
    feedback = "Excellent answer! Covers all key concepts.";
  } else if (similarity >= 0.6) {
    score = 1.5;
    feedback = "Good answer. Most key points covered.";
  } else if (similarity >= 0.4) {
    score = 1;
    feedback = "Partial answer. Some important concepts missing.";
  } else if (similarity >= 0.2) {
    score = 0.5;
    feedback = "Limited answer. Review the topic for more detail.";
  } else {
    score = 0;
    feedback = "Answer needs significant improvement. Study the material again.";
  }

  return { score, maxScore: 2, feedback, similarity: Math.round(similarity * 100) };
};

const Demo = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const question = sampleQuestions[currentQuestion];

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setIsEvaluating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const evaluation = evaluateAnswer(
      question.type,
      question.correctAnswer,
      answer
    );
    
    setResult(evaluation);
    setIsEvaluating(false);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % sampleQuestions.length);
    setAnswer("");
    setResult(null);
  };

  const handleReset = () => {
    setAnswer("");
    setResult(null);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore;
    if (percentage >= 0.8) return "text-green-500";
    if (percentage >= 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreIcon = (score: number, maxScore: number) => {
    const percentage = score / maxScore;
    if (percentage >= 0.8) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (percentage >= 0.5) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <section id="demo" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Try It Now</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-4 mb-6">
            Interactive <span className="gradient-text">Demo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how the AI evaluator works. Answer the question below and see instant feedback.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          {/* Question header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                {question.type === "one-word" ? "One Word" : "Short Answer"}
              </span>
              <span className="text-sm text-muted-foreground">
                Max Score: {question.maxScore} {question.maxScore === 1 ? "mark" : "marks"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
          </div>

          {/* Question */}
          <div className="p-6 rounded-xl bg-secondary/50 border border-border/50 mb-6">
            <p className="text-lg font-medium text-foreground">{question.question}</p>
          </div>

          {/* Answer input */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">Your Answer</label>
            {question.type === "one-word" ? (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-4 rounded-xl bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                disabled={!!result}
              />
            ) : (
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                rows={4}
                className="w-full p-4 rounded-xl bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                disabled={!!result}
              />
            )}
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-6 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getScoreIcon(result.score, result.maxScore)}
                    <span className="font-semibold text-foreground">Evaluation Result</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.similarity !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        Similarity: {result.similarity}%
                      </span>
                    )}
                    <span className={`text-2xl font-bold ${getScoreColor(result.score, result.maxScore)}`}>
                      {result.score}/{result.maxScore}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">{result.feedback}</p>
                
                {question.type === "short-answer" && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Expected Answer:</p>
                    <p className="text-sm text-foreground/80">{question.correctAnswer}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-4">
            {!result ? (
              <Button
                variant="hero"
                size="lg"
                onClick={handleSubmit}
                disabled={!answer.trim() || isEvaluating}
                className="flex-1"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Answer
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="hero-outline" size="lg" onClick={handleReset} className="flex-1">
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </Button>
                <Button variant="hero" size="lg" onClick={handleNext} className="flex-1">
                  Next Question
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Demo;
