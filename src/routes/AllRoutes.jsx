import { Route, Routes } from 'react-router-dom'
import EditProfilePage from '../pages/EditProfilePage'
import HomePage from '../pages/HomePage'
import QuizzesPage from '../pages/QuizzesPage'
import { ResetPassword, ForgotPassword } from '../components/auth/ResetPassword'
import QuizCreatorPage from '../pages/QuizCreatorPage'
import Dashboard from '../components/DashboardSuivProgresionApprenan/Dashboard'

function AllRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/quizzes' element={<QuizzesPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path="/teacher/quizzes/create" element={<QuizCreatorPage />} />
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    )
}

export default AllRoutes