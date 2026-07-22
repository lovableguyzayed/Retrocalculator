import React, { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import Robot, { RobotState } from "./Robot";
import ErrorNotification from "./ErrorNotification";
import ResultNotification from "./ResultNotification";
import LogicCalculation, { CalculatorStep } from "./LogicCalculation";
import NumberPad from "./NumberPad";

export default function ChatCalculator() {
  const [appStarted, setAppStarted] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [robotStatus, setRobotStatus] = useState<string>('READY');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Custom Number Pad State
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [onInputChange, setOnInputChange] = useState<((val: string) => void) | null>(null);

  const handleInputFocus = (id: string, currentVal: string, onChange: (val: string) => void) => {
    setActiveInputId(id);
    setInputValue(currentVal);
    setOnInputChange(() => onChange);
    playRetroSound('select');
  };

  const handleNumberPadInput = (char: string) => {
    // Prevent multiple decimals
    if (char === '.' && inputValue.includes('.')) return;
    
    const newVal = inputValue + char;
    setInputValue(newVal);
    if (onInputChange) onInputChange(newVal);
  };

  const handleNumberPadDelete = () => {
    const newVal = inputValue.slice(0, -1);
    setInputValue(newVal);
    if (onInputChange) onInputChange(newVal);
  };

  const handleNumberPadClear = () => {
    setInputValue('');
    if (onInputChange) onInputChange('');
  };

  const handleNumberPadDone = () => {
    setActiveInputId(null);
    setInputValue('');
    setOnInputChange(null);
  };

  // Shared state needed for Robot component
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('category');
  const [unitRate, setUnitRate] = useState<number>(0);
  const [baseUnit, setBaseUnit] = useState<string>('kg');

  // Custom Notification State
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Result Notification State
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerHaptic = async (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if ('vibrate' in navigator) {
        const duration = intensity === 'light' ? 50 : intensity === 'medium' ? 100 : 200;
        navigator.vibrate(duration);
      }
    } catch (error) {
      // Haptics not supported
    }
  };

  const showCustomNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    playRetroSound('error');
    triggerHaptic('medium');
  };

  const showResultNotification = (message: string) => {
    setResultMessage(message);
    setShowResult(true);
    // Sound is handled in LogicCalculation usually, but ensures sync if called elsewhere
  };

  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playRetroSound = (type: 'beep' | 'confirm' | 'calculate' | 'success' | 'select' | 'error' | 'swoosh' | 'digital' | 'laser' | 'coin' | 'power' | 'reset') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const playFreq = (freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.15) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        gain.gain.setValueAtTime(gainVal, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
      };

      switch(type) {
        case 'beep':
          playFreq(880, 0.1, 'sine', 0.2);
          break;
        case 'confirm':
          [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => playFreq(f, 0.3, 'sine', 0.1), i * 60);
          });
          break;
        case 'calculate':
          const cOsc = audioContext.createOscillator();
          const cGain = audioContext.createGain();
          cOsc.type = 'square';
          cOsc.frequency.setValueAtTime(300, audioContext.currentTime);
          cOsc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
          cGain.gain.setValueAtTime(0.08, audioContext.currentTime);
          cGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          cOsc.connect(cGain);
          cGain.connect(audioContext.destination);
          cOsc.start();
          cOsc.stop(audioContext.currentTime + 0.3);
          break;
        case 'success':
          [523, 659, 784, 1047].forEach((f, i) => {
            setTimeout(() => playFreq(f, 0.5, 'triangle', 0.15), i * 100);
          });
          break;
        case 'select':
          playFreq(1200, 0.08, 'sine', 0.1);
          break;
        case 'error':
          playFreq(150, 0.2, 'sawtooth', 0.2);
          break;
        case 'swoosh':
          const sOsc = audioContext.createOscillator();
          const sGain = audioContext.createGain();
          sOsc.frequency.setValueAtTime(1500, audioContext.currentTime);
          sOsc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
          sGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          sGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          sOsc.connect(sGain);
          sGain.connect(audioContext.destination);
          sOsc.start();
          sOsc.stop(audioContext.currentTime + 0.2);
          break;
        case 'digital':
          [800, 400, 800].forEach((f, i) => {
            setTimeout(() => playFreq(f, 0.1, 'square', 0.1), i * 50);
          });
          break;
        case 'laser':
          const lOsc = audioContext.createOscillator();
          const lGain = audioContext.createGain();
          lOsc.type = 'sawtooth';
          lOsc.frequency.setValueAtTime(2000, audioContext.currentTime);
          lOsc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
          lGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          lGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          lOsc.connect(lGain);
          lGain.connect(audioContext.destination);
          lOsc.start();
          lOsc.stop(audioContext.currentTime + 0.3);
          break;
        case 'coin':
          [880, 1108].forEach((f, i) => {
            setTimeout(() => playFreq(f, 0.25, 'sine', 0.15), i * 50);
          });
          break;
        case 'power':
          const pOsc = audioContext.createOscillator();
          const pGain = audioContext.createGain();
          pOsc.frequency.setValueAtTime(440, audioContext.currentTime);
          pOsc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.4);
          pGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          pGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.2);
          pGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          pOsc.connect(pGain);
          pGain.connect(audioContext.destination);
          pOsc.start();
          pOsc.stop(audioContext.currentTime + 0.4);
          break;
        case 'reset':
          const rOsc = audioContext.createOscillator();
          const rGain = audioContext.createGain();
          rOsc.type = 'square';
          rOsc.frequency.setValueAtTime(1000, audioContext.currentTime);
          rOsc.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.25);
          rGain.gain.setValueAtTime(0.15, audioContext.currentTime);
          rGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
          rOsc.connect(rGain);
          rGain.connect(audioContext.destination);
          rOsc.start();
          rOsc.stop(audioContext.currentTime + 0.25);
          break;
      }
    } catch (error) {
      console.log('Audio Context failed', error);
    }
  };

  const triggerRobotAnimation = (animation: RobotState) => {
    setRobotState('idle');
    setTimeout(() => {
      setRobotState(animation);
      let duration = 3000;
      if (animation === 'confirm-rate') duration = 1600;
      else if (animation === 'excited') duration = 4500;
      else if (animation === 'glitching') duration = 800;
      else if (animation === 'nodding') duration = 1500;
      else if (animation === 'teleporting') duration = 1200;
      else if (animation === 'processing') duration = 2000;
      else if (animation === 'thinking') duration = 2500;
      else if (animation === 'scanning') duration = 2000;
      else if (animation === 'amazed') duration = 2000;
      else if (animation === 'dancing') duration = 4200;
      else if (animation === 'celebrating') duration = 1000;
      else if (animation === 'wave') duration = 3600;
      else if (animation === 'weight-mode') duration = 1600;
      else if (animation === 'volume-mode') duration = 1600;
      
      setTimeout(() => {
        setRobotState('idle');
      }, duration);
    }, 50);
  };

  const updateSystemMessage = (html: string) => {
      const readout = document.querySelector('.header-chat');
      if (readout) readout.innerHTML = html;
  };

  // Sync handler to update Robot prop state when LogicCalculation changes
  const handleSyncState = ({ currentStep, unitRate, baseUnit }: { currentStep: CalculatorStep, unitRate: number, baseUnit: string }) => {
    setCurrentStep(currentStep);
    setUnitRate(unitRate);
    setBaseUnit(baseUnit);
  };

  const handleAppStart = () => {
    playRetroSound('power');
    setAppStarted(true);
    // Robot waves hello once the main screen is up.
    setTimeout(() => triggerRobotAnimation('wave'), 600);
  };

  if (!appStarted) {
    return <SplashScreen onStart={handleAppStart} />;
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-bg-dark text-white relative overflow-hidden chat-calculator">
      
      {/* Error Dialog Modal */}
      {showNotification && (
        <ErrorNotification 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)} 
        />
      )}

      {/* Result Dialog Modal */}
      {showResult && (
        <ResultNotification 
          message={resultMessage} 
          onClose={() => setShowResult(false)} 
        />
      )}
      
      {/* Chat Assistant Header - AUTO height: it grows to fit the whole message
          so long text is always fully visible (never clipped, never spilled).
          min-h keeps the original look for short messages. The divider that used
          to be an absolute line pinned at a fixed 176px is now this header's
          border-bottom, so it always sits at the real (dynamic) header edge. */}
      <div className="min-h-[11rem] bg-gradient-to-r from-bg-dark via-bg-card to-bg-dark p-4 relative flex-shrink-0 z-20 border-b-2 border-primary">

        {/* Offline indicator: the calculator is 100% local, so it keeps working
            with no network — this just tells the user they are offline. */}
        {!isOnline && (
          <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 border border-amber-400/70 text-amber-300 text-[10px] font-bold tracking-widest shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            OFFLINE
          </div>
        )}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 239, 187, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 239, 187, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px'
        }}></div>
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-xl border-2 border-accent flex items-center justify-center flex-shrink-0 shadow-lg relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-4 bg-gray-500 border border-dark-blue"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border border-red-700 animate-pulse"></div>
            <div className="flex space-x-2 bg-black/40 p-1.5 rounded-md border border-gray-600">
              <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_5px_#EFEFBB]"></div>
              <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_5px_#EFEFBB]"></div>
            </div>
            <div className="absolute -left-2 w-1.5 h-6 bg-gray-500 rounded-l border border-dark-blue"></div>
            <div className="absolute -right-2 w-1.5 h-6 bg-gray-500 rounded-r border border-dark-blue"></div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="text-accent text-xs sm:text-sm font-bold mb-2 tracking-wider flex items-center">
              <i className="fas fa-robot mr-2"></i>
              RETRO-BOT ASSISTANT
            </div>
            <div className="text-white text-sm sm:text-base font-semibold mb-1 tracking-wide break-words">
              Welcome to Quantity Price Calculator
            </div>
            {/* Bubble grows with its content so the full message shows. It only
                starts scrolling past 40vh, which real messages never reach. */}
            <div className="w-full">
              <div className="chat-bubble-retro w-full max-h-[40vh] overflow-y-auto">
                <div className="header-chat text-white text-xs font-medium leading-tight w-full min-w-0">
                  <div>
                    🤖 Welcome to Quantity Price Calculator!<br />
                    <span className="text-accent font-bold">Select your unit category to begin calculations</span><br />
                    <span className="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Default Flex (Row) */}
      <div className={`flex-1 flex relative z-10 overflow-hidden transition-all duration-300 ${activeInputId ? 'pointer-events-none' : ''}`}>
        
        {/* Left Side - Robot */}
        <Robot 
          state={robotState}
          currentStep={currentStep}
          unitRate={unitRate}
          baseUnit={baseUnit}
        />
        
        {/* Right Side - Interface */}
        <LogicCalculation 
          playRetroSound={playRetroSound}
          triggerHaptic={triggerHaptic}
          showCustomNotification={showCustomNotification}
          showResultNotification={showResultNotification}
          triggerRobotAnimation={triggerRobotAnimation}
          updateSystemMessage={updateSystemMessage}
          setRobotStatus={setRobotStatus}
          onSyncState={handleSyncState}
          activeInputId={activeInputId}
          onInputFocus={handleInputFocus}
        />
        
      </div>

      {activeInputId && (
        <NumberPad 
          onInput={handleNumberPadInput}
          onDelete={handleNumberPadDelete}
          onClear={handleNumberPadClear}
          onDone={handleNumberPadDone}
          playRetroSound={playRetroSound}
        />
      )}
    </div>
  );
}
