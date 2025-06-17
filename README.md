# 🧠 Générateur de Quiz Intelligent – Groupe A

Bienvenue dans le projet du générateur de quiz intelligent du Groupe A. Ce document vous guide pour configurer votre environnement, suivre les bonnes pratiques Git, et contribuer efficacement.

---

## 🔧 Première configuration de Git

Avant de commencer, assurez-vous de configurer votre identité Git si ce n’est pas encore fait :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

---

## 📥 Installation du projet

Pour installer et démarrer le projet en local :

```bash
git clone https://github.com/your-org/G-n-rateur-des-Quiz-Intelligent-Groupe-A-.git
cd G-n-rateur-des-Quiz-Intelligent-Groupe-A-
npm install
```

---

## 🌿 Création de votre branche

Travaillez toujours dans une branche dédiée à votre composant ou tâche. Suivez le nommage suivant :

```bash
git checkout -b components/votre-nom-composant
```

🔹 **Exemple** :
```bash
git checkout -b components/ayoub-progress-chart
```

---

## 🚦 Règles de Workflow Git

### ❌ Ne jamais committer directement sur `main`

Toutes les modifications doivent passer par une branche dédiée et une Pull Request.

---

### 🔄 Synchronisation quotidienne avec `main`

Avant de continuer le développement chaque jour, synchronisez votre branche avec les dernières modifications :

```bash
git checkout main
git pull
git checkout votre-branche
git merge main
```

---

### 🧪 Tester votre code avant de pousser

Toujours vérifier que votre code fonctionne correctement avant de le pousser :

```bash
npm run dev
```

---

## ✅ Bonnes pratiques Git

- Créez des branches claires et bien nommées.
- Écrivez des messages de commit descriptifs.
- Faites des commits atomiques (petits et précis).
- Utilisez :
  ```bash
  git push origin votre-branche
  ```
- Ouvrez une **Pull Request** pour toute fusion dans `main`.

---

## 🛠 Stack technique (à adapter si besoin)

- Frontend : React.js
- Backend : Flask
- Base de données : MongoDb

---

## 📚 Contribution

Pour toute question ou suggestion, contactez moi "ayoub ben hamada" ou ouvrez une **issue** sur GitHub.

Merci de contribuer au projet 🎉
