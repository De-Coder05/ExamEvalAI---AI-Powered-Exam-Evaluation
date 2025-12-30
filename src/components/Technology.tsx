import { motion } from "framer-motion";

const techStack = [
  { name: "TF-IDF Vectorization", description: "Term Frequency-Inverse Document Frequency for text representation" },
  { name: "Cosine Similarity", description: "Measures semantic similarity between answer vectors" },
  { name: "Lemmatization", description: "Reduces words to their base form for better matching" },
  { name: "Levenshtein Distance", description: "Handles spelling variations in one-word answers" },
  { name: "NLTK Processing", description: "Natural Language Toolkit for tokenization and stop word removal" },
  { name: "Scikit-Learn", description: "Machine learning library powering the evaluation engine" },
];

const Technology = () => {
  return (
    <section id="technology" className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Under the Hood</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-4 mb-6">
              Powered by Advanced
              <br />
              <span className="gradient-text">NLP Algorithms</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our evaluation engine combines multiple natural language processing techniques 
              to understand context, meaning, and intent—not just keyword matching.
            </p>

            {/* Code visualization */}
            <div className="glass-card p-6 font-mono text-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground ml-2 text-xs">evaluator.py</span>
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="text-purple-400">def</span> <span className="text-accent">evaluate_short_answer</span>(correct, student):</p>
                <p className="pl-4 text-muted-foreground"># Preprocess and vectorize text</p>
                <p className="pl-4"><span className="text-primary">tfidf_matrix</span> = vectorizer.fit_transform([</p>
                <p className="pl-8">preprocess(correct),</p>
                <p className="pl-8">preprocess(student)</p>
                <p className="pl-4">])</p>
                <p className="pl-4 text-muted-foreground"># Calculate semantic similarity</p>
                <p className="pl-4"><span className="text-primary">score</span> = cosine_similarity(</p>
                <p className="pl-8">tfidf_matrix[<span className="text-green-400">0</span>],</p>
                <p className="pl-8">tfidf_matrix[<span className="text-green-400">1</span>]</p>
                <p className="pl-4">)</p>
                <p className="pl-4"><span className="text-purple-400">return</span> generate_feedback(score)</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Tech cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card-hover p-5"
              >
                <h4 className="font-semibold text-foreground mb-2 text-sm">{tech.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scoring explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-serif font-bold text-center mb-10">Intelligent Scoring System</h3>
          
          <div className="glass-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* One-word scoring */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
                  One-Word Questions (1 Mark)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm text-foreground">Exact match / Lemma match</span>
                    <span className="font-bold text-green-500">1.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-sm text-foreground">Minor spelling error (distance ≤ 1)</span>
                    <span className="font-bold text-yellow-500">0.5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-sm text-foreground">Incorrect answer</span>
                    <span className="font-bold text-red-500">0.0</span>
                  </div>
                </div>
              </div>

              {/* Short-answer scoring */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">2</span>
                  Short-Answer Questions (2 Marks)
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm text-foreground">Similarity ≥ 80%</span>
                    <span className="font-bold text-green-500">2.0</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-sm text-foreground">Similarity 60-79%</span>
                    <span className="font-bold text-cyan-500">1.5</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-sm text-foreground">Similarity 40-59%</span>
                    <span className="font-bold text-yellow-500">1.0</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <span className="text-sm text-foreground">Similarity 20-39%</span>
                    <span className="font-bold text-orange-500">0.5</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-sm text-foreground">Similarity &lt; 20%</span>
                    <span className="font-bold text-red-500">0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;
