// Test user setup for dashboard
const testUser = {
  _id: "user_001",
  firstName: "Test",
  lastName: "Student",
  email: "test@example.com",
  role: "student"
};

localStorage.setItem('userInfo', JSON.stringify(testUser));
console.log("Test user set up:", testUser);

// Check if it's stored correctly
const storedUser = localStorage.getItem('userInfo');
console.log("Stored user:", JSON.parse(storedUser));
