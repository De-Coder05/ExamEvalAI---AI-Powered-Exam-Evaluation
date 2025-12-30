import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Evaluation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
            >
              Transform Exam
              <br />
              <span className="gradient-text">Evaluation</span> with
              <br />
              <span className="gradient-text-accent">Artificial Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Automate grading with NLP-powered analysis. Get instant feedback, 
              semantic similarity scoring, and comprehensive performance analytics 
              for both one-word and short-answer questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                View Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">10x</p>
                <p className="text-xs text-muted-foreground">Faster Grading</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="glass-card p-8 animate-float">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">Exam Analysis</h3>
                    <p className="text-sm text-muted-foreground">Processing student answer...</p>
                  </div>
                </div>

                {/* Simulated evaluation */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Question</p>
                    <p className="text-sm text-foreground">What is photosynthesis?</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Student Answer</p>
                    <p className="text-sm text-foreground">The process by which plants convert sunlight into energy using chlorophyll.</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Similarity Score</p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-gradient-to-r from-accent to-cyan-400 rounded-full" />
                        </div>
                        <span className="text-sm font-semibold text-accent">85%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Score</p>
                      <p className="text-lg font-bold gradient-text-accent">1.5/2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float animation-delay-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">NLP Active</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-float animation-delay-400">
                <p className="text-xs text-muted-foreground">Feedback Generated</p>
                <p className="text-sm text-primary font-medium">Answer is correct ✓</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
