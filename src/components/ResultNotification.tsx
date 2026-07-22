import React, { useEffect } from "react";

interface ResultNotificationProps {
  message: string;
  onClose: () => void;
}

const ResultNotification: React.FC<ResultNotificationProps> = ({ message, onClose }) => {
  
  // Auto-close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-bg-card border-2 border-accent rounded-lg w-[85%] max-w-[260px] md:max-w-[300px] shadow-[0_0_30px_rgba(239,239,187,0.4)] relative overflow-hidden modal-enter flex flex-col cursor-pointer"
        onClick={onClose}
      >
        {/* Shine Animation */}
        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine pointer-events-none z-10"></div>
        
        {/* Close Button (X) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-accent/70 hover:text-accent transition-colors z-30"
        >
          <i className="fas fa-times text-xs"></i>
        </button>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-0"></div>
        
        <div className="relative z-20 p-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                <i className="fas fa-check text-sm text-green-400"></i>
             </div>
          </div>
          
          <h3 className="text-sm font-orbitron font-bold text-accent tracking-widest mb-2 text-shadow-[0_0_5px_rgba(239,239,187,0.5)]">
            SUCCESS
          </h3>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-3"></div>
          
          <div className="bg-black/60 border border-accent/40 rounded-lg p-3 w-full mb-2 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="text-white font-share-tech text-lg md:text-xl leading-relaxed tracking-wider break-words font-bold drop-shadow-md">
              {message}
            </p>
          </div>
          
          <p className="text-accent/60 text-[9px] uppercase tracking-[0.2em] mt-1 animate-pulse">
            Tap to close
          </p>
        </div>
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/80"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/80"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/80"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/80"></div>
      </div>
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
        .animate-shine {
          animation: shine 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ResultNotification;