import './Home.css';

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="left">
          <h1>Bonjour</h1>
          <p>
            Bienvenue dans votre plateforme de quiz intelligent.
            
          </p>
        </div>

        <div className="right">
          <div className="card">
            <h3>Répondre aux quiz</h3>
            <p>Participez à des quiz adaptés à votre niveau.</p>
          </div>
          <div className="card">
            <h3>Suivre ma progression</h3>
            <p>Visualisez vos résultats et vos statistiques.</p>
          </div>
          <div className="card">
            <h3>Accéder au mode révision</h3>
            <p>Revoir les questions précédemment échouées.</p>
          </div>
          <div className="card">
            <h3>Choisir un quiz</h3>
            <p>Par thème, difficulté ou personnalisé.</p>
          </div>
        </div>
      </div>
    </>
  );
}
