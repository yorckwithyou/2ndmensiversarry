import React, { useState, useRef, useEffect, useMemo } from 'react';

const CLUES = [
  {
    id: 1,
    clueText: "Film apa yang kita tonton pertama kali pas first date?",
    correctAnswer: "The Last 10 Years",
    hint: "Satu dekade yang sukses bikin mewek di kencan pertama kita. Bunga sakura dan waktu yang terus mundur."
  },
  {
    id: 2,
    clueText: "Tanggal berapa kita jadian?",
    correctAnswer: "8 januari 2026",
    hint: "Awal tahun yang baru. Kalau angkanya ditidurin, bentuknya jadi simbol infinity (tak terhingga) kayak kita."
  },
  {
    id: 3,
    clueText: "Makanan apa yang paling aku suka?",
    correctAnswer: "Kulit geprek",
    hint: "Kasta tertinggi per-ayaman. Digoreng garing, dihancurin, dan selalu jadi suapan terakhir yang berharga."
  },
  {
    id: 4,
    clueText: "Aku paling gak bisa makan?",
    correctAnswer: "Pedas",
    hint: "Sensasi lidah terbakar yang selalu sukses bikin aku mundur teratur dan keringetan."
  },
  {
    id: 5,
    clueText: "Playlist yang selalu aku putar kalau lagi sposes sama kamu?",
    correctAnswer: "Lany - YOU!",
    hint: "Band-nya punya 4 huruf. Judul lagunya persis kayak apa yang selalu ada di isi kepalaku kalau lagi sama kamu."
  },
  {
    id: 6,
    clueText: "Nama panggilan dari aku buat kamu?",
    correctAnswer: "Mrs. Kelapa Sawit",
    hint: "Panggilan sayang paling elit. Sangat berhubungan erat sama komoditas ekspor kebanggaan negara dan urusan dapur."
  }
];

