import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface ExamResultDialogProps {
    submission: any;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ExamResultDialog({ submission, trigger, open, onOpenChange }: ExamResultDialogProps) {
    if (!submission) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col glass-card border-none text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Exam Report: {submission.exam?.title}</DialogTitle>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Student</span>
                            <span className="font-medium">{submission.student?.displayName || submission.student?.email || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Score</span>
                            <span className="font-bold text-accent text-xl">
                                {submission.totalScore} / {submission.maxScore}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <span className="uppercase text-xs font-bold text-green-500">{submission.status}</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20 mb-4 flex gap-3">
                    <Info className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm text-accent mb-1">How AI Grading Works</h4>
                        <p className="text-xs text-muted-foreground">
                            Our NLP engine analyzes your answer using <strong>Cosine Similarity</strong> and <strong>Keyword Extraction</strong>.
                            It compares your response to the reference answer. You receive:
                            <ul className="list-disc ml-4 mt-1">
                                <li>Full marks for high semantic similarity.</li>
                                <li>Partial marks if key concepts are present but the answer is incomplete.</li>
                                <li>Feedback highlights missing concepts to help you improve.</li>
                            </ul>
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                        {submission.answers.map((answer: any, index: number) => {
                            // Try to find the original question text from the populated exam object
                            const originalQuestion = submission.exam?.questions?.find((q: any) => q._id === answer.questionId);
                            const questionText = originalQuestion?.question || answer.question || `Question ${index + 1}`;

                            const isPerfect = answer.score === (originalQuestion?.marks || 1) || answer.score >= 1; // Basic logic, adjust if needed

                            return (
                                <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-foreground text-lg">{index + 1}. {questionText}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${answer.score > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {answer.score} Marks
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-muted-foreground mb-1">Your Answer:</p>
                                        <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg border border-white/5">
                                            {answer.answerText || answer.studentAnswer || "No answer provided"}
                                        </p>
                                    </div>

                                    {answer.feedback && (
                                        <div className="flex items-start gap-2 text-sm">
                                            {answer.feedback === "Correct" || answer.feedback === "Answer is correct and complete." ? (
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
                                            )}
                                            <span className={answer.feedback.includes("Correct") ? "text-green-500" : "text-orange-400"}>
                                                Analysis: {answer.feedback}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
