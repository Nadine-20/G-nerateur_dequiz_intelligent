// Home.jsx
import { FaGraduationCap, FaChartLine, FaBook, FaTasks } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Transformez votre apprentissage</h1>
          <p>
            Découvrez une nouvelle façon d'apprendre avec notre plateforme de quiz intelligente.
            Personnalisée, interactive et conçue pour maximiser votre réussite.
          </p>
          <a href="/quiz" className="cta-button">Commencer maintenant</a>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaGraduationCap />
            </div>
            <h3>Quiz adaptatifs</h3>
            <p>
              Des questions qui s'ajustent à votre niveau pour un apprentissage optimal
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Progression détaillée</h3>
            <p>
              Suivez vos performances avec des statistiques et analyses complètes
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaBook />
            </div>
            <h3>Révision ciblée</h3>
            <p>
              Concentrez-vous sur vos points faibles avec notre système de révision intelligente
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaTasks />
            </div>
            <h3>Parcours personnalisés</h3>
            <p>
              Créez ou choisissez des parcours d'apprentissage adaptés à vos objectifs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}