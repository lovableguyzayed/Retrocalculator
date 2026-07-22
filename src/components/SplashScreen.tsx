import React, { useState, useEffect } from "react";

const SplashScreen = ({ onStart }: { onStart: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);
  
  const bootLogs = [
    "INITIALIZING_KERNEL...",
    "LOADING_CORE_MODULES...",
    "MOUNTING_VIRTUAL_DRIVES...",
    "CHECKING_MEMORY_INTEGRITY... OK",
    "CALIBRATING_SENSORS...",
    "ESTABLISHING_NEURAL_LINK...",
    "LOADING_AI_PERSONALITY_MATRIX...",
    "OPTIMIZING_MATH_COPROCESSOR...",
    "SYNCING_QUANTUM_STATES...",
    "SYSTEM_READY."
  ];

  useEffect(() => {
    let logIndex = 0;
    const totalDuration = 2500; // Total loading time
    const intervalTime = totalDuration / 100;

    // Progress bar interval
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setShowButton(true);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    // Log text interval
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs(prev => [...prev.slice(-4), bootLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, totalDuration / bootLogs.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto font-share-tech">
      {/* CRT Effects */}
      <div className="scanlines opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(107,136,211,0.1)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      
      <div className="max-w-lg w-full relative z-10 flex flex-col items-center my-auto min-h-min">
        
        {/* Retro Header */}
        <div className="w-full flex justify-between text-primary/60 text-xs mb-4 md:mb-8 border-b border-primary/30 pb-2">
          <span>RETRO-BIOS v1.0.4</span>
          <span>MEM: 64KB OK</span>
        </div>

        {/* Animated Logo / Core */}
        <div className="mb-10 relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary/30 flex items-center justify-center relative animate-pulse">
             <div className="absolute inset-0 rounded-full border-t-4 border-accent animate-spin duration-[3s]"></div>
             <div className="absolute inset-2 rounded-full border-b-4 border-primary animate-spin duration-[2s] direction-reverse"></div>
             
             {/* Center Icon */}
             <div className="text-3xl md:text-4xl text-accent filter drop-shadow-[0_0_10px_rgba(239,239,187,0.8)]">
               <i className="fas fa-robot"></i>
             </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-accent text-xs tracking-[0.2em] font-bold whitespace-nowrap">
            TECHNICAL WORLD
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-primary/50 tracking-wider mb-2 drop-shadow-[0_0_15px_rgba(107,136,211,0.5)]">
            RETRO BOT
          </h1>
          <div className="text-accent font-share-tech tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-base">
            QUANTITY CALCULATOR
          </div>
        </div>

        {/* Boot Logs (Terminal Style) */}
        <div className="w-full bg-black/50 border border-primary/20 rounded p-3 md:p-4 h-36 md:h-40 mb-6 font-mono text-xs overflow-y-auto flex flex-col justify-end shadow-inner relative">
          <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-ping"></div>
          {logs.map((log, i) => (
            <div key={i} className="text-primary mb-1 break-words whitespace-pre-wrap leading-tight">
              <span className="text-accent/50 mr-2">{`>`}</span>
              {log}
            </div>
          ))}
          <div className="w-3 h-4 bg-accent/50 animate-pulse mt-1 inline-block flex-shrink-0"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8 relative">
          <div className="flex justify-between text-xs text-primary mb-1">
            <span>SYSTEM LOAD</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out shadow-[0_0_10px_rgba(107,136,211,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Start Button */}
        <div className={`transition-all duration-700 transform ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-4`}>
          <button 
            onClick={onStart}
            className="group relative px-8 md:px-10 py-3 md:py-4 bg-transparent overflow-hidden border-2 border-accent transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,239,187,0.4)] active:scale-95"
          >
            <div className="absolute inset-0 bg-accent/10 group-hover:bg-accent/20 transition-all duration-300"></div>
            <div className="absolute inset-0 w-0 bg-accent transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent"></div>

            <span className="relative text-accent font-bold font-orbitron text-base md:text-lg tracking-widest flex items-center gap-3 group-hover:text-white transition-colors">
               <i className="fas fa-power-off animate-pulse text-sm"></i>
               INITIALIZE SYSTEM
            </span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-gray-600 text-[10px] font-mono opacity-80 z-20 pb-4">
          © 2026 | Built by an Independent Developer from India
        </div>

      </div>
    </div>
  );
};

export default SplashScreen;