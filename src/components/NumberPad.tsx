import React from 'react';

interface NumberPadProps {
  onInput: (value: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onDone: () => void;
  playRetroSound?: (type: any) => void;
}

const NumberPad: React.FC<NumberPadProps> = ({ 
  onInput, 
  onDelete, 
  onClear, 
  onDone,
  playRetroSound 
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  const handleKeyPress = (key: string) => {
    if (playRetroSound) playRetroSound('beep');
    if (key === '⌫') {
      onDelete();
    } else {
      onInput(key);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-bg-card border-t-2 border-primary p-4 grid grid-cols-4 gap-2 z-[100] animate-slide-up shadow-[0_-10px_30px_rgba(107,136,211,0.2)]">
      <div className="col-span-3 grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="h-14 bg-bg-dark border-2 border-primary rounded-lg text-white font-bold text-xl active:bg-primary active:text-bg-dark transition-colors flex items-center justify-center"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => { if (playRetroSound) playRetroSound('reset'); onClear(); }}
          className="h-14 bg-red-900/40 border-2 border-red-500 rounded-lg text-red-500 font-bold text-sm"
        >
          CLEAR
        </button>
        <button
          onClick={() => { if (playRetroSound) playRetroSound('confirm'); onDone(); }}
          className="h-[120px] bg-primary border-2 border-accent rounded-lg text-bg-dark font-bold text-lg"
        >
          DONE
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
