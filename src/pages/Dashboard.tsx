import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowRight, FolderPlus, Clock, ChevronRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Project {
  id: string;
  name: string;
  description?: string;
  totalCapital: number;
  totalPaid: number;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep your exact Firebase logic
  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
        
        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedProjects = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            totalCapital: doc.data().totalCapital || 0,
            totalPaid: doc.data().totalPaid || 0,
          }));
          
          setProjects(fetchedProjects);
          setLoading(false);
        });
      } else {
        setProjects([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const totalCapital = projects.reduce((sum, p) => sum + p.totalCapital, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.totalPaid, 0);
  const outstanding = totalCapital - totalPaid;
  const globalProgress = totalCapital > 0 ? (totalPaid / totalCapital) * 100 : 0;

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">Syncing Ledgers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Upgraded Header with Contextual Greeting */}
      <div className="relative mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 uppercase tracking-wide mb-4">
              <Wallet size={14} /> Global Overview
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back.</h2>
            <p className="text-slate-500 mt-2 text-lg">You are actively tracking <span className="font-semibold text-slate-700">{projects.length} ledgers</span> across your workspaces.</p>
          </div>
          <Link 
            to="/new-project" 
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-xl hover:shadow-blue-900/20 active:scale-95"
          >
            <FolderPlus size={18} className="text-slate-300 group-hover:text-white transition-colors" /> 
            New Ledger
          </Link>
        </div>
      </div>

      {/* Upgraded Real-Data Number Cards (Glass & Gradient Touches) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-blue-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={80} /></div>
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600 ring-1 ring-blue-100/50 group-hover:scale-110 transition-transform duration-300">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Capital</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{totalCapital.toLocaleString()}</h3>
        </div>

        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-green-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={80} /></div>
          <div className="flex justify-between items-start mb-6">
            <div className="bg-green-50 p-3.5 rounded-2xl text-green-600 ring-1 ring-green-100/50 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Settled</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{totalPaid.toLocaleString()}</h3>
        </div>

        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-red-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingDown size={80} /></div>
          <div className="flex justify-between items-start mb-6">
            <div className="bg-red-50 p-3.5 rounded-2xl text-red-600 ring-1 ring-red-100/50 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Outstanding</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{outstanding.toLocaleString()}</h3>
        </div>
      </div>

      {/* Upgraded Active Projects List */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Active Ledgers</h3>
        {projects.length > 0 && (
          <span className="text-sm font-semibold text-slate-500 flex items-center gap-1"><Clock size={14} /> Real-time sync active</span>
        )}
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 border-dashed flex flex-col items-center shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <FolderPlus size={32} className="text-slate-400" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">No ledgers found</h4>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">Your workspace is currently empty. Initialize a new project ledger to start tracking your capital and milestones.</p>
            <Link to="/new-project" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30">
              Create First Project
            </Link>
          </div>
        ) : (
          projects.map(project => {
            const progress = project.totalCapital > 0 ? (project.totalPaid / project.totalCapital) * 100 : 0;
            const isComplete = progress === 100 && project.totalCapital > 0;
            
            return (
              <Link 
                to={`/project/${project.id}`} 
                key={project.id} 
                className="group block bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Side: Name & Desc */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                      {isComplete && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Settled</span>}
                    </div>
                    {project.description && <p className="text-sm text-slate-500 truncate max-w-lg">{project.description}</p>}
                  </div>
                  
                  {/* Right Side: Stats & Progress */}
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="hidden md:block text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Remaining</p>
                      <p className="text-lg font-extrabold text-slate-800">₹{(project.totalCapital - project.totalPaid).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex-1 md:w-48">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</p>
                        <p className={`text-sm font-extrabold ${isComplete ? 'text-green-600' : 'text-slate-900'}`}>{progress.toFixed(1)}%</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}