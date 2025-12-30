
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CreateExamDialogProps {
    children?: React.ReactNode;
    onSuccess?: () => void;
}

export function CreateExamDialog({ children, onSuccess }: CreateExamDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState("");
    const { token } = useAuth();
    const { toast } = useToast();

    const handleCreate = async () => {
        if (!subject) {
            toast({ title: "Error", description: "Please select a subject", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            // Use port 5001 directly
            const response = await fetch(`${import.meta.env.VITE_API_URL}/exams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ subject }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create exam");
            }

            toast({
                title: "Success",
                description: "Exam generated successfully!",
            });
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Exam
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate New Exam</DialogTitle>
                    <DialogDescription>
                        Select a subject to automatically generate an exam with 10 questions (6 One-word, 4 Short-answer).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Subject
                        </Label>
                        <Select onValueChange={setSubject} value={subject}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Maths">Maths</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleCreate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Exam
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