const HEARTS_COUNT = 8;

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showPrizePhoto, setShowPrizePhoto] = useState(false);
  const audioRef = useRef(null);

  const hearts = useMemo(() => Array.from({ length: HEARTS_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    delay: Math.random() * 10 + 's',
    size: (Math.random() * 8 + 6) + 'px',
    duration: (Math.random() * 8 + 10) + 's',
    opacity: 0.08
  })), []);

  const navigateTo = (screen) => {
    setIsTransitioning(true);
    if (currentScreen === 'landing' && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(e => console.log("Music play blocked:", e));
    }
    
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 400);
  };

  const checkAnswer = () => {
    const answer = userAnswer.trim().toLowerCase();
    const correct = CLUES[currentStep].correctAnswer.toLowerCase();

    if (answer === correct) {
      setErrorMessage('');
      setUserAnswer('');
      setShowHint(false);
      
      if (currentStep < CLUES.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        navigateTo('final');
      }
    } else {
      setErrorMessage("Ups, salah sayang. Coba ingat-ingat lagi!");
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setUserAnswer('');
      setShowHint(false);
      setErrorMessage('');
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setUserAnswer('');
    setErrorMessage('');
    navigateTo('landing');
    setShowHint(false);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] selection:bg-romantic-100 flex flex-col items-center justify-center p-6 font-sans text-slate-700 relative overflow-hidden">
      
      <audio ref={audioRef} loop>
        <source src="/assets/Waking_Up_Together_With_You.mp3" type="audio/mpeg" />
      </audio>

      {currentScreen !== 'landing' && (
        <button 
          onClick={toggleMusic}
          className="fixed top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm hover:bg-white transition-all text-slate-400"
        >
          <span className="text-xs">{isMusicPlaying ? 'ON' : 'OFF'}</span>
        </button>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-64 h-64 bg-romantic-50 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-gold-50 rounded-full blur-[120px] opacity-15"></div>

        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="absolute animate-float-up text-romantic-200"
            style={{ 
              left: heart.left, 
              '--delay': heart.delay, 
              fontSize: heart.size, 
              '--duration': heart.duration, 
              opacity: heart.opacity 
            }}
          >
            ❤
          </div>
        ))}
      </div>

      {isTransitioning && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] transition-opacity duration-300 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-100 border-t-romantic-400 rounded-full animate-spin"></div>
        </div>
      )}

      <div className={`transition-all duration-500 w-full flex flex-col items-center ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {currentScreen === 'landing' && (
          <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-10">
            <div className="relative group cursor-pointer" onClick={() => navigateTo('welcome')}>
              <div className="absolute -inset-4 bg-romantic-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white w-24 h-24 rounded-full shadow-sm border border-slate-50 flex items-center justify-center overflow-hidden">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-700">✉</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-light tracking-widest text-slate-900 uppercase">
                The <span className="text-romantic-500 font-medium">Treasure</span> Hunt
              </h1>
              <p className="text-sm text-slate-400 font-light tracking-wide max-w-xs mx-auto leading-relaxed">
                A small journey through our memories. <br/>
                Designed specifically for you.
              </p>
            </div>

            <button 
              onClick={() => navigateTo('welcome')}
              className="px-12 py-4 bg-slate-900 text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
            >
              Enter
            </button>
          </div>
        )}

        {currentScreen === 'welcome' && (
          <div className="relative z-10 w-full max-w-sm space-y-6">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-50 text-center space-y-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Halo Sayang</h2>
              <p className="text-sm text-slate-500 font-light leading-relaxed px-2">
                Aku punya kejutan kecil untukmu. Jawablah beberapa pertanyaan tentang kita untuk membukanya.
              </p>
              <div className="h-px w-8 bg-slate-100 mx-auto"></div>
              <button 
                onClick={() => navigateTo('game')}
                className="w-full py-4 bg-romantic-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-romantic-600 transition-colors"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'game' && (
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-50 p-8 space-y-8 relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Step {currentStep + 1} of {CLUES.length}</span>
                </div>
                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-romantic-400 rounded-full transition-all duration-700"
                    style={{ width: `${((currentStep + 1) / CLUES.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="py-2">
                <h2 className="text-lg md:text-xl font-medium text-slate-800 leading-snug tracking-tight">
                  {CLUES[currentStep].clueText}
                </h2>
              </div>

              <div className="space-y-4">
                <input 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  type="text" 
                  placeholder="Jawabanmu..."
                  className="w-full bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-romantic-200 focus:bg-white transition-all placeholder:text-slate-300"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="py-4 border border-slate-100 text-slate-400 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button 
                    onClick={checkAnswer}
                    className="py-4 bg-slate-900 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-all"
                  >
                    Kirim
                  </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-romantic-400 transition-colors"
                  >
                    {showHint ? 'Tutup Bantuan' : 'Butuh Bantuan?'}
                  </button>

                  {showHint && (
                    <div className="w-full bg-slate-50/50 p-4 rounded-xl border border-slate-100 animate-in fade-in duration-300">
                      <p className="text-xs text-slate-500 font-light italic text-center">"{CLUES[currentStep].hint}"</p>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="text-red-400 text-[10px] font-bold text-center animate-shake">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'final' && (
          <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat, Sayang!</h1>
              <p className="text-sm text-slate-400 font-light max-w-xs mx-auto">Kamu berhasil menjawab semuanya dengan sempurna.</p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-8 md:p-12 shadow-premium rounded-sm border-t-2 border-romantic-200 relative overflow-hidden">
              <div className="space-y-8 text-left relative z-10">
                <p className="font-handwriting text-romantic-500 text-2xl italic">Dear, My Hiyori</p>
                
                <div className="space-y-6 text-slate-600 leading-relaxed font-light text-sm md:text-base">
                  <p>
                    Aku pernah dengar kutipan dari sebuah film: <span className="text-romantic-400 font-medium">"Kalau aku harus ngulang hidup 1000 kali pun, kayaknya aku bakal tetep milih kamu."</span> Kutipan itu bagus, tapi buatku... aku nggak butuh 1000 kali percobaan buat tahu kalau itu kamu. Aku nggak mau nunggu kehidupan-kehidupan selanjutnya cuma buat ngasih versi cinta terbaikku.
                  </p>
                  
                  <p>
                    Aku mau ngelakuinnya di kehidupan yang ini aja. Aku pengen ngabisin waktuku sekarang buat ngasih kamu cinta yang bakal terus membekas sampai kita tua nanti. Di semesta atau kemungkinan yang lain, takdir kita mungkin beda. 
                  </p>
                  
                  <p>
                    Tapi di sini, sekarang, aku cuma berharap caraku mencintaimu bisa selalu jadi pengingat buat kamu, bahwa kamu itu sangat spesial, dan memang begitulah seharusnya kamu dicintai.
                  </p>
                </div>

                <div className="pt-8 text-right border-t border-slate-50">
                  <p className="font-handwriting text-slate-400 italic text-xl">With all my heart,</p>
                  <p className="font-bold text-slate-800 mt-2 uppercase tracking-[0.3em] text-[10px]">Yours Forever</p>
                </div>
              </div>
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-4">
              <div className="bg-white p-3 pb-10 shadow-sm border border-slate-50 rotate-[-2deg] hover:rotate-0 transition-all duration-500 w-full max-w-[240px]">
                <img src="/assets/Fall_in_Love_(1).png" alt="Memory 1" className="w-full aspect-[3/4] object-cover grayscale-[20%]" />
                <p className="text-[10px] text-slate-300 mt-4 tracking-widest uppercase">Memory I</p>
              </div>

              <div className="bg-white p-3 pb-10 shadow-sm border border-slate-50 rotate-[2deg] hover:rotate-0 transition-all duration-500 w-full max-w-[240px]">
                <img src="/assets/Fall_in_Love.png" alt="Memory 2" className="w-full aspect-[3/4] object-cover grayscale-[20%]" />
                <p className="text-[10px] text-slate-300 mt-4 tracking-widest uppercase">Memory II</p>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button 
                onClick={() => setShowPrizePhoto(true)}
                className="px-10 py-4 bg-romantic-500 text-white rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-romantic-600 transition-all shadow-sm active:scale-95"
              >
                Lihat Hadiah Spesial
              </button>
              <br />
              <button 
                onClick={resetGame}
                className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-romantic-400 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {showPrizePhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowPrizePhoto(false)}>
          <div className="relative max-w-4xl w-full bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/10 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="space-y-4">
                <div className="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
                  <img src="/assets/Fall_in_Love_(1).png" alt="Prize 1" className="w-full rounded-xl"/>
                </div>
                <a 
                  href="/assets/Fall_in_Love_(1).png" 
                  download="Memory_1.png"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all"
                >
                  <span>Download Memory I</span>
                  <span>↓</span>
                </a>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
                  <img src="/assets/Fall_in_Love.png" alt="Prize 2" className="w-full rounded-xl"/>
                </div>
                <a 
                  href="/assets/Fall_in_Love.png" 
                  download="Memory_2.png"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all"
                >
                  <span>Download Memory II</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
            <button 
              onClick={() => setShowPrizePhoto(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <footer className="mt-16 relative z-10 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-200">
          MCMXXVI &bull; Crafted with Love
        </p>
      </footer>
    </div>
  );
}

export default App;
