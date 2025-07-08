import { use, useEffect, useState } from 'react';
import EditProfileForm from '../components/edit-profile/EditProfileForm'
import { useNavigate } from 'react-router-dom';

function EditProfilePage() {

    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!userInfo) {
        return useNavigate('/login');
    }

    return (
        <>
            <EditProfileForm user={userInfo} />
        </>
    )
}

export default EditProfilePage