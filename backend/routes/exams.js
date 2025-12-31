const router = require('express').Router();
const Exam = require('../models/Exam');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
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

// Create a new exam
const questionsData = require('../data/questions.json');

// Create a new exam (Auto-generated)
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log("Creating exam with body:", req.body);
        const { subject } = req.body; // Expect subject instead of manual questions

        if (!subject) {
            return res.status(400).json({ message: "Subject is required" });
        }

        // Filter questions by subject
        const subjectQuestions = questionsData.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
        console.log(`Found ${subjectQuestions.length} questions for ${subject}`);

        if (subjectQuestions.length < 10) {
            return res.status(400).json({ message: `Not enough questions for ${subject}` });
        }

        const oneWordQuestions = subjectQuestions.filter(q => q.type === 'one-word');
        const shortAnswerQuestions = subjectQuestions.filter(q => q.type === 'short-answer');

        if (oneWordQuestions.length < 6 || shortAnswerQuestions.length < 4) {
            return res.status(400).json({ message: "Insufficient question types distribution" });
        }

        // Random Selection helper
        const shuffle = (array) => array.sort(() => 0.5 - Math.random());

        const selectedOneWord = shuffle(oneWordQuestions).slice(0, 6);
        const selectedShortAnswer = shuffle(shortAnswerQuestions).slice(0, 4);

        // Combine and shuffle final set
        const examQuestions = shuffle([...selectedOneWord, ...selectedShortAnswer]);

        // Create Exam
        const newExam = new Exam({
            title: `${subject} Exam - ${new Date().toLocaleDateString()}`,
            description: `Auto-generated ${subject} exam with 10 questions.`,
            creator: req.user.id,
            subject: subject,
            questions: examQuestions.map(q => ({
                questionText: q.question,
                questionType: q.type,
                correctAnswer: q.answer,
                marks: q.type === 'one-word' ? 1 : 2
            }))
        });

        const savedExam = await newExam.save();
        res.status(201).json(savedExam);

    } catch (err) {
        console.error("Exam Creation Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get single exam by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('creator', 'displayName email');
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json(exam);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all exams
router.get('/', verifyToken, async (req, res) => {
    try {
        const exams = await Exam.find().populate('creator', 'displayName email');
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
