import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Brain, LayoutDashboard, FileText, Share2, ShieldCheck, Activity,
  LogOut, Upload, MessageSquare, AlertTriangle,
  ArrowRight, CheckCircle2, ChevronRight, Clock, Sparkles, User as UserIcon
} from 'lucide-react';
import api from './services/api';

// Types
interface User {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Brain className="h-12 w-12 animate-pulse text-warningYellow" />
          <p className="text-sm font-medium tracking-wide text-slate-400">Loading Industrial Intel...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage user={user} />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard/*" 
          element={user ? <DashboardLayout user={user} setUser={setUser} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

// ==========================================
// 1. LANDING PAGE
// ==========================================
function LandingPage({ user }: { user: User | null }) {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-warningYellow to-hazardOrange rounded-lg shadow-lg">
            <Brain className="h-6 w-6 text-slate-950" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            INDUSTRIAL BRAIN AI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 text-sm font-bold bg-warningYellow text-slate-950 rounded-lg hover:bg-warningYellow/90 transition-all shadow-md">
              Enter Platform
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold hover:text-white text-slate-400 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all border border-slate-700">
                Register Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 md:px-12 flex flex-col items-center text-center max-w-6xl mx-auto flex-1 justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warningYellow/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-hazardOrange/5 rounded-full blur-[120px] -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-warningYellow mb-6 shadow-inner">
          <Sparkles className="h-3.5 w-3.5" /> Hackathon Edition - 100% Free Tier Platform
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-8 max-w-4xl">
          Unified Asset & Operations <br />
          <span className="bg-gradient-to-r from-warningYellow via-hazardOrange to-warningYellow bg-clip-text text-transparent">
            Intelligence Platform
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mb-12 font-medium leading-relaxed">
          Ingest drawings, SOPs, safety logs, and spreadsheets. Use AI-powered OCR, conversational RAG, and an interactive Neo4j Knowledge Graph to monitor failures, identify regulatory gaps, and safeguard operations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold bg-gradient-to-r from-warningYellow to-hazardOrange text-slate-950 rounded-xl hover:shadow-warningYellow/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Start Free Now <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 rounded-xl transition-all">
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-slate-900 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold mb-4">Enterprise AI Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Engineered to resolve data fragmentation in asset-heavy industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
            <div className="h-12 w-12 bg-warningYellow/10 rounded-xl flex items-center justify-center text-warningYellow mb-6 border border-warningYellow/20">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">AI OCR Ingestion</h3>
            <p className="text-slate-450 text-sm leading-relaxed">
              Auto-extract structured details from scanned datasheets, P&ID drawings, forms, and manuals using Apache Tika.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
            <div className="h-12 w-12 bg-hazardOrange/10 rounded-xl flex items-center justify-center text-hazardOrange mb-6 border border-hazardOrange/20">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Neo4j Knowledge Graph</h3>
            <p className="text-slate-450 text-sm leading-relaxed">
              Trace logical relationships between equipment, inspections, safety warnings, safety standards, and technician assignments.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
            <div className="h-12 w-12 bg-safetyGreen/10 rounded-xl flex items-center justify-center text-safetyGreen mb-6 border border-safetyGreen/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Compliance Audits</h3>
            <p className="text-slate-450 text-sm leading-relaxed">
              Automated compliance reviews against regulations (OSHA, ISO). Calculate scores and pinpoint compliance deficiencies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950 mt-auto text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-warningYellow" />
            <span className="font-bold text-slate-350">Industrial Brain AI</span>
          </div>
          <div>
            &copy; 2026 Industrial Brain AI. Created for Global Hackathon. 100% Free Tier Stack.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 2. LOGIN PAGE
// ==========================================
function LoginPage({ user, setUser }: { user: User | null; setUser: (u: User) => void }) {
  const [username, setUsername] = useState('engineer@industrial.com');
  const [password, setPassword] = useState('engineer123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 font-sans relative">
      <div className="absolute w-80 h-80 bg-warningYellow/5 rounded-full blur-[80px] top-10 right-10 -z-10" />
      <div className="absolute w-80 h-80 bg-hazardOrange/5 rounded-full blur-[80px] bottom-10 left-10 -z-10" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-warningYellow to-hazardOrange rounded-lg">
              <Brain className="h-6 w-6 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg text-white">INDUSTRIAL BRAIN</span>
          </Link>
          <h2 className="text-xl font-extrabold text-white">Sign In to Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Access asset telemetry and AI Copilot</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-900 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corporate Email</label>
            <input 
              type="email" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-warningYellow/50 transition-colors"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-warningYellow/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-warningYellow to-hazardOrange hover:shadow-lg hover:shadow-warningYellow/10 text-slate-950 font-bold rounded-lg transition-all duration-200 mt-4 disabled:opacity-50 text-sm"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account? <Link to="/register" className="text-warningYellow hover:underline font-semibold">Register here</Link>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <p className="text-[10px] text-center uppercase tracking-widest text-slate-500 font-bold mb-3">Quick Demo Profiles</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
            <button 
              onClick={() => { setUsername('engineer@industrial.com'); setPassword('engineer123'); }}
              className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800/50 rounded text-left hover:text-white transition-colors"
            >
              👷 Engineer <br />
              <span className="text-slate-500">engineer@industrial.com</span>
            </button>
            <button 
              onClick={() => { setUsername('safety@industrial.com'); setPassword('safety123'); }}
              className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800/50 rounded text-left hover:text-white transition-colors"
            >
              🦺 Safety Officer <br />
              <span className="text-slate-500">safety@industrial.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. REGISTER PAGE
// ==========================================
function RegisterPage({ user }: { user: User | null }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('ENGINEER');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/auth/register', { username, password, firstName, lastName, role });
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please review values.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 font-sans relative">
      <div className="absolute w-80 h-80 bg-warningYellow/5 rounded-full blur-[80px] top-10 right-10 -z-10" />
      <div className="absolute w-80 h-80 bg-hazardOrange/5 rounded-full blur-[80px] bottom-10 left-10 -z-10" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-warningYellow to-hazardOrange rounded-lg">
              <Brain className="h-6 w-6 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg text-white">INDUSTRIAL BRAIN</span>
          </Link>
          <h2 className="text-xl font-extrabold text-white">Create Workspace Account</h2>
          <p className="text-xs text-slate-400 mt-1">Get started with free-tier access</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-900 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-900 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
              <input 
                type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-warningYellow/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
              <input 
                type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-warningYellow/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corporate Email</label>
            <input 
              type="email" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-warningYellow/50"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-warningYellow/50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Role</label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-warningYellow/50 cursor-pointer"
            >
              <option value="ENGINEER">Engineer / Technician</option>
              <option value="SAFETY_OFFICER">Safety Officer</option>
              <option value="AUDITOR">Auditor</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <button 
            type="submit" disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-warningYellow to-hazardOrange hover:shadow-lg hover:shadow-warningYellow/10 text-slate-950 font-bold rounded-lg transition-all duration-200 mt-4 disabled:opacity-50 text-sm"
          >
            {submitting ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account? <Link to="/login" className="text-warningYellow hover:underline font-semibold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. DASHBOARD LAYOUT & PANELS
// ==========================================
function DashboardLayout({ user, setUser }: { user: User; setUser: (u: User | null) => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/documents', label: 'Document Hub', icon: FileText },
    { path: '/dashboard/copilot', label: 'AI Copilot', icon: MessageSquare },
    { path: '/dashboard/graph', label: 'Knowledge Graph', icon: Share2 },
    { path: '/dashboard/analytics', label: 'Operations & Analytics', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/90 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-slate-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-warningYellow to-hazardOrange rounded">
            <Brain className="h-5 w-5 text-slate-950" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">INDUSTRIAL BRAIN</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-warningYellow/10 text-warningYellow border-l-2 border-warningYellow' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/60 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.firstName} {user.lastName}</p>
              <span className="inline-block text-[9px] uppercase tracking-wider text-warningYellow font-bold bg-warningYellow/15 px-1.5 py-0.5 rounded mt-0.5">
                {user.role}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-2 bg-slate-900 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/40 text-slate-400 hover:text-red-400 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 pl-64 min-h-screen bg-slate-950 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-900/60 bg-slate-950/60 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {navItems.find(item => item.path === location.pathname)?.label || 'Console'}
          </h2>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span>Plant Status:</span>
            <span className="flex items-center gap-1.5 text-safetyGreen font-bold bg-safetyGreen/10 px-2.5 py-1 rounded-full border border-safetyGreen/20">
              <span className="w-1.5 h-1.5 rounded-full bg-safetyGreen animate-pulse" /> NORMAL OPERATIONS
            </span>
          </div>
        </header>

        <div className="p-8 flex-1">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/documents" element={<DocumentHubView />} />
            <Route path="/copilot" element={<AiCopilotView />} />
            <Route path="/graph" element={<KnowledgeGraphView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 5. DASHBOARD MAIN VIEW
// ==========================================
function DashboardView() {
  const [stats, setStats] = useState({ docs: 0, assets: 0, compliance: 100, incidents: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, assetsRes, compRes, incRes] = await Promise.all([
          api.get('/documents'),
          api.get('/assets'),
          api.get('/intelligence/compliance'),
          api.get('/incidents')
        ]);

        setStats({
          docs: docsRes.data.length,
          assets: assetsRes.data.length,
          compliance: compRes.data.overallScore || 100,
          incidents: incRes.data.filter((i: any) => i.status === 'OPEN').length
        });

        // Set up recent activities
        const activities: string[] = [];
        docsRes.data.slice(0, 2).forEach((d: any) => activities.push(`Document '${d.fileName}' processed via OCR pipeline.`));
        assetsRes.data.slice(0, 2).forEach((a: any) => activities.push(`Equipment registered: ${a.name} (${a.tag}).`));
        incRes.data.slice(0, 2).forEach((i: any) => activities.push(`Safety alert logged: ${i.description.substring(0, 40)}...`));
        setRecentActivities(activities.length ? activities : ['System initialized successfully.']);

      } catch (err) {
        // Fallback dummy metrics for demo
        setStats({ docs: 2, assets: 3, compliance: 92.5, incidents: 2 });
        setRecentActivities([
          "Document 'SOP-SAF-042_Gas_Leak_Protocol.txt' processed via OCR pipeline.",
          "Equipment registered: Centrifugal Water Pump (P-101).",
          "Safety alert logged: High bear temperature alert on P-101.",
          "Compliance Audit run completed: ISO/OSHA gap score 92.5%"
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-400 text-sm font-medium">Computing telemetry indicators...</div>;

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Telemetry Documents</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-white">{stats.docs}</span>
            <FileText className="h-5 w-5 text-warningYellow/80" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Tracked Assets</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-white">{stats.assets}</span>
            <Activity className="h-5 w-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Compliance Index</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-white">{stats.compliance}%</span>
            <ShieldCheck className="h-5 w-5 text-safetyGreen/80" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-lg">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Active Hazards</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-white">{stats.incidents}</span>
            <AlertTriangle className="h-5 w-5 text-hazardOrange/80" />
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent logs */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="h-4 w-4 text-warningYellow" /> Operations Activity Log
          </h3>
          <div className="space-y-4 flex-1">
            {recentActivities.map((act, index) => (
              <div key={index} className="flex gap-4 items-start text-sm border-b border-slate-900/60 pb-3 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-warningYellow mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">{act}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warningYellow/5 rounded-full blur-2xl" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-warningYellow" />
              <span className="text-xs font-black uppercase tracking-wider text-warningYellow">Engine Insights</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-semibold">
              "Pump P-101 vibration levels have triggered a minor hazard alert. Bearings logged at 78°C. RAG engine recommends lubricating bearings immediately to stay below the 82°C safety threshold limit."
            </p>
          </div>
          <Link to="/dashboard/copilot" className="mt-8 flex items-center gap-2 text-xs font-bold text-warningYellow hover:underline">
            Consult Copilot Engine <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. DOCUMENT HUB VIEW (UPLOAD & OCR)
// ==========================================
function DocumentHubView() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState('Operations');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocs = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      // Mock documents
      setDocuments([
        { id: 1, fileName: 'SOP-SAF-042_Gas_Leak_Protocol.txt', fileType: 'TXT', status: 'PROCESSED', department: 'Safety', createdAt: '2026-06-23T18:00:00' },
        { id: 2, fileName: 'P101_Intake_Pump_Manual.txt', fileType: 'TXT', status: 'PROCESSED', department: 'Operations', createdAt: '2026-06-23T18:05:00' }
      ]);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchDocs();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to process document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Upload Form */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between h-fit">
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Upload className="h-4 w-4 text-warningYellow" /> Ingest Document
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-900 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-warningYellow/40 transition-colors bg-slate-950/30">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <FileText className="h-8 w-8 text-slate-500 mb-3" />
                <span className="text-xs font-bold text-slate-350 hover:text-white">
                  {file ? file.name : 'Select document file'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">PDF, DOCX, TXT, PNG, JPG</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Department</label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
              >
                <option value="Operations">Operations</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Safety">Safety</option>
                <option value="Regulatory">Regulatory</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={uploading || !file}
              className="w-full py-3 bg-warningYellow text-slate-950 font-bold rounded-lg transition-all hover:bg-warningYellow/90 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {uploading ? 'Processing OCR Pipeline...' : 'Process Document'}
            </button>
          </form>
        </div>
      </div>

      {/* Document Logs */}
      <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 min-h-[400px]">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6">Ingested Knowledge Directory</h3>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-warningYellow">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{doc.fileName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400">{doc.department}</span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-[10px] text-slate-500">{doc.fileType}</span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                doc.status === 'PROCESSED' 
                  ? 'bg-safetyGreen/10 text-safetyGreen' 
                  : doc.status === 'ERROR' 
                    ? 'bg-red-950/30 text-red-400' 
                    : 'bg-slate-900 text-slate-400 animate-pulse'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. AI COPILOT VIEW (RAG CHAT)
// ==========================================
function AiCopilotView() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: "Hello! I am your operations Copilot. Ingest engineering documents, inspection logs, and safety SOPs in the Document Hub, then query me for details like: 'What maintenance was performed on Pump P101?' or 'What is the compliance standard for gas leaks?'" }
  ]);
  const [asking, setAsking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setAsking(true);

    try {
      const res = await api.post('/chat/ask', { query: userMsg });
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: res.data.answer,
        citations: res.data.citations,
        confidence: res.data.confidenceScore
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: "Connection to RAG service failed. Re-run local server profile checks.",
      }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
      {/* Chat pane */}
      <div className="md:col-span-3 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col h-full overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black ${
                msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-warningYellow text-slate-950'
              }`}>
                {msg.role === 'user' ? 'ME' : 'AI'}
              </div>
              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-slate-900 text-slate-100' : 'bg-slate-950/50 border border-slate-800 text-slate-200'
              }`}>
                <p className="whitespace-pre-line font-medium">{msg.text}</p>
                {msg.confidence !== undefined && (
                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Engine confidence: <span className="text-warningYellow">{(msg.confidence * 100).toFixed(1)}%</span></span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {asking && (
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-lg bg-warningYellow text-slate-950 flex items-center justify-center text-xs font-black animate-pulse">
                AI
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs font-bold animate-pulse">
                Analyzing knowledge chunks and generating expert citation details...
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-900 bg-slate-950/40 flex gap-4">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-warningYellow/50"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-warningYellow hover:bg-warningYellow/90 text-slate-950 font-bold rounded-lg text-sm"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Citations Pane */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 h-full overflow-y-auto">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Source Citations</h3>
        <div className="space-y-4">
          {messages[messages.length - 1]?.citations?.map((cit: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <h4 className="text-xs font-extrabold text-white mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-warningYellow" /> {cit.fileName}
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed italic mt-2">
                "{cit.snippet.substring(0, 150)}..."
              </p>
              <div className="mt-3 text-[9px] font-bold text-slate-500 flex justify-between">
                <span>Confidence:</span>
                <span className="text-safetyGreen">{(cit.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          )) || <p className="text-xs text-slate-550 italic">No citations loaded for current view context.</p>}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. KNOWLEDGE GRAPH VIEW (NEO4J VIS)
// ==========================================
function KnowledgeGraphView() {
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await api.get('/graph');
        setGraphData(res.data);
      } catch (err) {
        // Fallback mock graph
        setGraphData({
          nodes: [
            { id: 'asset_P101', label: 'Asset', name: 'Pump P101', details: 'Pump - Water Intake' },
            { id: 'asset_B12', label: 'Asset', name: 'Boiler B12', details: 'Boiler - High Pressure Steam' },
            { id: 'dept_Ops', label: 'Department', name: 'Operations', details: 'Main plant operations' },
            { id: 'emp_John', label: 'User', name: 'John Doe (Eng)', details: 'Senior Mechanical Technician' },
            { id: 'reg_OSHA_PV', label: 'Regulation', name: 'OSHA 1910.111', details: 'Pressure Vessel Safety Standards' },
            { id: 'inc_1', label: 'Incident', name: 'Inc-102: Flange Corrosion', details: 'Boiler B12 corrosion leak risk' }
          ],
          edges: [
            { from: 'asset_P101', to: 'dept_Ops', label: 'BELONGS_TO' },
            { from: 'asset_B12', to: 'dept_Ops', label: 'BELONGS_TO' },
            { from: 'emp_John', to: 'asset_P101', label: 'MAINTAINS' },
            { from: 'inc_1', to: 'asset_B12', label: 'OCCURRED_ON' },
            { from: 'inc_1', to: 'reg_OSHA_PV', label: 'VIOLATES' }
          ]
        });
      }
    };
    fetchGraph();
  }, []);

  const getNodeColor = (label: string) => {
    switch (label) {
      case 'Asset': return 'bg-indigo-950 text-indigo-300 border-indigo-500/50';
      case 'User': return 'bg-slate-900 text-slate-350 border-slate-700/50';
      case 'Department': return 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
      case 'Incident': return 'bg-red-950/40 text-red-400 border-red-900/50';
      case 'Regulation': return 'bg-amber-950 text-amber-300 border-amber-500/50';
      default: return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
      {/* Graph Visualizer Canvas Area */}
      <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between overflow-hidden relative">
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">Industrial Operations Graph</h3>
          <p className="text-xs text-slate-400">Interactive representation of asset dependencies and incident logs</p>
        </div>

        {/* Visual Simulated Graph Render */}
        <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl my-6 relative overflow-hidden flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
          
          <div className="grid grid-cols-3 gap-12 w-full max-w-2xl relative z-10">
            {graphData.nodes.map((node: any) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all ${
                  selectedNode?.id === node.id ? 'scale-105 ring-2 ring-warningYellow' : ''
                } ${getNodeColor(node.label)}`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider opacity-60">{node.label}</div>
                <div className="text-xs font-bold leading-tight">{node.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-medium">Click on any node above to drill down into relationship properties.</div>
      </div>

      {/* Node Details Pane */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 h-full overflow-y-auto">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Metadata Inspector</h3>
        {selectedNode ? (
          <div className="space-y-6">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-warningYellow bg-warningYellow/15 px-2 py-0.5 rounded">
                {selectedNode.label}
              </span>
              <h4 className="text-lg font-black text-white mt-3 leading-tight">{selectedNode.name}</h4>
              <p className="text-xs text-slate-400 mt-2">{selectedNode.details}</p>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">Direct Connections</h5>
              <div className="space-y-2">
                {graphData.edges
                  .filter((e: any) => e.from === selectedNode.id || e.to === selectedNode.id)
                  .map((edge: any, index: number) => {
                    const isFrom = edge.from === selectedNode.id;
                    const connectedNodeId = isFrom ? edge.to : edge.from;
                    const connectedNode = graphData.nodes.find((n: any) => n.id === connectedNodeId);
                    return (
                      <div key={index} className="p-3 rounded-lg bg-slate-950/40 border border-slate-850/50 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-350">{connectedNode?.name || connectedNodeId}</span>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                          {edge.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-550 italic">Select a node in the graph viewer to inspect properties and connections.</p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 9. ANALYTICS & INTELLIGENCE VIEW
// ==========================================
function AnalyticsView() {
  const [tab, setTab] = useState<'maintenance' | 'compliance' | 'incidents'>('maintenance');
  const [maintSchedule, setMaintSchedule] = useState<any[]>([]);
  const [compReport, setCompReport] = useState<any>({ detectedGaps: [] });
  const [incAnalysis, setIncAnalysis] = useState<any>({ detectedPatterns: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [maintRes, compRes, incRes] = await Promise.all([
          api.get('/intelligence/maintenance/schedule'),
          api.get('/intelligence/compliance'),
          api.get('/intelligence/incidents')
        ]);
        setMaintSchedule(maintRes.data);
        setCompReport(compRes.data);
        setIncAnalysis(incRes.data);
      } catch (err) {
        // Mock fallback data
        setMaintSchedule([
          { assetTag: 'P-101', assetName: 'Water Pump', lastService: '2026-03-15', nextDue: '2026-06-13', daysRemaining: -11, urgency: 'OVERDUE', recommendedAction: 'IMMEDIATE SHUTDOWN & calibration and bearing check required.' },
          { assetTag: 'B-12', assetName: 'High Pressure Boiler', lastService: '2026-06-10', nextDue: '2026-12-07', daysRemaining: 166, urgency: 'NORMAL', recommendedAction: 'Conduct ultrasound wall thickness scanning.' }
        ]);
        setCompReport({
          overallScore: 92.5,
          status: 'COMPLIANT_WITH_RISKS',
          detectedGaps: [
            { id: 'GAP_1', severity: 'HIGH', regulation: 'OSHA 1910.119', description: 'Critical safety incident open on B-12 casing flange rust.' },
            { id: 'GAP_2', severity: 'HIGH', regulation: 'ISO 9001', description: 'Asset P-101 predictive maintenance overdue by 11 days.' }
          ]
        });
        setIncAnalysis({
          detectedPatterns: [
            { patternType: 'RECURRING_ASSET_INSTABILITY', assetTag: 'B-12', severity: 'HIGH', details: 'Multiple failures/near-misses reported for asset B-12.', preventiveAction: 'Conduct casing teardown scan.' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-slate-400 text-sm font-medium">Running diagnostics algorithms...</div>;

  return (
    <div className="space-y-8">
      {/* Tab Switchers */}
      <div className="flex border-b border-slate-900 pb-px">
        <button
          onClick={() => setTab('maintenance')}
          className={`px-6 py-3 border-b-2 text-sm font-bold transition-all ${
            tab === 'maintenance' ? 'border-warningYellow text-warningYellow' : 'border-transparent text-slate-450 hover:text-white'
          }`}
        >
          Predictive Maintenance
        </button>
        <button
          onClick={() => setTab('compliance')}
          className={`px-6 py-3 border-b-2 text-sm font-bold transition-all ${
            tab === 'compliance' ? 'border-warningYellow text-warningYellow' : 'border-transparent text-slate-450 hover:text-white'
          }`}
        >
          Compliance Auditing
        </button>
        <button
          onClick={() => setTab('incidents')}
          className={`px-6 py-3 border-b-2 text-sm font-bold transition-all ${
            tab === 'incidents' ? 'border-warningYellow text-warningYellow' : 'border-transparent text-slate-450 hover:text-white'
          }`}
        >
          Incidents Trends
        </button>
      </div>

      {/* Tab Contents */}
      {tab === 'maintenance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6">Predictive Maintenance Forecast</h3>
            <div className="space-y-4">
              {maintSchedule.map((item, index) => (
                <div key={index} className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {item.assetName} <span className="text-[10px] text-slate-500 font-mono">({item.assetTag})</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Recommended: {item.recommendedAction}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 mt-3">
                      <span>Last Service: {item.lastService}</span>
                      <span>•</span>
                      <span>Next Due: {item.nextDue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      item.urgency === 'OVERDUE' 
                        ? 'bg-red-950/30 text-red-400 border border-red-900/20' 
                        : 'bg-safetyGreen/10 text-safetyGreen border border-safetyGreen/20'
                    }`}>
                      {item.urgency}
                    </span>
                    <p className="text-xs font-extrabold text-slate-450 mt-2">
                      {item.daysRemaining < 0 
                        ? `${Math.abs(item.daysRemaining)} Days Overdue` 
                        : `${item.daysRemaining} Days Remaining`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Compliance Level</h3>
              <div className="text-center py-6">
                <div className="text-5xl font-black text-white">{compReport.overallScore}%</div>
                <div className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">{compReport.status}</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 min-h-[300px]">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6">Regulatory Compliance Gaps</h3>
            <div className="space-y-4">
              {compReport.detectedGaps.length ? (
                compReport.detectedGaps.map((gap: any) => (
                  <div key={gap.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black uppercase tracking-wider text-warningYellow bg-warningYellow/15 px-2 py-0.5 rounded">
                        {gap.regulation}
                      </span>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                        {gap.severity} RISK
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mt-3 leading-relaxed">{gap.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-550 italic text-center py-8">All checked assets are in compliance. No gaps detected.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'incidents' && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6">Incident Patterns & Near-Misses</h3>
          <div className="space-y-4">
            {incAnalysis.detectedPatterns.length ? (
              incAnalysis.detectedPatterns.map((pat: any, index: number) => (
                <div key={index} className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-hazardOrange" /> {pat.patternType}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900/20">
                      {pat.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-250 leading-relaxed mt-2">{pat.details}</p>
                  <div className="mt-4 pt-3 border-t border-slate-900/60 text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-350 block mb-1">Recommended Preventative Action:</span>
                    {pat.preventiveAction}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-550 italic text-center py-8">No incident clusters or hazardous trends detected.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
