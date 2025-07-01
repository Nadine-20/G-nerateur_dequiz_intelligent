import { useState, useRef } from 'react';
import './editProfile.css';

function EditProfileForm({ user }) {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [previewImage, setPreviewImage] = useState(
        user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    );
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPEG, PNG, etc.)');
            return;
        }

        setFormData(prev => ({ ...prev, profilePicture: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        if (!showPasswordFields) {
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="edit-profile-container">
            <h2 className="edit-profile-title">Edit Profile</h2>
            <form className="edit-profile-form" onSubmit={handleSubmit}>
                <div className="profile-section">
                    <div className="profile-image-wrapper">
                        <div className="profile-image-container">
                            <img
                                src={previewImage}
                                alt="Profile"
                                className="profile-image"
                            />
                            <div className="profile-image-overlay">
                                <button
                                    type="button"
                                    className="change-image-btn"
                                    onClick={triggerFileInput}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                                        <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z" />
                                    </svg>
                                    Upload
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form-fields-grid">
                    <div className="form-field-group">
                        <label htmlFor="firstName" className="form-field-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="form-field-input"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="form-field-group">
                        <label htmlFor="lastName" className="form-field-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="form-field-input"
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="form-field-group">
                        <label htmlFor="email" className="form-field-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-field-input"
                            placeholder="Enter your email"
                            disabled
                        />
                    </div>
                    <div className="form-field-group">
                        <label htmlFor="role" className="form-field-label">Role</label>
                        <input
                            type="text"
                            className="form-field-input"
                            value={user?.role || 'user role'}
                            disabled
                        />
                    </div>
                </div>

                <div className="password-section">
                    <button
                        type="button"
                        className="change-password-btn"
                        onClick={togglePasswordFields}
                    >
                        {showPasswordFields ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                                </svg>
                                Hide Password Change
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                Change Password
                            </>
                        )}
                    </button>

                    {showPasswordFields && (
                        <div className="password-fields-group">
                            <div className="form-field-group">
                                <label htmlFor="currentPassword" className="form-field-label">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="form-field-input"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="newPassword" className="form-field-label">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="form-field-input"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="confirmPassword" className="form-field-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-field-input"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions-group">
                    <button type="button" className="cancel-form-btn">
                        Cancel
                    </button>
                    <button type="submit" className="submit-form-btn">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfileForm;