import React from "react";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-bg-card border-2 border-red-500 rounded-xl w-[85%] max-w-[300px] md:max-w-sm shadow-[0_0_50px_rgba(220,38,38,0.4)] relative overflow-hidden modal-enter flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 p-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center animate-pulse">
                <i className="fas fa-exclamation-triangle text-[10px] text-red-500"></i>
             </div>
             <h3 className="text-sm font-orbitron font-bold text-red-500 tracking-widest">
               SYSTEM ERROR
             </h3>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-3"></div>
          <p className="text-gray-300 font-share-tech text-xs leading-relaxed mb-4">
            {message}
          </p>
          <button 
            onClick={onClose}
            className="w-full py-2 bg-red-600/90 hover:bg-red-600 text-white font-orbitron font-bold text-[10px] tracking-wider rounded border border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all duration-200 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>ACKNOWLEDGE</span>
            <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
      </div>
    </div>
  );
};

export default ErrorNotification;