import React, { useState, useRef, useEffect } from "react";
import { RobotState } from "./Robot";

export type CalculatorStep = 'category' | 'base-rate' | 'calculator';
export type UnitCategory = 'weight' | 'volume' | null;

interface LogicCalculationProps {
  playRetroSound: (type: 'beep' | 'confirm' | 'calculate' | 'success' | 'select' | 'error' | 'swoosh' | 'digital' | 'laser' | 'coin' | 'power' | 'reset') => void;
  triggerHaptic: (intensity?: 'light' | 'medium' | 'heavy') => void;
  showCustomNotification: (message: string) => void;
  showResultNotification: (message: string) => void;
  triggerRobotAnimation: (animation: RobotState) => void;
  updateSystemMessage: (html: string) => void;
  setRobotStatus: (status: string) => void;
  onSyncState: (data: { currentStep: CalculatorStep; unitRate: number; baseUnit: string }) => void;
  activeInputId: string | null;
  onInputFocus: (id: string, currentVal: string, onChange: (val: string) => void) => void;
}

const LogicCalculation: React.FC<LogicCalculationProps> = ({
  playRetroSound,
  triggerHaptic,
  showCustomNotification,
  showResultNotification,
  triggerRobotAnimation,
  updateSystemMessage,
  setRobotStatus,
  onSyncState,
  activeInputId,
  onInputFocus
}) => {
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(null);
  
  // Base rate configuration
  const [basePrice, setBasePrice] = useState<string>('');
  const [baseQuantity, setBaseQuantity] = useState<string>('');
  const [baseUnit, setBaseUnit] = useState<string>('kg');
  const [unitRate, setUnitRate] = useState<number>(0);
  
  // Calculator inputs
  const [calcPrice, setCalcPrice] = useState<string>('');
  const [calcQuantity, setCalcQuantity] = useState<string>('');
  const [calcUnit, setCalcUnit] = useState<string>('kg');
  const [priceResult, setPriceResult] = useState<string>('');
  const [quantityResult, setQuantityResult] = useState<string>('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState<'price-to-quantity' | 'quantity-to-price' | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with parent for Robot display
  useEffect(() => {
    onSyncState({ currentStep, unitRate, baseUnit });
  }, [currentStep, unitRate, baseUnit, onSyncState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectCategory = (category: UnitCategory) => {
    playRetroSound('digital');
    triggerHaptic('light');
    setSelectedCategory(category);
    setCurrentStep('base-rate');
    
    if (category === 'weight') {
      triggerRobotAnimation('weight-mode');
      setBaseUnit('kg');
      setCalcUnit('kg');
    } else {
      triggerRobotAnimation('volume-mode');
      setBaseUnit('l');
      setCalcUnit('l');
    }
    
    // Add chatty robot response for category selection
    const categoryResponse = category === 'weight' ? 
      "Excellent choice! Weight calculations are perfect for solid items like grains, spices, or produce. Let's set up your rate!" :
      "Great selection! Volume calculations work wonderfully for liquids like oil, milk, or any fluid measurements. Let's configure your rate!";
    
    setTimeout(() => {
        updateSystemMessage(`
          🤖 ${categoryResponse}<br />
          <span class="text-accent font-bold">Let's configure your ${category} calculations!</span><br />
          <span class="text-xs opacity-80">Enter your base price and quantity below.</span>
        `);
    }, 500);
    
    setRobotStatus('PROCESSING');
    triggerRobotAnimation('excited');
    
    setTimeout(() => {
      setRobotStatus('READY');
    }, 2000);
  };

  const setBaseRate = () => {
    const price = parseFloat(basePrice);
    const quantity = parseFloat(baseQuantity);
    
    if (!price || !quantity || price <= 0 || quantity <= 0 || isNaN(price) || isNaN(quantity)) {
      showCustomNotification('Please enter valid positive numbers for both price and quantity');
      return;
    }
    
    const rate = price / quantity;
    setUnitRate(rate);
    setCurrentStep('calculator');
    setRobotStatus('GROOVING');
    
    playRetroSound('success');
    triggerHaptic('medium');
    
    setTimeout(() => {
      triggerRobotAnimation('dancing');
    }, 50);
    
    setTimeout(() => {
      setRobotStatus('READY');
    }, 4200);
  };

  return (
    <div className="w-1/2 h-full bg-bg-card p-4 pt-4 relative overflow-y-auto z-20 flex flex-col" style={{ zIndex: 10 }}>
      
      {/* Step 1: Category Selection */}
      {currentStep === 'category' && (
        <div className="space-y-4 mt-4 flex-1">
          <div className="text-accent font-bold text-sm mb-6 flex items-center tracking-wide">
            <i className="fas fa-list-ul mr-2 text-base"></i>
            SELECT UNIT CATEGORY
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => selectCategory('weight')} 
              className="btn-retro w-full p-4 rounded-lg text-white font-bold text-sm flex items-center group hover:scale-[1.02] transition-transform"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-4 border-2 border-dark-blue shadow-md">
                <i className="fas fa-weight-hanging text-dark-blue text-lg"></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-base tracking-wide">WEIGHT</div>
                <div className="text-xs opacity-90 font-medium">kilogram / gram</div>
              </div>
              <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center ml-3">
                <i className="fas fa-chevron-right text-xs text-accent"></i>
              </div>
            </button>
            <button 
              onClick={() => selectCategory('volume')} 
              className="btn-retro w-full p-4 rounded-lg text-white font-bold text-sm flex items-center group hover:scale-[1.02] transition-transform"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-4 border-2 border-dark-blue shadow-md">
                <i className="fas fa-flask text-dark-blue text-lg"></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-base tracking-wide">VOLUME</div>
                <div className="text-xs opacity-90 font-medium">litre / millilitre</div>
              </div>
              <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center ml-3">
                <i className="fas fa-chevron-right text-xs text-accent"></i>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Base Rate Setup */}
      {currentStep === 'base-rate' && (
        <div className="space-y-4 mt-4 flex-1">
          <button
            onClick={() => {
              setCurrentStep('category');
              setSelectedCategory(null);
            }}
            className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Categories
          </button>
          <div className="text-accent font-bold text-sm mb-6 flex items-center tracking-wide">
            <i className="fas fa-cogs mr-2 text-base"></i>
            BASE RATE CONFIG
          </div>
          <div className={`retro-panel rounded-lg p-4 space-y-6 ${activeInputId ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Enter Base Price (₹):</label>
              <div 
                onClick={() => onInputFocus('basePrice', basePrice, setBasePrice)}
                className={`input-retro w-full p-4 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 transition-all cursor-pointer flex items-center justify-between ${activeInputId === 'basePrice' ? 'border-accent shadow-[0_0_15px_rgba(239,239,187,0.5)] scale-[1.02] opacity-100 pointer-events-auto' : 'border-primary'}`}
              >
                <span>{basePrice || <span className="text-gray-500 font-normal">0.00</span>}</span>
                <i className="fas fa-keyboard text-xs opacity-50"></i>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Enter Quantity:</label>
                <div 
                  onClick={() => onInputFocus('baseQuantity', baseQuantity, setBaseQuantity)}
                  className={`input-retro w-full p-4 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 transition-all cursor-pointer flex items-center justify-between ${activeInputId === 'baseQuantity' ? 'border-accent shadow-[0_0_15px_rgba(239,239,187,0.5)] scale-[1.02] opacity-100 pointer-events-auto' : 'border-primary'}`}
                >
                  <span>{baseQuantity || <span className="text-gray-500 font-normal">1</span>}</span>
                  <i className="fas fa-keyboard text-xs opacity-50"></i>
                </div>
              </div>
              
              <div>
                <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Select Unit:</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      triggerRobotAnimation('amazed');
                    }}
                    className="input-retro w-full p-4 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors flex items-center justify-between"
                  >
                    <span>{baseUnit}</span>
                    <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs`}></i>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary rounded-lg shadow-lg z-[1000] mt-1">
                      {selectedCategory === 'weight' ? (
                        <>
                          <button
                            onClick={() => {
                              setBaseUnit('g');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  🤖 Nice choice! Grams selected.<br />
                                  <span class="text-accent font-bold">Perfect for precise small measurements like spices!</span><br />
                                  <span class="text-xs opacity-80">Great for detailed calculations!</span>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'g' ? 'bg-primary/30' : ''}`}
                          >
                            g (gram)
                          </button>
                          <button
                            onClick={() => {
                              setBaseUnit('kg');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Perfect! Kilogram selected.</div>
                                  <div class="mb-1">Great standard unit for most weight calculations!</div>
                                  <div>Very practical choice!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'kg' ? 'bg-primary/30' : ''}`}
                          >
                            kg (kilogram)
                          </button>
                          <button
                            onClick={() => {
                              setBaseUnit('quintal');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Impressive! Quintal selected.</div>
                                  <div class="mb-1">Perfect for bulk agricultural products!</div>
                                  <div>Excellent for wholesale calculations!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'quintal' ? 'bg-primary/30' : ''}`}
                          >
                            quintal
                          </button>
                          <button
                            onClick={() => {
                              setBaseUnit('ton');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Wow! Ton selected.</div>
                                  <div class="mb-1">For heavy-duty industrial calculations!</div>
                                  <div>Perfect for construction materials!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'ton' ? 'bg-primary/30' : ''}`}
                          >
                            ton
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setBaseUnit('ml');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Smart choice! Milliliters selected.</div>
                                  <div class="mb-1">Perfect for medicines and precise liquids!</div>
                                  <div>Very accurate measurements!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'ml' ? 'bg-primary/30' : ''}`}
                          >
                            ml (milliliter)
                          </button>
                          <button
                            onClick={() => {
                              setBaseUnit('l');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Excellent! Liters selected.</div>
                                  <div class="mb-1">Ideal for everyday liquids like milk and oil!</div>
                                  <div>A very practical standard unit!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'l' ? 'bg-primary/30' : ''}`}
                          >
                            l (liter)
                          </button>
                          <button
                            onClick={() => {
                              setBaseUnit('gallon');
                              setIsDropdownOpen(false);
                              triggerRobotAnimation('nodding');
                              setTimeout(() => updateSystemMessage(`
                                  <div class="mb-1">🤖 Great! Gallons selected.</div>
                                  <div class="mb-1">Perfect for fuel tanks and water storage!</div>
                                  <div>Nice selection for large volumes!</div>
                              `), 300);
                            }}
                            className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'gallon' ? 'bg-primary/30' : ''}`}
                          >
                            gallon
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={setBaseRate}
                className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
              >
                <i className="fas fa-check-circle mr-2"></i>
                CONFIRM RATE
              </button>
              <button 
                onClick={() => {
                  playRetroSound('reset');
                  setBasePrice('');
                  setBaseQuantity('');
                  setBaseUnit(selectedCategory === 'weight' ? 'kg' : 'l');
                  triggerRobotAnimation('glitching');
                }}
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-medium hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-undo-alt"></i>
                <span>CLEAR VALUES</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 3: Calculator */}
      {currentStep === 'calculator' && (
        <div className="space-y-4">
          
          {calculatorTab === null && (
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setCurrentStep('base-rate')}
                className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Rate Config
              </button>
              <button
                onClick={() => {
                  playRetroSound('beep');
                  setCalculatorTab('price-to-quantity');
                  triggerRobotAnimation('processing');
                  setTimeout(() => {
                      updateSystemMessage(`
                        🤖 Price Calculator activated!<br />
                        <span class="text-accent font-bold">Enter your budget to find out how much you can buy</span><br />
                        <span class="text-xs opacity-80">Perfect for smart shopping decisions!</span>
                      `);
                  }, 100);
                }}
                className="retro-card-hover w-full p-3 rounded-lg bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary hover:border-accent transition-colors group relative overflow-hidden"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3 border-2 border-dark-blue shadow-md flex-shrink-0">
                    <i className="fas fa-money-bill-wave text-dark-blue text-sm"></i>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-xs tracking-wide truncate">PRICE CALCULATOR</div>
                    <div className="text-xs opacity-90 font-medium truncate">Enter price to get quantity</div>
                  </div>
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"></i>
                </div>
              </button>
              
              <button
                onClick={() => {
                  playRetroSound('beep');
                  setCalculatorTab('quantity-to-price');
                  triggerRobotAnimation('processing');
                  setTimeout(() => {
                      updateSystemMessage(`
                        🤖 Quantity Calculator ready!<br />
                        <span class="text-accent font-bold">Enter quantity to find the total cost</span><br />
                        <span class="text-xs opacity-80">Great for bulk purchases and trading!</span>
                      `);
                  }, 100);
                }}
                className="retro-card-hover w-full p-3 rounded-lg bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary hover:border-accent transition-colors group relative overflow-hidden"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3 border-2 border-dark-blue shadow-md flex-shrink-0">
                    <i className="fas fa-balance-scale text-dark-blue text-sm"></i>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-xs tracking-wide truncate">QUANTITY CALCULATOR</div>
                    <div className="text-xs opacity-90 font-medium truncate">Enter quantity to get price</div>
                  </div>
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"></i>
                </div>
              </button>
            </div>
          )}

          {/* Price Calculator Screen */}
          {calculatorTab === 'price-to-quantity' && (
            <div className="space-y-4 pb-12">
              <button
                onClick={() => setCalculatorTab(null)}
                className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Calculator Selection
              </button>
              <div className={`retro-panel rounded-lg p-4 space-y-4 ${activeInputId ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="text-accent font-bold text-sm mb-4 flex items-center tracking-wide">
                  <i className="fas fa-money-bill-wave mr-2 text-base"></i>
                  PRICE CALCULATOR
                </div>
                <div>
                  <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Enter Price (₹):</label>
                  <div 
                    onClick={() => onInputFocus('calcPrice', calcPrice, setCalcPrice)}
                    className={`input-retro w-full p-3 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 transition-all cursor-pointer flex items-center justify-between ${activeInputId === 'calcPrice' ? 'border-accent shadow-[0_0_15px_rgba(239,239,187,0.5)] scale-[1.02] opacity-100 pointer-events-auto' : 'border-primary'}`}
                  >
                    <span>{calcPrice || <span className="text-gray-500 font-normal">0.00</span>}</span>
                    <i className="fas fa-keyboard text-xs opacity-50"></i>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (!calcPrice || parseFloat(calcPrice) <= 0 || isNaN(parseFloat(calcPrice))) {
                        showCustomNotification('Please enter a valid price amount');
                        return;
                      }

                      playRetroSound('calculate');
                      if (calcPrice && unitRate) {
                        const quantity = parseFloat(calcPrice) / unitRate;
                        
                        // Auto-convert to appropriate unit
                        let displayQuantity = quantity;
                        let displayUnit = baseUnit;
                        
                        if (selectedCategory === 'weight') {
                          // Weight conversions - both directions
                          if (baseUnit === 'g') {
                            if (quantity >= 1000000) {
                              displayQuantity = quantity / 1000000;
                              displayUnit = 'ton';
                            } else if (quantity >= 100000) {
                              displayQuantity = quantity / 100000;
                              displayUnit = 'quintal';
                            } else if (quantity >= 1000) {
                              displayQuantity = quantity / 1000;
                              displayUnit = 'kg';
                            }
                          } else if (baseUnit === 'kg') {
                            if (quantity >= 1000) {
                              displayQuantity = quantity / 1000;
                              displayUnit = 'ton';
                            } else if (quantity >= 100) {
                              displayQuantity = quantity / 100;
                              displayUnit = 'quintal';
                            } else if (quantity < 1) {
                              displayQuantity = quantity * 1000;
                              displayUnit = 'g';
                            }
                          } else if (baseUnit === 'quintal') {
                            if (quantity >= 10) {
                              displayQuantity = quantity / 10;
                              displayUnit = 'ton';
                            } else if (quantity < 1) {
                              if (quantity * 100 >= 1) {
                                displayQuantity = quantity * 100;
                                displayUnit = 'kg';
                              } else {
                                displayQuantity = quantity * 100000;
                                displayUnit = 'g';
                              }
                            }
                          } else if (baseUnit === 'ton') {
                            if (quantity < 1) {
                              if (quantity * 1000 >= 1) {
                                displayQuantity = quantity * 1000;
                                displayUnit = 'kg';
                              } else if (quantity * 10 >= 1) {
                                displayQuantity = quantity * 10;
                                displayUnit = 'quintal';
                              } else {
                                displayQuantity = quantity * 1000000;
                                displayUnit = 'g';
                              }
                            }
                          }
                        } else if (selectedCategory === 'volume') {
                          // Volume conversions - both directions
                          if (baseUnit === 'ml') {
                            if (quantity >= 3785.41) {
                              displayQuantity = quantity / 3785.41;
                              displayUnit = 'gallon';
                            } else if (quantity >= 1000) {
                              displayQuantity = quantity / 1000;
                              displayUnit = 'l';
                            }
                          } else if (baseUnit === 'l') {
                            if (quantity >= 3.785) {
                              displayQuantity = quantity / 3.785;
                              displayUnit = 'gallon';
                            } else if (quantity < 1) {
                              displayQuantity = quantity * 1000;
                              displayUnit = 'ml';
                            }
                          } else if (baseUnit === 'gallon') {
                            if (quantity < 1) {
                              if (quantity * 3.785 >= 1) {
                                displayQuantity = quantity * 3.785;
                                displayUnit = 'l';
                              } else {
                                displayQuantity = quantity * 3785.41;
                                displayUnit = 'ml';
                              }
                            }
                          }
                        }
                        
                        const finalResult = selectedCategory === 'weight' ? 
                          `${displayQuantity.toFixed(3)} ${displayUnit}` :
                          displayQuantity >= 1 ? 
                          `${displayQuantity.toFixed(2)} ${displayUnit}` : 
                          `${displayQuantity.toFixed(4)} ${displayUnit}`;
                        
                        setQuantityResult(finalResult);
                        showResultNotification(finalResult);
                        
                        setTimeout(() => {
                            updateSystemMessage(`
                            🤖 Excellent! For ₹${calcPrice}, you get ${finalResult}.<br />
                            <span class="text-accent font-bold">Price calculation completed!</span><br />
                            <span class="text-xs opacity-80">Rate: ₹${unitRate.toFixed(2)} per ${baseUnit}. Great deal!</span>
                          `);
                        }, 100);
                        
                        triggerRobotAnimation('excited');
                      }
                    }}
                    className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
                  >
                    <i className="fas fa-calculator mr-2"></i>
                    CALCULATE QUANTITY
                  </button>
                  <button 
                    onClick={() => {
                      playRetroSound('reset');
                      setCalcPrice('');
                      setQuantityResult('');
                      triggerRobotAnimation('glitching');
                    }}
                    className="w-full py-1.5 px-3 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-normal hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <i className="fas fa-eraser text-xs"></i>
                    <span>CLEAR</span>
                  </button>
                </div>
                {quantityResult && (
                  <div 
                    className="mt-3 text-center p-3 rounded bg-accent/10 border-2 border-accent animate-pulse-slow cursor-pointer hover:bg-accent/20 transition-colors group"
                    onClick={() => {
                      if (quantityResult) {
                        playRetroSound('beep');
                        showResultNotification(quantityResult);
                      }
                    }}
                  >
                    <div className="text-accent text-[10px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                      RESULT <i className="fas fa-expand-alt text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                    <div className="text-white text-lg font-black break-words leading-tight">{quantityResult}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity Calculator Screen */}
          {calculatorTab === 'quantity-to-price' && (
            <div className="space-y-4 pb-12">
              <button
                onClick={() => setCalculatorTab(null)}
                className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Calculator Selection
              </button>
              <div className={`retro-panel rounded-lg p-4 space-y-4 ${activeInputId ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="text-accent font-bold text-sm mb-4 flex items-center tracking-wide">
                  <i className="fas fa-balance-scale mr-2 text-base"></i>
                  QUANTITY CALCULATOR
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Enter Quantity:</label>
                    <div 
                      onClick={() => onInputFocus('calcQuantity', calcQuantity, setCalcQuantity)}
                      className={`input-retro w-full p-3 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 transition-all cursor-pointer flex items-center justify-between ${activeInputId === 'calcQuantity' ? 'border-accent shadow-[0_0_15px_rgba(239,239,187,0.5)] scale-[1.02] opacity-100 pointer-events-auto' : 'border-primary'}`}
                    >
                      <span>{calcQuantity || <span className="text-gray-500 font-normal">0.00</span>}</span>
                      <i className="fas fa-keyboard text-xs opacity-50"></i>
                    </div>
                  </div>
                  <div>
                    <label className="text-primary font-bold text-xs block mb-2 tracking-wide uppercase">Select Unit:</label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                          triggerRobotAnimation('amazed');
                        }}
                        className="input-retro w-full p-3 rounded-lg text-white text-base font-bold bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors flex items-center justify-between"
                      >
                        <span>{calcUnit}</span>
                        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs`}></i>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary rounded-lg shadow-lg z-[1000] mt-1 max-h-48 overflow-y-auto">
                          {selectedCategory === 'weight' ? (
                            <>
                              <button
                                onClick={() => {
                                  setCalcUnit('g');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'g' ? 'bg-primary/30' : ''}`}
                              >
                                g (gram)
                              </button>
                              <button
                                onClick={() => {
                                  setCalcUnit('kg');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'kg' ? 'bg-primary/30' : ''}`}
                              >
                                kg (kilogram)
                              </button>
                              <button
                                onClick={() => {
                                  setCalcUnit('quintal');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'quintal' ? 'bg-primary/30' : ''}`}
                              >
                                quintal
                              </button>
                              <button
                                onClick={() => {
                                  setCalcUnit('ton');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'ton' ? 'bg-primary/30' : ''}`}
                              >
                                ton
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setCalcUnit('ml');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'ml' ? 'bg-primary/30' : ''}`}
                              >
                                ml (milliliter)
                              </button>
                              <button
                                onClick={() => {
                                  setCalcUnit('l');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'l' ? 'bg-primary/30' : ''}`}
                              >
                                l (liter)
                              </button>
                              <button
                                onClick={() => {
                                  setCalcUnit('gallon');
                                  setIsDropdownOpen(false);
                                  triggerRobotAnimation('nodding');
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'gallon' ? 'bg-primary/30' : ''}`}
                              >
                                gallon
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (!calcQuantity || parseFloat(calcQuantity) <= 0 || isNaN(parseFloat(calcQuantity))) {
                        showCustomNotification('Please enter a valid quantity');
                        return;
                      }

                      playRetroSound('calculate');
                      if (calcQuantity && unitRate) {
                        // Convert calcQuantity to base unit for calculation
                        let convertedQuantity = parseFloat(calcQuantity);
                        
                        // Convert to base unit
                        if (selectedCategory === 'weight') {
                          if (baseUnit === 'kg') {
                            if (calcUnit === 'g') convertedQuantity = convertedQuantity / 1000;
                            else if (calcUnit === 'quintal') convertedQuantity = convertedQuantity * 100;
                            else if (calcUnit === 'ton') convertedQuantity = convertedQuantity * 1000;
                          } else if (baseUnit === 'g') {
                            if (calcUnit === 'kg') convertedQuantity = convertedQuantity * 1000;
                            else if (calcUnit === 'quintal') convertedQuantity = convertedQuantity * 100000;
                            else if (calcUnit === 'ton') convertedQuantity = convertedQuantity * 1000000;
                          } else if (baseUnit === 'quintal') {
                            if (calcUnit === 'g') convertedQuantity = convertedQuantity / 100000;
                            else if (calcUnit === 'kg') convertedQuantity = convertedQuantity / 100;
                            else if (calcUnit === 'ton') convertedQuantity = convertedQuantity * 10;
                          } else if (baseUnit === 'ton') {
                            if (calcUnit === 'g') convertedQuantity = convertedQuantity / 1000000;
                            else if (calcUnit === 'kg') convertedQuantity = convertedQuantity / 1000;
                            else if (calcUnit === 'quintal') convertedQuantity = convertedQuantity / 10;
                          }
                        } else {
                          if (baseUnit === 'l') {
                            if (calcUnit === 'ml') convertedQuantity = convertedQuantity / 1000;
                            else if (calcUnit === 'gallon') convertedQuantity = convertedQuantity * 3.785;
                          } else if (baseUnit === 'ml') {
                            if (calcUnit === 'l') convertedQuantity = convertedQuantity * 1000;
                            else if (calcUnit === 'gallon') convertedQuantity = convertedQuantity * 3785.41;
                          } else if (baseUnit === 'gallon') {
                            if (calcUnit === 'ml') convertedQuantity = convertedQuantity / 3785.41;
                            else if (calcUnit === 'l') convertedQuantity = convertedQuantity / 3.785;
                          }
                        }
                        
                        const priceValue = convertedQuantity * unitRate;
                        const result = `₹ ${priceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        setPriceResult(result);
                        showResultNotification(result);
                        
                        setTimeout(() => {
                            updateSystemMessage(`
                            🤖 Perfect! ${calcQuantity} ${calcUnit} costs ${result}.<br />
                            <span class="text-accent font-bold">Quantity calculation completed!</span><br />
                            <span class="text-xs opacity-80">Rate: ₹${unitRate.toFixed(2)} per ${baseUnit}. Excellent value!</span>
                          `);
                        }, 100);
                        
                        triggerRobotAnimation('excited');
                      }
                    }}
                    className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
                  >
                    <i className="fas fa-calculator mr-2"></i>
                    CALCULATE PRICE
                  </button>
                  <button 
                    onClick={() => {
                      playRetroSound('reset');
                      setCalcQuantity('');
                      setPriceResult('');
                      triggerRobotAnimation('glitching');
                    }}
                    className="w-full py-1.5 px-3 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-normal hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <i className="fas fa-eraser text-xs"></i>
                    <span>CLEAR</span>
                  </button>
                </div>
                {priceResult && (
                  <div 
                    className="mt-3 text-center p-3 rounded bg-primary/10 border-2 border-primary animate-pulse-slow cursor-pointer hover:bg-primary/20 transition-colors group"
                    onClick={() => {
                      if (priceResult) {
                        playRetroSound('beep');
                        showResultNotification(priceResult);
                      }
                    }}
                  >
                    <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                      RESULT <i className="fas fa-expand-alt text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                    <div className="text-white text-lg font-black break-words leading-tight">{priceResult}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-600 pt-6 mt-6 pb-12">
            <button 
              onClick={() => {
                setCurrentStep('category');
                setSelectedCategory(null);
                setBasePrice('');
                setBaseQuantity('');
                setBaseUnit('kg');
                setUnitRate(0);
                setCalcPrice('');
                setCalcQuantity('');
                setCalcUnit('kg');
                setPriceResult('');
                setQuantityResult('');
                setCalculatorTab(null);
                triggerRobotAnimation('teleporting');
              }}
              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium text-xs hover:from-red-500 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <i className="fas fa-power-off"></i>
              <span>RESET CALCULATOR</span>
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default LogicCalculation;