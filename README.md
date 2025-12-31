# ExamEvalAI

**ExamEvalAI** is a modern, AI-powered platform designed to streamline the exam creation, taking, and grading process. By leveraging Natural Language Processing (NLP), we provide instant, intelligent feedback and grading for descriptive answers, saving professors time and giving students immediate insights.

## Features

- **For Professors:**
    - **One-Click Exam Creation (AI)**: Generate exams instantly from a subject topic using our Question Bank.
    - **Automated Grading**: Accurate scoring using NLP (Cosine Similarity & Keyword Extraction).
    - **Analytics**: Visualize class performance with interactive charts.
    - **Real-Time Dashboard**: See submissions as they happen.

- **For Students:**
    - **Take Exams Online**: Clean, distraction-free interface.
    - **Instant Results**: Receive score and detailed per-question feedback immediately.
    - **Performance Tracking**: View progress charts and past exam history.
    - **Secure Auth**: Google OAuth & Email/Password login.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, shadcn/ui, Recharts, Famer Motion.
- **Backend**: Node.js, Express, MongoDB.
- **AI/NLP**: Python (Flask/Script), NLTK, Scikit-Learn.
- **Deployment**: Vercel (Frontend) + Render (Backend/Python).

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    cd backend && npm install && pip install -r requirements.txt
    ```
3.  Set up Environment Variables (`.env`).
4.  Run locally:
    ```bash
    # Terminal 1 (Frontend)
    npm run dev

    # Terminal 2 (Backend)
    cd backend && npm start
    ```

## Deployment

- **Frontend**: Vercel
- **Backend**: Render

---
Built with ❤️ by [Your Name/Team]
