const router = require('express').Router();
const Submission = require('../models/Submission');
const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
const path = require('path');

// Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("A token is required for authentication");
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

// Submit Exam
router.post('/', verifyToken, async (req, res) => {
    try {
        const { examId, answers } = req.body;
        console.log(`Receiving submission for Exam ID: ${examId}`);
        console.log(`Ref Answer count: ${answers?.length}`);

        // Prepare data for Python script
        const gradingInput = {
            questions: answers
        };

        const pythonProcess = spawn('python3', [
            path.join(__dirname, '../nlp/grader.py')
        ]);

        let resultData = '';
        let errorData = '';

        pythonProcess.stdin.write(JSON.stringify(gradingInput));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            console.log("Python stdout:", data.toString());
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error("Python stderr:", data.toString());
            errorData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code !== 0) {
                console.error('Grader Error:', errorData);
                return res.status(500).json({ message: "Grading failed" });
            }

            try {
                const gradingResult = JSON.parse(resultData);

                if (gradingResult.error) {
                    throw new Error(gradingResult.error);
                }

                const newSubmission = new Submission({
                    exam: examId,
                    student: req.user.id,
                    answers: gradingResult.results.map(r => ({
                        questionId: r.questionId,
                        answerText: answers.find(a => a._id === r.questionId)?.studentAnswer || "",
                        score: r.score,
                        feedback: r.feedback
                    })),
                    totalScore: gradingResult.totalScore,
                    maxScore: gradingResult.totalMaxScore,
                    status: 'graded'
                });

                const savedSubmission = await newSubmission.save();
                console.log("Submission SAVED to MongoDB:", savedSubmission._id);
                res.json(savedSubmission);

            } catch (e) {
                console.error("Database Save Error:", e);
                res.status(500).json({ message: "Error processing grades" });
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get User Submissions
router.get('/my', verifyToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user.id })
            .populate('exam')
            .populate('student', 'displayName email');
        res.json(submissions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Submissions (For Professor)
router.get('/', verifyToken, async (req, res) => {
    try {
        // In a real app, check role=professor here
        const submissions = await Submission.find().populate('exam', 'title subject').populate('student', 'displayName email');
        res.json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
