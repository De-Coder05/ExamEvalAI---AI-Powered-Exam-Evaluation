
import sys
import json
import nltk
import re
import string
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)

class ExamEvaluator:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.lemmatizer = WordNetLemmatizer()
        self.short_answer_threshold = 0.7
        self.min_answer_length = 3

    def preprocess_text(self, text):
        if not isinstance(text, str):
            return ""
        try:
            text = text.lower()
            text = re.sub(f'[{string.punctuation}]', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        except:
            return ""

    def evaluate_one_word(self, correct_answer, student_answer):
        correct_answer = str(correct_answer).strip().lower()
        student_answer = str(student_answer).strip().lower()
        correct_answer = re.sub(f'[{string.punctuation}]', '', correct_answer)
        student_answer = re.sub(f'[{string.punctuation}]', '', student_answer)
        correct_lemma = self.lemmatizer.lemmatize(correct_answer)
        student_lemma = self.lemmatizer.lemmatize(student_answer)
        
        if student_answer == correct_answer or student_lemma == correct_lemma:
            return 1.0, "Correct"
        
        # Levenshtein distance for minor spelling errors
        if self.levenshtein_distance(correct_answer, student_answer) <= 1:
            return 0.5, "Partially correct (minor spelling error)"
            
        return 0.0, f"Incorrect. The correct answer is: {correct_answer}"

    def levenshtein_distance(self, s1, s2):
        if len(s1) < len(s2):
            return self.levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def evaluate_short_answer(self, correct_answer, student_answer):
        if not isinstance(correct_answer, str) or not isinstance(student_answer, str):
            return 0.0, "Invalid answer format"
        if len(student_answer.strip()) < self.min_answer_length:
            return 0.0, "Answer too short to evaluate"
            
        processed_correct = self.preprocess_text(correct_answer)
        processed_student = self.preprocess_text(student_answer)
        
        if not processed_student:
             return 0.0, "No answer provided."

        try:
            if not processed_correct or not processed_student:
                return 0.0, "Could not evaluate answer"
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([processed_correct, processed_student])
            similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except ValueError:
            similarity_score = self.fallback_similarity(processed_correct, processed_student)
        except:
             similarity_score = 0.0

        feedback = self.generate_feedback(processed_correct, processed_student, similarity_score)
        
        if similarity_score >= 0.8:  
            numeric_score = 2.0
        elif similarity_score >= 0.6:   
            numeric_score = 1.5  
        elif similarity_score >= 0.4:  
            numeric_score = 1.0
        elif similarity_score >= 0.2:  
            numeric_score = 0.5
        else:                         
            numeric_score = 0.0
            
        return numeric_score, feedback

    def fallback_similarity(self, text1, text2):
        tokens1 = set(word_tokenize(text1))
        tokens2 = set(word_tokenize(text2))
        tokens1 = {w for w in tokens1 if w not in self.stop_words}
        tokens2 = {w for w in tokens2 if w not in self.stop_words}
        if not tokens1 or not tokens2:
            return 0.0
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        return len(intersection) / len(union)

    def generate_feedback(self, correct_answer, student_answer, similarity_score):
        if similarity_score >= self.short_answer_threshold:
            return "Answer is correct and complete."
        
        correct_tokens = word_tokenize(correct_answer)
        student_tokens = word_tokenize(student_answer)
        
        correct_keywords = [w for w in correct_tokens if w not in self.stop_words and len(w) > 2]
        student_keywords = [w for w in student_tokens if w not in self.stop_words and len(w) > 2]
        
        missing_keywords = [word for word in correct_keywords if word not in student_keywords]
        
        if missing_keywords:
            return f"Missing important concepts: {', '.join(missing_keywords[:5])}" + ("..." if len(missing_keywords) > 5 else "")
        else:
            return "The answer lacks detail or accuracy. Review the topic again."

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
             print(json.dumps({"error": "No input provided"}))
             return

        data = json.loads(input_data)
        # sys.stderr.write(f"Received data: {json.dumps(data)[:100]}...\n") 
        questions = data.get('questions', [])
        
        evaluator = ExamEvaluator()
        results = []
        total_score = 0
        total_max_score = 0

        for q in questions:
            q_type = q.get('type', 'short-answer')
            correct = q.get('correctAnswer', '')
            student = q.get('studentAnswer', '')
            
            if q_type == 'one-word':
                score, feedback = evaluator.evaluate_one_word(correct, student)
                max_score = 1.0
            else:
                score, feedback = evaluator.evaluate_short_answer(correct, student)
                max_score = 2.0
            
            total_score += score
            total_max_score += max_score
            
            results.append({
                'questionId': q.get('_id'),
                'question': q.get('question'),
                'score': score,
                'maxScore': max_score,
                'feedback': feedback
            })

        output = {
            'results': results,
            'totalScore': total_score,
            'totalMaxScore': total_max_score
        }
        
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
