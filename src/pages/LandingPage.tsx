import { Wallet, ShieldCheck, ArrowRight, Sparkles, LineChart, Layers } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in as:", result.user.displayName);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-200 relative overflow-hidden">
      
      {/* Background Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/15 blur-[120px] pointer-events-none" />

      {/* Glassmorphism Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-600/20">
              <Wallet size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">LedgerFlow</span>
          </div>
          <button 
            onClick={handleGoogleLogin}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 mb-8 animate-fade-in">
          <Sparkles size={16} className="text-blue-500" />
          <span>v2.0 Architecture Live</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 max-w-4xl">
          Financial clarity for your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            most complex projects.
          </span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
          From heavy real estate installments to fluid freelance contracts. LedgerFlow partitions your data into isolated workspaces with dynamic milestone tracking and real-time computation.
        </p>

        {/* Primary CTA */}
        <button 
          onClick={handleGoogleLogin}
          className="group relative flex items-center gap-4 bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-7 h-7" />
          <span className="text-xl font-bold text-slate-800">Continue with Google</span>
          <div className="bg-slate-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </button>

        

        {/* Feature Grid - Ghost Card Update */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32 text-left w-full max-w-6xl relative z-20">
          
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-slate-200 shadow-sm hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 hover:-translate-y-1 transition-all duration-500">
            <div className="bg-blue-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-500">
              <Layers className="text-blue-600/80 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">Isolated Workspaces</h3>
            <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">Keep your real estate investments completely separate from your freelance income. Strictly partitioned, perfectly organized.</p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-slate-200 shadow-sm hover:bg-white hover:shadow-xl hover:shadow-purple-900/5 hover:border-purple-200 hover:-translate-y-1 transition-all duration-500">
            <div className="bg-purple-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-500">
              <LineChart className="text-purple-600/80 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">Master-Detail Views</h3>
            <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">Get a 10,000-foot aggregate view of your total net worth and outstanding liabilities, then drill down into individual ledgers.</p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-slate-200 shadow-sm hover:bg-white hover:shadow-xl hover:shadow-green-900/5 hover:border-green-200 hover:-translate-y-1 transition-all duration-500">
            <div className="bg-green-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-500">
              <ShieldCheck className="text-green-600/80 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">Bank-Grade Math</h3>
            <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">Input clamping, dynamic outstanding balances, and real-time state synchronization via Firestore WebSocket connections.</p>
          </div>

        </div>

        {/* Abstract Dashboard Preview (High Contrast Update) */}
        <div className="mt-24 w-full max-w-5xl bg-white rounded-[2rem] p-4 shadow-2xl shadow-slate-300/60 border border-slate-300 relative z-20">
          
          {/* Softened the fade-out gradient so the bottom boxes stay visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA]/90 z-10 rounded-[2rem] pointer-events-none" />
          
          {/* Main Container Outline */}
          <div className="border border-slate-300 bg-slate-100 rounded-2xl h-[400px] flex overflow-hidden shadow-inner">
            
            {/* Sidebar Mock */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block z-0">
              <div className="p-6 border-b border-slate-800 flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500"/><div className="w-3 h-3 rounded-full bg-yellow-500"/><div className="w-3 h-3 rounded-full bg-green-500"/>
              </div>
              <div className="p-4 space-y-4">
                <div className="h-4 bg-slate-700 rounded w-3/4 shadow-sm"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 shadow-sm"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6 shadow-sm"></div>
              </div>
            </div>
            
            {/* Main Area Mock - Darkened background to slate-50 so white boxes pop */}
            <div className="flex-1 p-8 space-y-6 bg-slate-50 z-0">
              {/* Header skeleton text */}
              <div className="h-8 bg-slate-300 rounded-md w-1/4 mb-10 shadow-sm"></div>
              
              {/* 3 Top Cards - Bolder borders and deeper shadows */}
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 bg-white border border-slate-300 rounded-xl shadow-md"></div>
                <div className="h-32 bg-white border border-slate-300 rounded-xl shadow-md"></div>
                <div className="h-32 bg-white border border-slate-300 rounded-xl shadow-md"></div>
              </div>
              
              {/* Bottom List Card - Added fake list rows for extra visual texture */}
              <div className="h-64 bg-white border border-slate-300 rounded-xl shadow-md mt-6 flex flex-col overflow-hidden">
                 <div className="w-full h-12 border-b border-slate-200 bg-slate-100/50" />
                 <div className="w-full h-16 border-b border-slate-100" />
                 <div className="w-full h-16 border-b border-slate-100" />
              </div>
            </div>
            
          </div>
        </div>
        
      </main>

    </div>
  );
}