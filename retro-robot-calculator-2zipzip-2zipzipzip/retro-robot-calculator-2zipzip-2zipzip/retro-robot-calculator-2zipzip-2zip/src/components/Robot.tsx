import React from "react";

export type RobotState = 'idle' | 'excited' | 'wave' | 'thinking' | 'calculating' | 'celebrating' | 'nodding' | 'scanning' | 'processing' | 'energizing' | 'confused' | 'amazed' | 'morphing' | 'exploding' | 'teleporting' | 'glitching' | 'levitating' | 'matrix' | 'hologram' | 'quantum' | 'cosmic' | 'dimensional' | 'weight-mode' | 'volume-mode' | 'calculator-mode' | 'result-mode' | 'reset-mode' | 'confirm-rate' | 'dancing';

interface RobotProps {
  state: RobotState;
  currentStep: 'category' | 'base-rate' | 'calculator';
  unitRate: number;
  baseUnit: string;
}

const Robot: React.FC<RobotProps> = ({ state, currentStep, unitRate, baseUnit }) => {
  return (
    <div className="w-1/2 bg-gradient-to-b from-bg-dark via-gray-900 to-bg-dark flex flex-col items-center justify-center p-2 md:p-4 relative robot-container-wrapper overflow-hidden flex-shrink-0 border-r-2 border-primary/30 h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(107, 136, 211, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(107, 136, 211, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px'
      }}></div>
      
      {/* Rate Card Overlay (Calculator Step) */}
      {currentStep === 'calculator' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-full flex justify-center pointer-events-none px-4">
          <div className="bg-black border-2 border-accent rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(239,239,187,0.4)] relative transform scale-90 md:scale-100 origin-top w-full max-w-[200px]">
            <div className="absolute inset-0 bg-accent opacity-5 rounded-lg"></div>
            <div className="relative flex flex-col items-center">
              <div className="text-primary text-[8px] font-bold tracking-widest uppercase mb-1 opacity-70">Current Unit Rate</div>
              <div className="text-accent text-lg md:text-xl font-mono font-bold tracking-tighter shadow-sm">
                ₹{unitRate.toFixed(2)}<span className="text-sm opacity-60 ml-0.5">/{baseUnit}</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_#EFEFBB]"></div>
          </div>
        </div>
      )}

      {/* Retro Robot Character Container - Animation Class Applied Here */}
      <div className={`robot-${state} relative w-full flex flex-col items-center justify-center robot-container h-full`}>
         
         {/* Scaling Wrapper. The robot's dimensions are rem-based, so they already
             scale with the fluid root font-size (see html{} in index.html). These
             breakpoint steps only fine-tune the fit inside the 50%-width column and
             are capped at 95% so the robot never becomes oversized on tablets. */}
         <div className="transform scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-95 origin-center transition-transform duration-300 flex flex-col items-center">
           
           <div className="robot-body relative flex flex-col items-center">
            {/* Antenna */}
            <div className="relative z-30 flex flex-col items-center">
                <div className="flex flex-col items-center -mb-1">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse relative z-10">
                      <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-ping"></div>
                    </div>
                    <div className="w-1.5 h-8 bg-gradient-to-b from-gray-400 to-gray-600 border-x border-gray-700"></div>
                    <div className="w-8 h-2 bg-gray-600 rounded-full border border-gray-500"></div>
                </div>
                
                {/* Head */}
                <div className="w-40 h-32 bg-gradient-to-b from-gray-300 to-gray-500 rounded-2xl border-4 border-gray-600 shadow-xl relative flex items-center justify-center">
                    <div className="absolute top-8 -left-5 w-5 h-12 bg-gray-600 rounded-l-lg border-l-2 border-y-2 border-gray-500 flex flex-col justify-between py-2">
                       <div className="w-full h-1 bg-gray-700"></div>
                       <div className="w-full h-1 bg-gray-700"></div>
                       <div className="w-full h-1 bg-gray-700"></div>
                    </div>
                    <div className="absolute top-8 -right-5 w-5 h-12 bg-gray-600 rounded-r-lg border-r-2 border-y-2 border-gray-500 flex flex-col justify-between py-2">
                       <div className="w-full h-1 bg-gray-700"></div>
                       <div className="w-full h-1 bg-gray-700"></div>
                       <div className="w-full h-1 bg-gray-700"></div>
                    </div>
                    <div className="w-32 h-24 bg-black rounded-xl border-4 border-gray-700 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-bl-full z-10"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 z-10"></div>
                        <div className="flex space-x-6 z-0 mb-3">
                            <div className="w-8 h-8 bg-accent rounded-full shadow-[0_0_20px_#EFEFBB] robot-eye relative flex items-center justify-center border-2 border-accent/50">
                              <div className="w-2 h-2 bg-white rounded-full opacity-80 absolute top-1.5 right-1.5"></div>
                            </div>
                            <div className="w-8 h-8 bg-accent rounded-full shadow-[0_0_20px_#EFEFBB] robot-eye relative flex items-center justify-center border-2 border-accent/50">
                              <div className="w-2 h-2 bg-white rounded-full opacity-80 absolute top-1.5 right-1.5"></div>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-1 h-3 bg-accent/40 rounded-full animate-pulse"></div>
                            <div className="w-1 h-4 bg-accent/60 rounded-full animate-pulse delay-75"></div>
                            <div className="w-1 h-5 bg-accent/80 rounded-full animate-pulse delay-100"></div>
                            <div className="w-1 h-4 bg-accent/60 rounded-full animate-pulse delay-75"></div>
                            <div className="w-1 h-3 bg-accent/40 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gray-400 rounded-full border border-gray-600 shadow-sm"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full border border-gray-600 shadow-sm"></div>
                    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-gray-400 rounded-full border border-gray-600 shadow-sm"></div>
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full border border-gray-600 shadow-sm"></div>
                </div>
                <div className="w-16 h-4 bg-gray-700 border-x-2 border-gray-500 relative z-20">
                   <div className="w-full h-1 bg-black/30 mt-1"></div>
                   <div className="w-full h-1 bg-black/30 mt-1"></div>
                </div>
            </div>
            
            {/* Neck Area */}
            <div className="relative z-20 -mt-1">
                <div className="w-20 h-6 bg-gradient-to-b from-gray-700 to-gray-800 border-x-2 border-gray-600 flex flex-col justify-center space-y-1 py-1 px-2">
                   <div className="w-full h-1 bg-black/40 rounded-full"></div>
                   <div className="w-full h-1 bg-black/40 rounded-full"></div>
                </div>
            </div>
            
            {/* Body */}
            <div className="relative z-20 -mt-1">
                <div className="w-48 h-44 bg-gradient-to-b from-primary via-blue-700 to-dark-blue rounded-3xl border-4 border-gray-500 shadow-2xl relative flex flex-col items-center pt-5">
                    <div className="w-36 h-28 bg-black/20 rounded-xl border border-white/10 p-3 flex flex-col items-center relative shadow-inner">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-gray-600 shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center justify-center robot-chest animate-pulse mb-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)]"></div>
                            <i className="fas fa-bolt text-white text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></i>
                        </div>
                        <div className="flex flex-col space-y-1.5 w-full px-4">
                            <div className="w-full h-1.5 bg-gray-800/80 rounded-full border-b border-gray-600"></div>
                            <div className="w-full h-1.5 bg-gray-800/80 rounded-full border-b border-gray-600"></div>
                            <div className="w-full h-1.5 bg-gray-800/80 rounded-full border-b border-gray-600"></div>
                        </div>
                    </div>
                    <div className="mt-2 w-32 flex justify-between px-2">
                        <div className="w-8 h-4 bg-red-500/80 rounded border border-red-700"></div>
                        <div className="w-8 h-4 bg-yellow-500/80 rounded border border-yellow-700"></div>
                        <div className="w-8 h-4 bg-green-500/80 rounded border border-green-700"></div>
                    </div>
                    
                    {/* Left Arm */}
                    <div className="absolute top-6 -left-10 z-0 robot-arm-left origin-top-right">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-4 border-gray-700 shadow-xl relative z-20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-gray-500 shadow-inner"></div>
                        </div>
                        <div className="arm-upper w-10 h-16 bg-gradient-to-r from-gray-500 to-gray-600 border-x-2 border-gray-700 -mt-2 mx-auto relative z-10 rounded-b-lg shadow-lg">
                           <div className="w-full h-1 bg-black/20 mt-2"></div>
                           <div className="w-full h-1 bg-black/20 mt-1"></div>
                        </div>
                        <div className="arm-elbow w-12 h-12 bg-gray-400 rounded-full border-4 border-gray-600 -mt-2 mx-auto relative z-20 shadow-md flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="absolute w-14 h-2 bg-gray-500 -z-10 rounded-full"></div>
                        </div>
                        <div className="arm-lower w-8 h-16 bg-gradient-to-r from-gray-500 to-gray-600 border-x-2 border-gray-700 -mt-2 mx-auto relative z-10 rounded-b-md shadow-lg flex flex-col justify-end pb-1 items-center">
                           <div className="w-6 h-10 border-2 border-gray-700/30 rounded bg-black/10"></div>
                        </div>
                        <div className="arm-hand w-10 h-8 bg-gray-700 rounded-lg border-2 border-gray-500 -mt-1 mx-auto relative z-20 flex justify-center shadow-lg">
                            <div className="absolute top-full -left-2 w-4 h-10 bg-gray-400 rounded-bl-full border-l-2 border-b-2 border-gray-600 origin-top-right transform -rotate-12 shadow-sm">
                                <div className="absolute bottom-1 right-0 w-2 h-4 bg-gray-300 rounded-full opacity-50"></div>
                            </div>
                            <div className="absolute top-full -right-2 w-4 h-10 bg-gray-400 rounded-br-full border-r-2 border-b-2 border-gray-600 origin-top-left transform rotate-12 shadow-sm">
                                <div className="absolute bottom-1 left-0 w-2 h-4 bg-gray-300 rounded-full opacity-50"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Arm */}
                    <div className="absolute top-6 -right-10 z-0 robot-arm-right origin-top-left">
                        <div className="w-14 h-14 bg-gradient-to-bl from-gray-400 to-gray-600 rounded-full border-4 border-gray-700 shadow-xl relative z-20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-gray-500 shadow-inner"></div>
                        </div>
                        <div className="arm-upper w-10 h-16 bg-gradient-to-r from-gray-500 to-gray-600 border-x-2 border-gray-700 -mt-2 mx-auto relative z-10 rounded-b-lg shadow-lg">
                           <div className="w-full h-1 bg-black/20 mt-2"></div>
                           <div className="w-full h-1 bg-black/20 mt-1"></div>
                        </div>
                        <div className="arm-elbow w-12 h-12 bg-gray-400 rounded-full border-4 border-gray-600 -mt-2 mx-auto relative z-20 shadow-md flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="absolute w-14 h-2 bg-gray-500 -z-10 rounded-full"></div>
                        </div>
                        <div className="arm-lower w-8 h-16 bg-gradient-to-r from-gray-500 to-gray-600 border-x-2 border-gray-700 -mt-2 mx-auto relative z-10 rounded-b-md shadow-lg flex flex-col justify-end pb-1 items-center">
                           <div className="w-6 h-10 border-2 border-gray-700/30 rounded bg-black/10"></div>
                        </div>
                        <div className="arm-hand w-10 h-8 bg-gray-700 rounded-lg border-2 border-gray-500 -mt-1 mx-auto relative z-20 flex justify-center shadow-lg">
                            <div className="absolute top-full -left-2 w-4 h-10 bg-gray-400 rounded-bl-full border-l-2 border-b-2 border-gray-600 origin-top-right transform -rotate-12 shadow-sm">
                                <div className="absolute bottom-1 right-0 w-2 h-4 bg-gray-300 rounded-full opacity-50"></div>
                            </div>
                            <div className="absolute top-full -right-2 w-4 h-10 bg-gray-400 rounded-br-full border-r-2 border-b-2 border-gray-600 origin-top-left transform rotate-12 shadow-sm">
                                <div className="absolute bottom-1 left-0 w-2 h-4 bg-gray-300 rounded-full opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Waist */}
            <div className="w-36 h-12 bg-gray-600 rounded-b-3xl border-x-4 border-b-4 border-gray-700 -mt-3 relative z-10 shadow-lg flex justify-center pt-2">
               <div className="w-20 h-4 bg-gray-800 rounded-full border border-gray-600"></div>
            </div>
            
            {/* Legs */}
            <div className="flex space-x-8 -mt-2">
                <div className="robot-leg-left flex flex-col items-center">
                     <div className="leg-thigh w-8 h-16 bg-gradient-to-b from-gray-500 to-gray-600 border-2 border-gray-700 rounded-t-lg"></div> 
                     <div className="leg-knee w-10 h-10 bg-gray-400 rounded-full border-4 border-gray-600 -my-2 z-10 shadow-md"></div> 
                     <div className="leg-shin w-8 h-20 bg-gradient-to-b from-gray-500 to-gray-600 border-2 border-gray-700"></div> 
                     <div className="leg-foot w-16 h-10 bg-gray-700 rounded-lg border-2 border-gray-500 shadow-xl flex items-center justify-center">
                        <div className="w-12 h-2 bg-gray-500 rounded-full"></div>
                     </div>
                </div>
                 <div className="robot-leg-right flex flex-col items-center">
                     <div className="leg-thigh w-8 h-16 bg-gradient-to-b from-gray-500 to-gray-600 border-2 border-gray-700 rounded-t-lg"></div> 
                     <div className="leg-knee w-10 h-10 bg-gray-400 rounded-full border-4 border-gray-600 -my-2 z-10 shadow-md"></div> 
                     <div className="leg-shin w-8 h-20 bg-gradient-to-b from-gray-500 to-gray-600 border-2 border-gray-700"></div> 
                     <div className="leg-foot w-16 h-10 bg-gray-700 rounded-lg border-2 border-gray-500 shadow-xl flex items-center justify-center">
                         <div className="w-12 h-2 bg-gray-500 rounded-full"></div>
                     </div>
                </div>
            </div>
           </div>
           
           {/* Shadow - now inside scaled container */}
           <div className="w-48 h-4 bg-black/40 rounded-[100%] blur-md mt-4"></div>
         </div>
      </div>
      
      {/* Category Selection Tooltip */}
      {currentStep === 'category' && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-40 pointer-events-none">
          <div className="bg-gradient-to-r from-bg-card to-bg-dark border border-primary rounded-md p-2 text-center shadow-lg transform scale-75 md:scale-100 origin-bottom">
            <div className="text-accent text-xs font-bold mb-1 whitespace-nowrap">SMART CALC</div>
            <div className="text-white text-xs opacity-80 leading-tight">Choose unit</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Robot;