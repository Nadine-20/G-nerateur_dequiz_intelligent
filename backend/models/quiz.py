from datetime import datetime

# Fonction de validation pour un quiz
def validate_quiz(data):
    # Vérifier les champs requis pour le quiz
    required_fields = ["title", "description", "chapters"]
    for field in required_fields:
        if field not in data:
            return False, f"Champ manquant : {field}"
    
    # Vérifier que 'chapters' est une liste
    if not isinstance(data["chapters"], list):
        return False, "Le champ 'chapters' doit être une liste"

    # Vérification de chaque chapitre
    for chapter in data["chapters"]:
        if not isinstance(chapter, dict):
            return False, "Chaque chapitre doit être un objet"
            
        # Vérifier que chaque chapitre contient un champ 'quiz'
        quiz = chapter.get("quiz")
        if not quiz:
            return False, "Chaque chapitre doit contenir un champ 'quiz'"
        
        # Vérification des champs requis dans 'quiz'
        required_quiz_fields = ["question", "options", "answer"]
        for q_field in required_quiz_fields:
            if q_field not in quiz:
                return False, f"Le quiz doit contenir '{q_field}'"
                
        # Vérifier que les options sont une liste d'au moins 2 éléments
        if not isinstance(quiz["options"], list) or len(quiz["options"]) < 2:
            return False, "Les options doivent être une liste d'au moins 2 éléments"

    return True, ""  # Tout est valide

# Fonction de validation pour une tentative de quiz
def validate_attempt(data):
    # Vérifier les champs requis pour la tentative
    required_fields = ["userId", "quizId", "score", "totalQuestions", "answers"]
    for field in required_fields:
        if field not in data:
            return False, f"Champ manquant dans la tentative: {field}"
    
    # Vérifier que les réponses sont un objet
    if not isinstance(data["answers"], dict):
        return False, "Les réponses doivent être un objet"
    
    # Vérifier que le score est un entier et dans une plage raisonnable
    if not isinstance(data["score"], int) or data["score"] < 0:
        return False, "Le score doit être un entier positif"
    
    # Vérifier que le nombre de questions total est un entier et valide
    if not isinstance(data["totalQuestions"], int) or data["totalQuestions"] <= 0:
        return False, "Le nombre de questions total doit être un entier positif"
        
    return True, ""  # Tout est valide
