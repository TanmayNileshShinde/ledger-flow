import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { FolderPlus, ArrowLeft, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

export default function NewProject() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("Authentication error: Please return to the dashboard and log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'projects'), {
        name: projectName,
        description: description,
        userId: user.uid,
        createdAt: serverTimestamp(),
        totalCapital: 0, 
        totalPaid: 0
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setErrorMsg(error.message || "Failed to initialize ledger. Check your database connections."); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* Background Ambient Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-400/15 blur-[120px] pointer-events-none" />

      {/* Top Navigation / Breadcrumb */}
      <div className="absolute top-0 left-0 w-full p-8 z-20">
        <Link 
          to="/dashboard" 
          className="group inline-flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md"
        >
          <div className="bg-white p-1 rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} className="text-slate-700" />
          </div>
          Back to Dashboard
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-xl relative z-10 animate-fade-in">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-6 text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <FolderPlus size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Initialize Ledger
          </h2>
          <p className="text-lg text-slate-500">
            Create a secure, isolated workspace for your next project.
          </p>
        </div>

        {/* The Glass Form Card */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white"
        >
          {/* Enhanced Error Banner */}
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Project Name Input */}
          <div className="mb-8 relative">
            <label htmlFor="projectName" className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 ml-1">
              Ledger Name <span className="text-blue-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Ashford Flat Installments"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-lg font-medium placeholder:text-slate-400 placeholder:font-normal shadow-inner"
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-10 relative">
            <label htmlFor="description" className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
              Description <span className="text-slate-400 font-medium text-xs normal-case">(Optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details or context about this specific financial tracker..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-base resize-none placeholder:text-slate-400 shadow-inner"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-4 border-t border-slate-100 pt-8">
            <Link 
              to="/dashboard"
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !projectName.trim()}
              className="group relative px-8 py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                  <span>Create Workspace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}