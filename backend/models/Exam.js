const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    validTill: {
        type: Date
    },
    questions: [{
        questionText: String,
        questionType: {
            type: String,
            default: 'short-answer'
        },
        options: [String], // for multiple choice
        correctAnswer: String, // for auto-grading if applicable
        marks: {
            type: Number,
            default: 1
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exam', examSchema);
