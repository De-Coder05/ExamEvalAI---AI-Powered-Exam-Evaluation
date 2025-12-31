import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
  GraduationCap,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  BookOpen,
  BarChart3,
  Play,
  Eye
} from "lucide-react";
import { ExamResultDialog } from "@/components/ExamResultDialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Exam {
  _id: string;
  title: string;
  subject: string;
  totalScore: number;
}

const StudentDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch Available Exams
      const examsRes = await fetch(`${import.meta.env.VITE_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (examsRes.ok) {
        setAvailableExams(await examsRes.json());
      }

      // Fetch My Submissions
      const subsRes = await fetch(`${import.meta.env.VITE_API_URL}/submissions/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (subsRes.ok) {
        setMySubmissions(await subsRes.json());
      }

    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || role !== "student")) {
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

  const examsTaken = mySubmissions.length;
  const avgScore = examsTaken > 0
    ? Math.round(mySubmissions.reduce((acc, sub) => acc + (sub.totalScore / sub.maxScore) * 100, 0) / examsTaken)
    : 0;
  const pendingResults = mySubmissions.filter(s => s.status === 'pending').length;
  const completedStats = examsTaken;

  const stats = [
    { label: "Exams Taken", value: examsTaken.toString(), icon: FileText, color: "text-primary" },
    { label: "Average Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-accent" },
    { label: "Pending Results", value: pendingResults.toString(), icon: Clock, color: "text-orange-400" },
    { label: "Completed", value: completedStats.toString(), icon: CheckCircle, color: "text-green-500" },
  ];



  return (
    <>
      <Helmet>
        <title>Student Dashboard | ExamEvalAI</title>
        <meta name="description" content="View your exam results, track progress, and manage your academic performance" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-foreground">Student Portal</h1>
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
            className="mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              Welcome back, <span className="gradient-text">Student</span>
            </h2>
            <p className="text-muted-foreground">
              Track your exam performance and view your results here.
            </p>
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
            {/* Recent Exams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-semibold text-foreground">Available Exams</h3>
                <Button variant="ghost" size="sm" onClick={() => document.getElementById('available-exams')?.scrollIntoView({ behavior: 'smooth' })}>
                  View All
                </Button>
              </div>
              <div id="available-exams" className="space-y-4">
                {availableExams.length === 0 && (
                  <p className="text-muted-foreground p-4">No exams available to take.</p>
                )}
                {availableExams.map((exam, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{exam.title}</p>
                        <p className="text-sm text-muted-foreground">{exam.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => navigate(`/take-exam/${exam._id}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Take Exam
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-serif font-semibold text-foreground mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="glass" className="w-full justify-start" onClick={() => document.getElementById('available-exams')?.scrollIntoView({ behavior: 'smooth' })}>
                  <FileText className="w-4 h-4 mr-2" />
                  View All Exams
                </Button>
                <Button variant="glass" className="w-full justify-start" onClick={() => setShowAnalytics(!showAnalytics)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {showAnalytics ? "Hide Analytics" : "Performance Analytics"}
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Performance Summary / My Submissions */}
              <div className="mt-8">
                <h3 className="text-lg font-serif font-semibold text-foreground mb-4">Past Results</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {mySubmissions.map((sub, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/20 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm text-foreground">{sub.examId?.title || "Exam"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-accent">{sub.totalScore}/{sub.maxScore}</span>
                        <span className="text-[10px] uppercase text-muted-foreground">{sub.status}</span>
                      </div>
                    </div>
                  ))}
                  {mySubmissions.length === 0 && <p className="text-xs text-muted-foreground">No submissions yet.</p>}
                </div>
              </div>

              {/* Analytics Graph Placeholder */}
              {showAnalytics && (
                <div className="mt-8 p-4 rounded-xl bg-accent/10 border border-accent/30">
                  <p className="text-sm text-muted-foreground mb-2">Overall Performance</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full" style={{ width: `${avgScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-accent">{avgScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {avgScore > 80 ? "Excellent work!" : avgScore > 60 ? "Good job!" : "Keep practicing!"}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;
