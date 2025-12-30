import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, FileText } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
          >
            Ready to Transform Your
            <br />
            <span className="gradient-text">Exam Evaluation</span> Process?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto"
          >
            Join educators and students who are already using AI-powered evaluation 
            to save time, provide better feedback, and improve learning outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </Button>
            <Button variant="glass" size="xl">
              <FileText className="w-5 h-5" />
              Documentation
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 pt-10 border-t border-border/50 grid grid-cols-3 gap-8"
          >
            <div>
              <p className="text-3xl font-bold gradient-text">Open Source</p>
              <p className="text-sm text-muted-foreground mt-1">MIT License</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text-accent">Python</p>
              <p className="text-sm text-muted-foreground mt-1">Powered</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">NLP</p>
              <p className="text-sm text-muted-foreground mt-1">Driven</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
