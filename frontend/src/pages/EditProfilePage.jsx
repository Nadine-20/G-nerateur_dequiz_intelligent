import EditProfileForm from '../components/edit-profile/EditProfileForm'

function EditProfilePage() {

    // api call to get user

    const userInfo = {
        userName: "test",
        firstName: "first name",
        lastName: "last name",
        email: "student1@example.com",
        role: "student"
    }
    return (
        <>
            <EditProfileForm user={userInfo} />
        </>
    )
}

export default EditProfilePage