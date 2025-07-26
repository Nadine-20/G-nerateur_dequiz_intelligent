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
import QuizGenerator from '../components/quizgeneratorAi/QuizGenerator'
import UserListPage from '../components/Admin/ UserListPage'
import UserFormPage from '../components/Admin/UserFormPage'
import UserDetailPage from '../components/Admin/UserDetailPage'
import QuizListPage from '../components/Admin/QuizListPage'
import QuizDetailPage from '../components/Admin/QuizDetailPage'
import QuizEditPage from '../components/Admin/QuizEditPage'

function AllRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/quizzes' element={<QuizzesPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path="/teacher/quizzes/create" element={<QuizCreatorPage />} />
            <Route path="/teacher/quizzes/create/ai" element={<QuizGenerator />} />
            <Route path="/teacher/quizzes" element={<MyQuizzesPage />} />
            <Route path="/edit-quiz/:quizId" element={<EditQuizPage />} />
            <Route path="/student/dashboard" element={<DashboardStudent />} />
            <Route path="/teacher/dashboard" element={<DashboardTeacher />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:userId" element={<UserDetailPage />} />
            <Route path="/users/:userId/edit" element={<UserFormPage editMode={true} />} />
            <Route path="/admin/quizzes" element={<QuizListPage />} />
            <Route path="/quizzes/:quizId" element={<QuizDetailPage />} />
            <Route path="/quizzes/:quizId/edit" element={<QuizEditPage />} />
        </Routes>
    )
}


export default AllRoutes