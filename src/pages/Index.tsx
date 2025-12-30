import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Technology from "@/components/Technology";
import Demo from "@/components/Demo";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ExamEval - AI-Powered Exam Evaluation System</title>
        <meta
          name="description"
          content="Transform exam evaluation with AI. Automated grading using NLP-powered analysis for one-word and short-answer questions. Get instant feedback and comprehensive analytics."
        />
        <meta
          name="keywords"
          content="exam evaluation, AI grading, NLP, automated grading, education technology, exam sheets evaluator"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Technology />
          <Demo />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
