import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, collection, query, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, ArrowLeft, CheckCircle2, Circle, Activity, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface Row {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  isDone: boolean;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [projectName, setProjectName] = useState('Loading Project...');
  const [rows, setRows] = useState<Row[]>([]);
  
  const [newRowName, setNewRowName] = useState('');
  const [newRowTotal, setNewRowTotal] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 1. Fetch Project Details and Rows
  useEffect(() => {
    if (!id) return;
    const unsubProject = onSnapshot(doc(db, 'projects', id), (docSnap) => {
      if (docSnap.exists()) setProjectName(docSnap.data().name);
    });

    const q = query(collection(db, 'projects', id, 'milestones'), orderBy('createdAt', 'asc'));
    const unsubRows = onSnapshot(q, (snapshot) => {
      const fetchedRows = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      })) as Row[];
      setRows(fetchedRows);
    });

    return () => { unsubProject(); unsubRows(); };
  }, [id]);

  // Dynamic Calculations
  const projectTotal = rows.reduce((sum, r) => sum + r.totalAmount, 0);
  const projectPaid = rows.reduce((sum, r) => sum + r.paidAmount, 0);
  const remainingBalance = projectTotal - projectPaid;
  const progressPercentage = projectTotal > 0 ? Math.min((projectPaid / projectTotal) * 100, 100) : 0;
  const isComplete = progressPercentage === 100 && projectTotal > 0;

  // 2. Sync totals to the Master Dashboard
  const syncParentProjectTotals = async (currentRows: Row[]) => {
    if (!id) return;
    const totalCap = currentRows.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalPd = currentRows.reduce((sum, r) => sum + r.paidAmount, 0);
    await updateDoc(doc(db, 'projects', id), { totalCapital: totalCap, totalPaid: totalPd });
  };

  // 3. Add a new milestone
  const handleAddRow = async () => {
    if (!id || !newRowName.trim() || !newRowTotal) return;
    setIsAdding(true);
    const amount = Number(newRowTotal);
    
    try {
      await addDoc(collection(db, 'projects', id, 'milestones'), {
        name: newRowName, totalAmount: amount, paidAmount: 0, isDone: false, createdAt: serverTimestamp()
      });
      setNewRowName('');
      setNewRowTotal('');
      const updatedRows = [...rows, { id: 'temp', name: newRowName, totalAmount: amount, paidAmount: 0, isDone: false }];
      await syncParentProjectTotals(updatedRows);
    } catch (error) {
      console.error("Error adding row:", error);
    }
    setIsAdding(false);
  };

  // 4. Update the paid amount
  const handlePaidChange = (rowId: string, val: string) => {
    let numVal = Number(val) || 0;
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        if (numVal > row.totalAmount) numVal = row.totalAmount;
        if (numVal < 0) numVal = 0;
        const isStillDone = numVal === row.totalAmount ? row.isDone : false;
        return { ...row, paidAmount: numVal, isDone: isStillDone };
      }
      return row;
    }));
  };

  // 5. Save the updated amount on blur
  const handlePaidBlur = async (rowId: string) => {
    if (!id) return;
    const updatedRow = rows.find(r => r.id === rowId);
    if (!updatedRow) return;
    await updateDoc(doc(db, 'projects', id, 'milestones', rowId), {
      paidAmount: updatedRow.paidAmount, isDone: updatedRow.isDone
    });
    await syncParentProjectTotals(rows);
  };

  // 6. Toggle the Checkbox
  const toggleDone = async (rowId: string) => {
    if (!id) return;
    const rowToUpdate = rows.find(r => r.id === rowId);
    if (!rowToUpdate) return;
    const newStatus = !rowToUpdate.isDone;
    const updatedRows = rows.map(r => r.id === rowId ? { ...r, isDone: newStatus } : r);
    setRows(updatedRows);
    await updateDoc(doc(db, 'projects', id, 'milestones', rowId), { isDone: newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      {/* Top Navigation */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="group inline-flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md"
        >
          <div className="bg-slate-50 p-1 rounded-full shadow-sm group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} className="text-slate-700" />
          </div>
          Back to Dashboard
        </Link>
      </div>

      {/* Upgraded Header Area */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide mb-4">
            <Layers size={14} /> Active Workspace
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{projectName}</h2>
            {isComplete && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Settled</span>}
          </div>
        </div>

        {/* Global Progress Module */}
        <div className="relative z-10 w-full md:w-72 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</p>
            <p className={`text-lg font-extrabold ${isComplete ? 'text-green-600' : 'text-slate-900'}`}>{progressPercentage.toFixed(1)}%</p>
          </div>
          <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* SaaS Stat Cards (Matched to Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600 ring-1 ring-blue-100/50">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Tracked</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{projectTotal.toLocaleString()}</h3>
        </div>

        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-green-50 p-3.5 rounded-2xl text-green-600 ring-1 ring-green-100/50">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Paid</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{projectPaid.toLocaleString()}</h3>
        </div>

        <div className="relative group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-red-50 p-3.5 rounded-2xl text-red-600 ring-1 ring-red-100/50">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Remaining Balance</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{remainingBalance.toLocaleString()}</h3>
        </div>
      </div>

      {/* Modern Floating List Data Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Milestone</div>
          <div className="col-span-2">Total Value</div>
          <div className="col-span-3">Amount Paid</div>
          <div className="col-span-2">Remaining</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        <div className="p-4 space-y-3">
          {rows.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
               <Layers size={48} className="text-slate-300 mb-4" />
               <p className="font-medium text-lg text-slate-700">No milestones yet</p>
               <p className="text-sm">Add your first tracking row below.</p>
            </div>
          ) : (
            rows.map(row => {
              const isUnlocked = row.paidAmount === row.totalAmount;
              const rowRemaining = row.totalAmount - row.paidAmount;

              return (
                <div key={row.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all duration-300 ${row.isDone ? 'bg-green-50/50 border-green-100 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}`}>
                  
                  {/* Name */}
                  <div className="col-span-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${row.isDone ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    {row.name}
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-2 text-slate-600 font-semibold">
                    <span className="md:hidden text-xs text-slate-400 font-normal mr-2">Total:</span>
                    ₹{row.totalAmount.toLocaleString()}
                  </div>
                  
                  {/* Paid Input */}
                  <div className="col-span-3">
                    <span className="md:hidden text-xs text-slate-400 font-normal block mb-1">Paid:</span>
                    <input
                      type="number"
                      value={row.paidAmount || ''}
                      onChange={(e) => handlePaidChange(row.id, e.target.value)}
                      onBlur={() => handlePaidBlur(row.id)}
                      className={`w-full max-w-[160px] border-2 rounded-xl p-2.5 focus:outline-none transition-all font-semibold ${row.isDone ? 'bg-green-100/50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 shadow-inner'}`}
                    />
                  </div>
                  
                  {/* Remaining */}
                  <div className="col-span-2 font-semibold">
                    <span className="md:hidden text-xs text-slate-400 font-normal mr-2">Remaining:</span>
                    <span className={rowRemaining === 0 ? 'text-green-600' : 'text-slate-500'}>
                      ₹{rowRemaining.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="col-span-1 flex justify-end md:justify-center">
                    <button
                      disabled={!isUnlocked}
                      onClick={() => toggleDone(row.id)}
                      className={`p-2 rounded-xl transition-all ${
                        !isUnlocked ? 'text-slate-300 cursor-not-allowed opacity-50' : 
                        row.isDone ? 'text-green-600 bg-green-100 scale-110 shadow-sm' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {row.isDone ? <CheckCircle2 size={28} className="fill-green-100" /> : <Circle size={28} />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* The "Add Row" Glass Form */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Add New Milestone</h4>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="col-span-5">
               <input
                  type="text"
                  placeholder="E.g., 5th Slab Completion"
                  value={newRowName}
                  onChange={(e) => setNewRowName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium shadow-sm"
                />
            </div>
            <div className="col-span-4">
              <input
                type="number"
                placeholder="Total Value (₹)"
                value={newRowTotal}
                onChange={(e) => setNewRowTotal(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium shadow-sm"
              />
            </div>
            <div className="col-span-3">
              <button
                onClick={handleAddRow}
                disabled={isAdding || !newRowName || !newRowTotal}
                className="flex items-center gap-2 justify-center w-full bg-slate-900 text-white font-bold px-4 py-3 rounded-xl hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus size={18} /> Add Row
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}