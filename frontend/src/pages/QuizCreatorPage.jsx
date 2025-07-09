import { useState } from 'react';
import QuizCreator from '../components/QuizCreator/QuizCreator'

function QuizCreatorPage() {

    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!userInfo) {
        return <Redirect />;
    }

    if (userInfo.role !== 'teacher') {
        return <h3>You must be a teacher to create quizzes</h3>;
    }
    return (
        <QuizCreator />
    )
}

export default QuizCreatorPage