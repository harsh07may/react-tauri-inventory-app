import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getDb } from '../db';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const db = await getDb();
      // NOTE: In a real production app, passwords should be securely hashed and salted.
      // For this local SQLite Desktop MVP, we are doing a direct comparison per spec.
      const users = await db.select<{id: string, username: string, role: 'admin' | 'staff'}[]>(
        "SELECT id, username, role FROM users WHERE username = $1 AND password_hash = $2",
        [username, password]
      );

      if (users.length > 0) {
        login(users[0]);
        toast.success(`Welcome back, ${users[0].username}!`);
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Database connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg transform rotate-3 mb-6">
          <User size={32} />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          ShopManager Pro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="block w-full pl-10 h-12 sm:text-sm border-slate-300 rounded-lg bg-slate-50 border focus:ring-primary focus:border-primary transition-colors text-slate-900"
                  placeholder="e.g. admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 h-12 sm:text-sm border-slate-300 rounded-lg bg-slate-50 border focus:ring-primary focus:border-primary transition-colors text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                <span className="font-medium text-slate-500">Default login: admin / admin</span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
