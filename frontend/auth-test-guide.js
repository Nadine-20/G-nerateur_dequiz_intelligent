// How to test the user authentication system:

// 1. Login through the frontend login form
// 2. The login will save userInfo to localStorage with the actual user ID
// 3. The dashboard will use that user ID to fetch progress data
// 4. Quiz results will be saved to the correct user account

// To test with a mock user (for development purposes):
const mockUser = {
  "_id": "675a1b2c3d4e5f6789abcdef", // Real MongoDB ObjectId format
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "role": "student"
};

// Uncomment the line below to set a mock user for testing:
// localStorage.setItem('userInfo', JSON.stringify(mockUser));

console.log("Current user in localStorage:", localStorage.getItem('userInfo'));

// To clear user data:
// localStorage.removeItem('userInfo');
