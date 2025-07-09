import { useState } from 'react';
import EditProfileForm from '../components/edit-profile/EditProfileForm'
import Redirect from '../components/Redirect';
function EditProfilePage() {

    const [userInfo, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!userInfo) {
        return <Redirect />;
    }

    return (
        <>
            <EditProfileForm user={userInfo} />
        </>
    )
}

export default EditProfilePage