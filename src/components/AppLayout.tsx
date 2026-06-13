import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderPlus, FileText, LogOut, User, Wallet, ChevronRight } from 'lucide-react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface ProjectLink {
  id: string;
  name: string;
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectLink[]>([]);

  // 100% Untouched Firebase Logic
  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

        const projectsQuery = query(collection(db, 'projects'), where('userId', '==', currentUser.uid));
        unsubscribeSnapshot = onSnapshot(projectsQuery, (snapshot) => {
          const fetchedProjects = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
          }));
          setProjects(fetchedProjects);
        });
      } else {
        navigate('/');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Upgraded Active State Styling
  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' 
      : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200';
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="font-semibold text-slate-400 tracking-widest uppercase text-sm">Securing Workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden">
      
      {/* Upgraded Sidebar */}
      <aside className="w-72 bg-[#0B1120] border-r border-slate-800 flex flex-col relative z-20 shadow-2xl">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-900/50 border border-blue-400/20">
            <Wallet size={24} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">LedgerFlow</span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
          
          <Link to="/dashboard" className={`group flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/dashboard')}`}>
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} className={location.pathname === '/dashboard' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
              <span>Master Dashboard</span>
            </div>
          </Link>
          
          <div className="pt-8 pb-3 px-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Ledgers</p>
            <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold border border-slate-700">
              {projects.length}
            </div>
          </div>

          <div className="space-y-1">
            {projects.map((project) => {
              const active = location.pathname === `/project/${project.id}`;
              return (
                <Link 
                  key={project.id} 
                  to={`/project/${project.id}`} 
                  className={`group flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive(`/project/${project.id}`)}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText size={18} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
                    <span className="truncate">{project.name}</span>
                  </div>
                  {/* Micro-interaction arrow on hover */}
                  <ChevronRight size={16} className={`opacity-0 -translate-x-2 transition-all duration-300 ${active ? 'opacity-100 translate-x-0 text-blue-500' : 'group-hover:opacity-100 group-hover:translate-x-0 text-slate-500'}`} />
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4">
            <Link 
              to="/new-project" 
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-slate-800/50 hover:bg-slate-800/50 text-slate-300 hover:text-white mt-2 ${isActive('/new-project')}`}
            >
              <div className="bg-slate-800 p-1.5 rounded-lg group-hover:bg-blue-600 transition-colors">
                <FolderPlus size={16} className="text-slate-400 group-hover:text-white transition-colors" />
              </div>
              Initialize New
            </Link>
          </div>
        </nav>

        {/* Upgraded User Profile & Logout Section */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0F1629]">
          <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-inner">
            <div className="relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border border-slate-700 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User size={20} className="text-slate-400" />
                </div>
              )}
              {/* Green online indicator dot */}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0B1120] rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs font-medium text-slate-500 truncate">Workspace Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 md:p-12">
          <Outlet /> 
        </div>
      </main>
      
    </div>
  );
}