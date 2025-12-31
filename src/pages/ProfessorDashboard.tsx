import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { CreateExamDialog } from "@/components/CreateExamDialog";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  LogOut,
  User,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { ExamResultDialog } from "@/components/ExamResultDialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Exam {
  _id: string;
  title: string;
  subject: string;
  submissions: number; // Placeholder, as backend doesn't aggregate yet
  totalQuestions: number;
  createdAt: string;
}

const ProfessorDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || role !== "professor")) {
      navigate("/auth");
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch Active Exams
      const examResponse = await fetch(`${import.meta.env.VITE_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (examResponse.ok) {
        setExams(await examResponse.json());
      }

      // Fetch Recent Submissions
      const subResponse = await fetch(`${import.meta.env.VITE_API_URL}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (subResponse.ok) {
        setSubmissions(await subResponse.json());
      }

    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Real-time polling
    return () => clearInterval(interval);
  }, [user]);

  const uniqueStudents = new Set(submissions.map(s => s.student?._id)).size;
  const avgScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.totalScore / s.maxScore) * 100, 0) / submissions.length)
    : 0;

  const stats = [
    { label: "Total Students", value: uniqueStudents.toString(), icon: Users, color: "text-primary" },
    { label: "Active Exams", value: exams.length.toString(), icon: FileText, color: "text-accent" },
    { label: "Submissions", value: submissions.length.toString(), icon: Clock, color: "text-orange-400" },
    { label: "Avg Class Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <>
      <Helmet>
        <title>Professor Dashboard | ExamEvalAI</title>
        <meta name="description" content="Manage exams, grade submissions, and track student performance with AI assistance" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-foreground">Professor Portal</h1>
                <p className="text-xs text-muted-foreground">ExamEvalAI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                Welcome back, <span className="gradient-text-accent">Professor</span>
              </h2>
              <p className="text-muted-foreground">
                Manage your exams and review student submissions.
              </p>
            </div>
            <CreateExamDialog onSuccess={fetchData}>
              <Button variant="hero" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Exam
              </Button>
            </CreateExamDialog>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Submissions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-semibold text-foreground">Recent Submissions</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission, index) => (
                  <ExamResultDialog
                    key={index}
                    submission={submission}
                    trigger={
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{submission.student?.displayName || "Student"}</p>
                            <p className="text-sm text-muted-foreground">{submission.exam?.title || "Exam"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-lg font-bold ${submission.status === "graded" ? "gradient-text" : "text-muted-foreground"}`}>
                            {submission.totalScore}/{submission.maxScore}
                          </span>
                          {submission.status === "graded" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Button variant="glass" size="sm">Grade</Button>
                          )}
                        </div>
                      </div>
                    }
                  />
                ))}
                {submissions.length === 0 && <p className="p-4 text-muted-foreground">No submissions yet.</p>}
              </div>
            </motion.div>

            {/* Analytics Section (Conditional) */}
            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3 glass-card p-6 mt-6"
              >
                <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Class Performance</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={exams}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="title" stroke="#ffffff50" fontSize={10} />
                      <YAxis stroke="#ffffff50" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                        cursor={{ fill: '#ffffff10' }}
                      />
                      <Bar dataKey="totalQuestions" name="Questions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-xs text-muted-foreground mt-2">Note: Real average score aggregation per exam requires backend update. Showing question count for demo.</p>
                </div>
              </motion.div>
            )}

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <CreateExamDialog onSuccess={fetchData}>
                    <Button variant="glass" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exam
                    </Button>
                  </CreateExamDialog>
                  <Button variant="glass" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                  <Button variant="glass" className="w-full justify-start" onClick={() => setShowAnalytics(!showAnalytics)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {showAnalytics ? "Hide Analytics" : "View Analytics"}
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </motion.div>

              {/* Active Exams */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4">Active Exams</h3>
                <div className="space-y-4">
                  {exams.map((exam, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{exam.title}</p>
                        <span className="text-xs text-muted-foreground">{new Date(exam.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Placeholder progress for now */}
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                            style={{ width: `0%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          0 submissions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfessorDashboard;
