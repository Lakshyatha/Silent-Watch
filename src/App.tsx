import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 text-lg">Loading Silent Watch...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginPage />;
}

export default App;
