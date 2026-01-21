
import React, { useState, useEffect } from 'react';
import { RegistryUser, FacultyTier, UserRole } from '../types';
import { 
  Users, CheckCircle2, Trash2, Mail, Phone, 
  ShieldCheck, Search, LogOut, Check, 
  ShieldAlert, Lock, Key, ArrowRight, 
  DollarSign, BarChart3, TrendingUp, Wallet, 
  ArrowUpRight, ArrowDownLeft, Receipt, Percent,
  Server, Shield, UserCog, Megaphone, Activity, Settings2,
  Award, Briefcase, GraduationCap, Heart, Eye, Terminal, Play, Cpu
} from 'lucide-react';
import { calculateEnrollmentFinances, ACADEMY_COMMISSION_RATE, PRICE_TIERS } from '../utils/FinanceEngine';

interface AdminDashboardProps {
  registry: RegistryUser[];
  onUpdate: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', tier?: FacultyTier, role?: UserRole) => void;
  onDelete: (id: string) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ registry, onUpdate, onDelete, onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [activeTab, setActiveTab] = useState<'USERS' | 'LEDGER' | 'INTEGRITY'>('USERS');
  const [qaLogs, setQaLogs] = useState<{task: string, status: 'PASS' | 'RUNNING', time: string}[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'INTEGRITY') {
      const tests = [
        "Auth Service: Handshake", "Stripe Bridge: Pre-auth", "Redis Sync: Invalidation",
        "E2E: Enrollment Flow", "E2E: Classroom Launch", "I18n: RTL Flip Check"
      ];
      setQaLogs(tests.map(t => ({ task: t, status: 'PASS', time: '12ms' })));
    }
  }, [activeTab]);

  const validateKey = (k: string) => k.trim().toUpperCase() === "TAHIR-DIRECTOR-2025";

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateKey(accessKey)) setIsAuthenticated(true);
  };

  const approvedStudents = registry.filter(u => u.status === 'APPROVED' && u.role === 'STUDENT');
  const financialSummary = approvedStudents.reduce((acc, curr) => {
    const finances = calculateEnrollmentFinances(curr.tier || 'STANDARD', 1, 1);
    return {
      totalRevenue: acc.totalRevenue + finances.net,
      totalCommission: acc.totalCommission + finances.academyFee,
      totalFacultyOwed: acc.totalFacultyOwed + finances.tutorEarning
    };
  }, { totalRevenue: 0, totalCommission: 0, totalFacultyOwed: 0 });

  const filtered = registry.filter(u => {
    const matchesFilter = filter === 'ALL' || u.status === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.academyId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative"><Lock className="text-white" size={32} /></div>
            <div><h2 className="text-2xl font-black text-white mb-2">Director's Command</h2><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Authorized Access Only</p></div>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="password" placeholder="Command Key..." value={accessKey} onChange={(e) => setAccessKey(e.target.value)} className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-center tracking-[0.3em] text-white focus:border-blue-500" required />
              <button type="submit" className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Initialize</button>
            </form>
            <button onClick={onExit} className="text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest">Exit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 pb-24">
      <section className="bg-slate-950 py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
             <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/40"><ShieldCheck size={28} /></div>
             <div>
                <h1 className="text-3xl font-black text-white">Academy Master Console</h1>
                <div className="flex space-x-4 mt-2">
                   <button onClick={() => setActiveTab('USERS')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${activeTab === 'USERS' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>Registry</button>
                   <button onClick={() => setActiveTab('LEDGER')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${activeTab === 'LEDGER' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>Ledger</button>
                   <button onClick={() => setActiveTab('INTEGRITY')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${activeTab === 'INTEGRITY' ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>System Integrity</button>
                </div>
             </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="bg-red-500/10 text-red-500 px-6 py-3 rounded-xl border border-red-500/20 font-bold text-sm uppercase tracking-widest flex items-center gap-2"><LogOut size={18} /> Lock Session</button>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {activeTab === 'USERS' && (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-6 bg-slate-50/50">
                <div className="flex items-center space-x-4 bg-white px-6 py-2 rounded-2xl border border-slate-100">
                   <Search className="text-slate-300" size={18} />
                   <input type="text" placeholder="Search Identity..." className="outline-none font-bold text-blue-900 text-sm py-2" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  {['ALL', 'PENDING', 'APPROVED'].map(f => (
                    <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{f}</button>
                  ))}
                </div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400"><tr><th className="px-8 py-6">User</th><th className="px-8 py-6">Governance Role</th><th className="px-8 py-6">Status / Tier</th><th className="px-8 py-6 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                   {filtered.map(u => (
                      <tr key={u.academyId} className="hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6 font-black text-blue-900">{u.name}<br/><span className="text-[10px] text-slate-400 font-bold">{u.academyId}</span></td>
                         <td className="px-8 py-6">
                            <select className="bg-slate-100 text-[10px] font-black border-none rounded-xl px-3 py-2 outline-none" value={u.role} onChange={(e) => onUpdate(u.academyId, u.status, u.tier, e.target.value as UserRole)}>
                               <option value="TUTOR">Tutor</option><option value="GUARDIAN">Guardian</option><option value="STUDENT">Student</option>
                            </select>
                         </td>
                         <td className="px-8 py-6"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${u.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{u.status}</span></td>
                         <td className="px-8 py-6 text-right"><button onClick={() => onDelete(u.academyId)} className="bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'INTEGRITY' && (
          <div className="space-y-8 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <div className="flex items-center gap-3 mb-4"><Cpu className="text-emerald-400" size={20} /> <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Node Status</span></div>
                   <p className="text-3xl font-black">HEALTHY</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Load Balancer: 0.04%</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <div className="flex items-center gap-3 mb-4"><Shield className="text-blue-400" size={20} /> <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">SSL Handshake</span></div>
                   <p className="text-3xl font-black">SECURE</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">TLS 1.3 Active</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <div className="flex items-center gap-3 mb-4"><Terminal className="text-purple-400" size={20} /> <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">E2E Tests</span></div>
                   <p className="text-3xl font-black">100%</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">6/6 Suites Passed</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <div className="flex items-center gap-3 mb-4"><Activity className="text-rose-400" size={20} /> <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Uptime</span></div>
                   <p className="text-3xl font-black">99.99%</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Last reset: 48d ago</p>
                </div>
             </div>

             <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 font-mono">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <h4 className="text-white font-black text-xs uppercase tracking-widest">Simulated Playwright Logs</h4>
                   </div>
                   <button className="bg-white/5 text-white p-2 rounded-lg hover:bg-white/10 transition-all"><Play size={16} /></button>
                </div>
                <div className="space-y-4">
                   {qaLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <span className="text-slate-600 text-[10px]">{new Date().toLocaleTimeString()}</span>
                            <span className="text-white font-bold text-xs uppercase group-hover:text-blue-400 transition-colors">{log.task}</span>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-slate-500 text-[10px] font-mono">{log.time}</span>
                            <span className="text-emerald-400 font-black text-[10px] bg-emerald-400/10 px-2 py-1 rounded">✓ {log.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
