
import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, Loader2, X, ArrowRight, Download, FileText } from 'lucide-react';
import { generateTransactionHash } from '../utils/InvoiceGenerator';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  amount: number;
  tier: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onSuccess, amount, tier }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate high-speed Stripe clearing (1.5s)
    setTimeout(() => {
      const hash = generateTransactionHash();
      setTxHash(hash);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(hash);
      }, 2000);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-500 border border-slate-100">
        {!isSuccess ? (
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-blue-950 font-black uppercase text-xs tracking-widest">Secure Clearing</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Stripe/PayPal Interlink</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total to Clear</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-blue-900">${amount}</span>
                <span className="text-slate-400 font-bold">.00 USD</span>
              </div>
              <p className="text-[9px] font-bold text-emerald-600 mt-2 uppercase tracking-tighter">Verified {tier} Tier Subscription</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Cardholder Identity</label>
                <input required type="text" className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Full Name on Card" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Credit Card Sequence</label>
                <div className="relative">
                  <input required maxLength={19} type="text" className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold tracking-widest" placeholder="•••• •••• •••• ••••" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><CreditCard size={20} /></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Expiry</label>
                  <input required maxLength={5} type="text" className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="MM/YY" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security Code</label>
                  <input required maxLength={4} type="password" className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="CVV" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-950 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Clearing Vault...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Securely Pay ${amount}.00</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center space-x-6 opacity-30">
               <ShieldCheck size={24} />
               <div className="h-4 w-px bg-slate-400"></div>
               <p className="text-[9px] font-black uppercase tracking-widest">PCI-DSS Compliant Gateway</p>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
               <CheckCircle2 size={48} />
               <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-blue-950">Payment Cleared</h3>
               <p className="text-slate-500 text-sm font-medium">Your Admission ID has been permanently unlocked.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
               <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Internal Transaction Hash</p>
               <p className="text-[10px] font-mono text-blue-600 break-all">{txHash}</p>
            </div>
            <button className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
               <Download size={16} />
               <span>Download Official Invoice</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;
