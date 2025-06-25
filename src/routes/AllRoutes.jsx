import { Route, Routes } from 'react-router-dom'
import EditProfilePage from '../pages/EditProfilePage'
import HomePage from '../pages/HomePage'
import QuizzesPage from '../pages/QuizzesPage'
import ForgotPassword from "../components/auth/ResetPassword/ForgotPassword"
import ResetPassword from "../components/auth/ResetPassword/ResetPassword"

function AllRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/quizzes' element={<QuizzesPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    )
}

export default AllRoutes