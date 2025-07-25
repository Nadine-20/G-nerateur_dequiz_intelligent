import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './QuizGenerator.css';

const QuizGenerator = () => {
    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [formData, setFormData] = useState({
        createdBy: userInfo ? userInfo._id : '',
        subject: '',
        topic: '',
        difficulty: 'medium',
        numQuestions: 5,
    });

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/quizzes/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate quiz');
            }

            const data = await response.json();
            setQuiz(data);
            toast.success('Quiz generated successfully!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-generator-container">
            <h1>AI Quiz Generator</h1>

            <form onSubmit={generateQuiz} className="quiz-generator-form">
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject (e.g. Biology)"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="topic"
                    placeholder="Topic (e.g. Digestive System)"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                />
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <input
                    type="number"
                    name="numQuestions"
                    value={formData.numQuestions}
                    min={1}
                    max={20}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="quiz-generator-spinner"></span>
                            Generating...
                        </>
                    ) : 'Generate Quiz'}
                </button>
            </form>

            {quiz && (
                <div className="quiz-generator-output">
                    <h2>{quiz.title}</h2>
                    <p className="quiz-generator-description">{quiz.description}</p>

                    {quiz.questions.map((q, i) => (
                        <div key={i} className="quiz-generator-question">
                            <h3>{i + 1}. {q.question}</h3>
                            <ul>
                                {q.options.map((opt, j) => (
                                    <li
                                        key={j}
                                        className={opt === q.correctAnswer ? 'correct' : ''}
                                    >
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                            <p className="quiz-generator-explanation">
                                <strong>Explanation:</strong> {q.explanation}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;