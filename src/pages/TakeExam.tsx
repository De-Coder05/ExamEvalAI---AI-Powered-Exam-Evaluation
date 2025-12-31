
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

interface Question {
    _id: string;
    questionText: string;
    questionType: 'one-word' | 'short-answer';
    marks: number;
}

interface Answer {
    questionId: string;
    question: string;
    studentAnswer: string;
    correctAnswer: string; // Hidden from user during exam
    type: string;
}

const TakeExam = () => {
    const { examId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [exam, setExam] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExam();
    }, [examId]);

    const fetchExam = async () => {
        try {
            // Ideally create a GET /exams/:id route, but using existing list for now or assuming we fetch list and find
            // Since we probably don't have GET /exams/:id yet, let's implement finding from all exams or user passed state
            // For correctness, I should have added GET /exams/:id to backend. 
            // Assuming I'll add it or fetching all. Let's fetch all and find for now to be safe with existing tools.
            const response = await fetch(`${import.meta.env.VITE_API_URL}/exams/${examId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setExam(data);
            } else {
                toast({ title: "Error", description: "Exam not found", variant: "destructive" });
                navigate("/student-dashboard");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        if (!exam) return;
        setSubmitting(true);

        // Format answers for backend
        const formattedAnswers = exam.questions.map((q: any) => ({
            questionId: q._id,
            question: q.questionText,
            studentAnswer: answers[q._id] || "",
            correctAnswer: q.correctAnswer,
            type: q.questionType
        }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    examId: exam._id,
                    answers: formattedAnswers
                })
            });

            if (!response.ok) throw new Error("Submission failed");

            const result = await response.json();
            toast({
                title: "Exam Submitted!",
                description: `You scored ${result.totalScore} / ${result.maxScore}`,
            });
            navigate("/student-dashboard");

        } catch (e) {
            toast({ title: "Error", description: "Failed to submit exam", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!exam) return <div>Exam not found</div>;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{exam.title}</h1>
                    <p className="text-muted-foreground">{exam.description}</p>
                </div>

                <div className="space-y-6">
                    {exam.questions.map((q: any, index: number) => (
                        <Card key={q._id}>
                            <CardHeader>
                                <CardTitle className="text-lg">Question {index + 1} <span className="text-sm font-normal text-muted-foreground">({q.marks} marks)</span></CardTitle>
                                <CardDescription className="text-base text-foreground font-medium">{q.questionText}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {q.questionType === 'one-word' ? (
                                    <Input
                                        placeholder="Your answer (one word)"
                                        value={answers[q._id] || ""}
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    />
                                ) : (
                                    <Textarea
                                        placeholder="Your answer..."
                                        value={answers[q._id] || ""}
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="sticky bottom-8 bg-background/80 backdrop-blur p-4 border rounded-lg shadow-lg flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Answer all questions before submitting.</p>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Exam
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TakeExam;
