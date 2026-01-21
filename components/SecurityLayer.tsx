
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

const SecurityLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // 1. Disable Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerAlert();
    };

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+U, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        triggerAlert();
      }
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        triggerAlert();
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        triggerAlert();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        triggerAlert();
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        triggerAlert();
      }
    };

    // 3. Proactive Anti-Debugging & Console Scrambling
    const secureEnvironment = () => {
      const start = Date.now();
      debugger; // This will trigger if DevTools is open
      const end = Date.now();
      
      if (end - start > 100) {
        // DevTools likely open
        // Scramble and clear to prevent DOM inspection or data copy
        for(let i=0; i<20; i++) {
          console.log("%cSECURITY PROTOCOL ACTIVE", "color: red; font-size: 20px; font-weight: bold;");
        }
        console.clear();
        console.log("%cSTOP!", "color: red; font-size: 40px; font-weight: bold;");
        console.log("%cUnauthorized source code access is monitored and prohibited.", "font-size: 18px;");
      }
    };

    const triggerAlert = () => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };

    // Run security check every 1 second
    const interval = setInterval(secureEnvironment, 1000);
    
    // Aggressive console clearing
    const clearLoop = setInterval(() => {
      if (window.console && window.console.clear) {
        // console.clear(); // Disabled for now as it makes dev hard, but ready for production
      }
    }, 500);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      clearInterval(clearLoop);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Professional Security Alert Toast */}
      {showAlert && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-10 duration-300">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-red-500/50 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center animate-pulse">
               <ShieldAlert size={20} />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-red-400">Security Violation</p>
               <p className="text-[10px] font-bold text-slate-400">Source code is protected by QuranWithTahir.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Invisible Copyright Watermark (Hard to remove) */}
      <div className="fixed bottom-4 left-4 z-[5] pointer-events-none opacity-[0.03] select-none">
        <p className="text-[8px] font-black uppercase tracking-[1em]">
          Property of QuranWithTahir.com - Unauthorized Duplication is Prohibited
        </p>
      </div>
    </>
  );
};

export default SecurityLayer;
