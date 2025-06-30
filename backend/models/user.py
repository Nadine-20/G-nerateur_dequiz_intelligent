class User:
    def __init__(self, _id, email, password, role, firstName, lastName, image, gender):
        self._id = _id
        self.email = email
        self.password = password
        self.role = role
        self.firstName = firstName
        self.lastName = lastName
        self.image = image
        self.gender = gender

class Student(User):
    def __init__(self, _id, email, password, firstName, lastName, image, gender, quizHistory, createdAt, customQuizzes):
        super().__init__(_id, email, password, "student", firstName, lastName, image, gender)
        self.quizHistory = quizHistory
        self.createdAt = createdAt
        self.customQuizzes = customQuizzes

class Teacher(User):
    def __init__(self, _id, email, password, firstName, lastName, image, gender, specialization, createdQuizzes):
        super().__init__(_id, email, password, "teacher", firstName, lastName, image, gender)
        self.specialization = specialization
        self.createdQuizzes = createdQuizzes

class Admin(User):
    def __init__(self, _id, email, password, firstName, lastName, image, gender,platformStats):
        super().__init__(_id, email, password, "admin", firstName, lastName, image, gender)
        self.platformStats = platformStats
