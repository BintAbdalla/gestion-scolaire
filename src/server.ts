import App from './app';
import DatabaseConnection from './config/database';

// Gestion des erreurs non capturées
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Erreur non capturée:', error);
  console.error('🔥 L\'application va s\'arrêter...');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('💥 Promesse rejetée non gérée à:', promise, 'raison:', reason);
  console.error('🔥 L\'application va s\'arrêter...');
  process.exit(1);
});

// Initialisation de l'application
const app = new App();

// Démarrage du serveur
app.listen();

// Gestion propre de l'arrêt
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Signal ${signal} reçu. Arrêt en cours...`);
  
  try {
    // Fermeture de la connexion à la base de données
    await DatabaseConnection.disconnect();
    console.log('✅ Connexion à la base de données fermée');
    
    console.log('✅ Arrêt propre terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
};

// Écoute des signaux d'arrêt
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); 