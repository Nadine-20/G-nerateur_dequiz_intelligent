import { Route, Routes } from 'react-router-dom'
import EditProfilePage from '../pages/EditProfilePage'
import HomePage from '../pages/HomePage'
import QuizzesPage from '../pages/QuizzesPage'
import { ResetPassword, ForgotPassword } from '../components/auth/ResetPassword'
import QuizCreatorPage from '../pages/QuizCreatorPage'
import DashboardStudent from '../components/DashboardSuivProgresionApprenan/Dashboard'
import DashboardTeacher from '../components/interface_enseignant/dashboard'
import Login from '../components/auth/login/Login'
import SignUp from '../components/auth/register/SignUp'
import MyQuizzesPage from '../pages/MyQuizzesPage'
import EditQuizPage from '../pages/EditQuizPage'

function AllRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/quizzes' element={<QuizzesPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path="/teacher/quizzes/create" element={<QuizCreatorPage />} />
            <Route path="/teacher/quizzes" element={<MyQuizzesPage />} />
            <Route path="/edit-quiz/:quizId" element={<EditQuizPage />} />
            <Route path="/student/dashboard" element={<DashboardStudent />} />
            <Route path="/teacher/dashboard" element={<DashboardTeacher />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
        </Routes>
    )
}


export default AllRoutes