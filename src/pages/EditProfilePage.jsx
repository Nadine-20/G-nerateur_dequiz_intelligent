import EditProfileForm from '../components/edit-profile/EditProfileForm'

function EditProfilePage() {

    // api call to get user

    const userInfo = {
        userName: "test",
        firstName:"first name",
        lastName:"last name",
        email: "test@gmail.com",
        role: "Enseignant"
    }
    return (
        <>
            <EditProfileForm user={userInfo} />
        </>
    )
}

export default EditProfilePage