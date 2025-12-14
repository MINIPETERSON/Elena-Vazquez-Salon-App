import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { AppStep, Mode, HairOption, SimulationResult } from './types';
import { COLOR_OPTIONS, WOMEN_CUT_OPTIONS, MEN_CUT_OPTIONS } from './constants';
import { fileToGenerativePart, generateSimulation } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // UI Tab state
  const [activeTab, setActiveTab] = useState<Mode>(Mode.CUT);
  const [cutGender, setCutGender] = useState<'WOMEN' | 'MEN'>('WOMEN');
  
  // Selection State (Independent)
  const [selectedCut, setSelectedCut] = useState<HairOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<HairOption | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("La imagen es demasiado grande. Máximo 10MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(AppStep.SIMULATE);
      setError(null);
    }
  };

  const handleOptionToggle = (option: HairOption, type: Mode) => {
    if (type === Mode.CUT) {
      if (selectedCut?.id === option.id) {
        setSelectedCut(null);
      } else {
        setSelectedCut(option);
      }
    } else {
      if (selectedColor?.id === option.id) {
        setSelectedColor(null);
      } else {
        setSelectedColor(option);
      }
    }
  };

  const startSimulation = async () => {
    if (!selectedFile) return;
    if (!selectedCut && !selectedColor && !customPrompt.trim()) {
      setError("Por favor selecciona un estilo, un color o describe lo que quieres.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const simulationData = await generateSimulation(
        base64Data, 
        selectedCut, 
        selectedColor, 
        customPrompt
      );
      
      setResult({
        generatedImageBase64: simulationData.image,
        advice: simulationData.advice
      });
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al generar la simulación. Por favor, intenta de nuevo.");
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setStep(AppStep.UPLOAD);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedCut(null);
    setSelectedColor(null);
    setCustomPrompt("");
    setResult(null);
    setError(null);
  };

  // --- RENDERERS ---

  const renderUploadHero = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
            AI Hair Simulator
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-sans font-light">
            Sube tu foto y prueba nuevos looks al instante. Combina cortes y colores a tu gusto.
          </p>
        </div>

        {/* Upload Box */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer relative bg-white border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-3xl p-12 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
              📸
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Click para subir foto</h3>
              <p className="text-gray-400 text-sm">JPG o PNG hasta 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimulator = () => {
    // Determine options based on state
    let options: HairOption[] = [];
    if (activeTab === Mode.COLOR) {
      options = COLOR_OPTIONS;
    } else {
      options = cutGender === 'WOMEN' ? WOMEN_CUT_OPTIONS : MEN_CUT_OPTIONS;
    }

    const currentSelection = activeTab === Mode.COLOR ? selectedColor : selectedCut;

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Image Preview */}
          <div className="relative bg-gray-100 aspect-video md:aspect-[21/9] overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 backdrop-blur-[2px]">
               {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="h-full w-auto object-contain shadow-lg rounded-lg"
                  />
               )}
            </div>
            <button 
              onClick={resetApp}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white text-gray-700 shadow-sm transition-all z-10"
              title="Cambiar foto"
            >
              🔄
            </button>

            {/* Selection Summaries (Overlay) */}
            <div className="absolute bottom-4 left-4 flex gap-2">
               {selectedCut && (
                 <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm border border-indigo-100 flex items-center gap-1">
                   ✂️ {selectedCut.name}
                 </span>
               )}
               {selectedColor && (
                 <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pink-900 shadow-sm border border-pink-100 flex items-center gap-1">
                   🎨 {selectedColor.name}
                 </span>
               )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Tabs */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center border-b border-gray-100 pb-1">
                 <button 
                   onClick={() => setActiveTab(Mode.CUT)}
                   className={`px-8 py-3 font-bold text-sm transition-all border-b-2 ${
                     activeTab === Mode.CUT 
                     ? 'border-indigo-600 text-indigo-600' 
                     : 'border-transparent text-gray-400 hover:text-gray-600'
                   } flex items-center gap-2 relative`}
                 >
                   <span>✂️</span> Cortes
                   {selectedCut && activeTab !== Mode.CUT && (
                     <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                   )}
                 </button>
                 <button 
                   onClick={() => setActiveTab(Mode.COLOR)}
                   className={`px-8 py-3 font-bold text-sm transition-all border-b-2 ${
                     activeTab === Mode.COLOR 
                     ? 'border-indigo-600 text-indigo-600' 
                     : 'border-transparent text-gray-400 hover:text-gray-600'
                   } flex items-center gap-2 relative`}
                 >
                   <span>🎨</span> Color
                   {selectedColor && activeTab !== Mode.COLOR && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
                   )}
                 </button>
              </div>

              {/* Gender Sub-selector (Only visible when CUT tab is active) */}
              {activeTab === Mode.CUT && (
                <div className="flex justify-center animate-fade-in">
                  <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
                    <button
                      onClick={() => setCutGender('WOMEN')}
                      className={`px-4 py-1.5 rounded-md transition-all ${
                        cutGender === 'WOMEN' 
                          ? 'bg-white text-gray-900 shadow-sm font-bold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      👩 Mujer
                    </button>
                    <button
                      onClick={() => setCutGender('MEN')}
                      className={`px-4 py-1.5 rounded-md transition-all ${
                        cutGender === 'MEN' 
                          ? 'bg-white text-gray-900 shadow-sm font-bold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      👨 Hombre
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Presets / Chips Grid */}
            <div className="space-y-3 min-h-[150px]">
              <div className="flex flex-wrap gap-2 justify-center">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionToggle(opt, activeTab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
                      currentSelection?.id === opt.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500 transform scale-105'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Detalles Extra (Opcional)
              </label>
              <div className="relative">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ej: Hazlo un poco más largo en los lados, o añade un tono más oscuro en las raíces..."
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none h-20 text-gray-700 placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={startSimulation}
              disabled={isGenerating || (!selectedCut && !selectedColor && !customPrompt.trim())}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 ${
                isGenerating 
                  ? 'bg-indigo-400 cursor-wait' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creando Estilo...
                </>
              ) : (
                <>
                  ✨ Generar Nuevo Look
                </>
              )}
            </button>
             {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>
            )}
          </div>
        </div>
        
        {/* Result Area (Inline) */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 md:p-8 border-b border-gray-100">
               <h3 className="text-2xl font-serif font-bold text-gray-900">Resultado</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0">
               {/* Result Image */}
               <div className="bg-gray-100 p-8 flex items-center justify-center">
                 {result.generatedImageBase64 ? (
                    <img 
                      src={`data:image/jpeg;base64,${result.generatedImageBase64}`} 
                      className="rounded-xl shadow-lg max-h-[500px] w-auto object-contain"
                      alt="Result"
                    />
                 ) : (
                   <div className="text-gray-400">Error en la imagen</div>
                 )}
               </div>

               {/* Result Details */}
               <div className="p-8 bg-gradient-to-br from-white to-purple-50 flex flex-col justify-center space-y-6">
                 <div>
                   <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                     <span>🤖</span> Análisis de IA
                   </h4>
                   <p className="text-gray-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-indigo-100">
                     {result.advice}
                   </p>
                 </div>
                 
                 <div className="pt-6 border-t border-indigo-100">
                    <p className="text-sm text-gray-500 mb-4">¿Te gusta este estilo?</p>
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                        Guardar
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200 transition-colors">
                        Compartir
                      </button>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="animate-fade-in">
        {step === AppStep.UPLOAD ? renderUploadHero() : renderSimulator()}
      </main>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-in forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;