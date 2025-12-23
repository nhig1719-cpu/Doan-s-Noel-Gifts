
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Stars, Gift, RefreshCw, AlertCircle, Volume2, VolumeX, Mail, Send, Sparkles, Snowflake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scene, QuizOption } from './types';
import { Snowfall, ChristmasDecorations, SparkleCursorTrail, SantaSleigh } from './components/BackgroundEffects';

const QUIZ_OPTIONS: QuizOption[] = [
  { id: '1', label: '10/04/2024', isCorrect: true },
  { id: '2', label: '10/05/2024', isCorrect: false },
  { id: '3', label: '10/01/2025', isCorrect: false },
  { id: '4', label: '10/03/2024', isCorrect: false },
];

const LETTER_CONTENT = {
  greeting: "Chào Đoan xinh yêu nhất trần đời của anh ❤️,",
  body: `Noel này, anh không cần quà gì hết cả, vì anh đã có món quà tuyệt vời nhất thế giới là Đoan rồi í. 

Cảm ơn Đoan vì đã luôn ở bên, lắng nghe, yêu thương và đồng hành cùng anh suốt thời gian qua. Anh hứa sẽ luôn làm Đoan cười tươi như những tia nắng ấm áp nhất giữa đêm giáng sinh này hehe.

Chúc vợ của anh một Giáng sinh ngọt ngào như kẹo dẻo, ấm áp như vòng tay anh và luôn hạnh phúc nhất nhé!`,
  closing: "Yêu Đoan nhìuuuu nhìuuu lúmmm lúmmm! 🎄❤️🎁"
};

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>(Scene.Opening);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const chimeSfxRef = useRef<HTMLAudioElement | null>(null);
  const sparkleSfxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Sử dụng bài Last Christmas sôi động ấm áp a (Clip bạn gửi)
    const sources = [
      'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptitle=Last+Christmas&filename=mt/MTI5NzE3OTgxMjk3MjE3_p6O08A7_2bjE.mp3',
      'https://www.chosic.com/wp-content/uploads/2021/11/Last-Christmas-Lofi-Version.mp3'
    ];
    
    bgMusicRef.current = new Audio(sources[0]);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.5;
    
    bgMusicRef.current.onerror = () => {
      console.warn("Main audio failed, trying fallback...");
      if (bgMusicRef.current) {
        bgMusicRef.current.src = sources[1];
        bgMusicRef.current.load();
      }
    };

    chimeSfxRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    sparkleSfxRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    
    return () => {
      bgMusicRef.current?.pause();
    };
  }, []);

  const playMusic = () => {
    bgMusicRef.current?.play().catch(() => console.log("User interaction needed"));
  };

  const playChime = () => {
    if (chimeSfxRef.current) {
      chimeSfxRef.current.currentTime = 0;
      chimeSfxRef.current.play().catch(() => {});
    }
  };

  const playSparkle = () => {
    if (sparkleSfxRef.current) {
      sparkleSfxRef.current.currentTime = 0;
      sparkleSfxRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const triggerCelebration = () => {
    playSparkle();
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff0000', '#ffd700', '#ffffff', '#ff69b4'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff0000', '#ffd700', '#ffffff', '#ff69b4'] });
    }, 250);
  };

  const handleQuizChoice = (option: QuizOption) => {
    if (option.isCorrect) {
      triggerCelebration();
      setErrorMessage('');
      setTimeout(() => {
        playChime();
        setCurrentScene(Scene.Letter);
      }, 1500);
    } else {
      setIsShaking(true);
      setErrorMessage('Ư ỉnhhhhhh~ sai rồi kìa, chọn thêm cơ hội nữa 😗');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleOpenGift = () => {
    setGiftOpened(true);
    triggerCelebration();
    setTimeout(() => {
      playChime();
      setCurrentScene(Scene.Final);
    }, 3000);
  };

  const variants: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } },
    exit: { opacity: 0, scale: 1.05, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#2d0a0a] via-[#1a0505] to-[#000000] text-white flex items-center justify-center p-4 md:p-6 select-none">
      <Snowfall />
      <ChristmasDecorations />
      <SantaSleigh />
      <SparkleCursorTrail />

      {/* Music Toggle */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 md:p-4 bg-red-600/20 backdrop-blur-xl rounded-full border-2 border-yellow-500/30 shadow-lg"
        >
          {isMuted ? <VolumeX size={20} className="md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6 text-yellow-400 animate-pulse" />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {currentScene === Scene.Opening && (
          <motion.div
            key="scene-opening"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-20 w-full max-w-4xl px-4"
          >
            <motion.div 
              className="mb-6 md:mb-10 flex justify-center relative"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-32 h-32 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-red-600/30 to-green-600/30 backdrop-blur-3xl border-4 border-yellow-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                <span className="text-6xl md:text-9xl transform -translate-y-2 drop-shadow-2xl">⛄</span>
              </div>
              <motion.div 
                className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-4xl md:text-6xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >🌟</motion.div>
            </motion.div>

            <h1 className="text-4xl md:text-7xl lg:text-8xl font-title mb-4 md:mb-8 text-glow text-white heartbeat tracking-tight leading-none px-2 uppercase italic font-black">
              Chúc Mừng Giáng Sinh <br className="md:hidden" /> Đoan Xinh Yêu Của Anh Nhee !!
            </h1>
            <p className="text-pink-100/90 mb-8 md:mb-14 text-lg md:text-2xl font-medium tracking-wide drop-shadow-md">
               Dành riêng cho công chúa của anh ❤️
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(220,38,38,0.8)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playMusic();
                playChime();
                setCurrentScene(Scene.Quiz);
              }}
              className="px-10 py-4 md:px-16 md:py-6 bg-gradient-to-r from-red-600 via-red-500 to-pink-700 rounded-full font-bold text-xl md:text-2xl shadow-2xl flex items-center gap-3 md:gap-5 mx-auto border-2 border-yellow-400/50 uppercase tracking-widest"
            >
              Bấm vô đây <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
            </motion.button>
          </motion.div>
        )}

        {currentScene === Scene.Quiz && (
          <motion.div
            key="scene-quiz"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-20 w-full max-w-[90%] md:max-w-md px-4"
          >
            <motion.div 
              animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="bg-black/75 backdrop-blur-3xl p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border-2 border-red-500/40 shadow-5xl"
            >
              <div className="text-5xl md:text-7xl mb-4 md:mb-8 drop-shadow-lg">📅</div>
              <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12 text-yellow-100 leading-relaxed">
                Đoan nhớ ngày kỉ niệm <br className="hidden md:block" /> tụi mình là ngày nào hông taaaa?
              </h2>
              
              <div className="grid grid-cols-1 gap-3 md:gap-6">
                {QUIZ_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)", borderColor: "#fbbf24" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuizChoice(opt)}
                    className="w-full py-4 md:py-5 rounded-2xl bg-white/5 border border-white/20 text-lg md:text-xl font-semibold transition-all shadow-sm"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>

              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 md:mt-10 text-yellow-400 flex items-center justify-center gap-2 text-base md:text-lg font-bold italic"
                >
                  <AlertCircle size={20} className="md:w-6 md:h-6" /> {errorMessage}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {currentScene === Scene.Letter && (
          <motion.div
            key="scene-letter"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-20 w-full max-w-[95%] md:max-w-2xl px-2"
          >
            <motion.div 
              className="bg-[#fffdf5] text-[#2d0a0a] p-6 md:p-14 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative border-b-[10px] md:border-b-[15px] border-red-800 max-h-[85vh] flex flex-col"
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 1.2, type: "spring" }}
            >
              <div className="absolute top-0 left-0 w-full h-3 md:h-5 bg-red-700 opacity-90 rounded-t-2xl" />
              <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 text-5xl md:text-9xl drop-shadow-xl z-10">💌</div>
              
              <div className="overflow-y-auto px-4 md:px-6 mt-8 md:mt-10 mb-6 md:mb-10 custom-scrollbar">
                <div className="text-left">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="font-title text-lg md:text-2xl font-bold mb-6 text-red-900"
                  >
                    {LETTER_CONTENT.greeting}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1.2 }}
                    className="font-body text-base md:text-xl leading-relaxed md:leading-[1.8] text-justify whitespace-pre-line font-medium opacity-90"
                  >
                    {LETTER_CONTENT.body}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2.5 }}
                    className="font-title text-lg md:text-2xl font-black mt-8 text-red-800 italic"
                  >
                    {LETTER_CONTENT.closing}
                  </motion.p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#c53030' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playChime();
                  setCurrentScene(Scene.Unwrapping);
                }}
                className="px-8 py-3 md:px-14 md:py-5 bg-red-700 text-white rounded-full font-bold text-lg md:text-xl flex items-center gap-2 md:gap-4 mx-auto shadow-xl transition-all flex-shrink-0 uppercase tracking-widest"
              >
                Tiếp tục nèo  <Send size={20} className="md:w-6 md:h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {currentScene === Scene.Unwrapping && (
          <motion.div
            key="scene-unwrapping"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center z-20 w-full px-4"
          >
            <motion.h2 
              animate={{ scale: [1, 1.05, 1], color: ['#fff', '#ffd700', '#fff'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl md:text-5xl font-title mb-10 md:mb-20 text-glow uppercase italic"
            >
              Chưa đâu Vẫn còn một món quà cuối... 🎁
            </motion.h2>
            
            <motion.div
              animate={giftOpened ? { 
                scale: [1, 1.8, 0], 
                rotate: [0, 20, -20, 0],
                opacity: [1, 1, 0] 
              } : { 
                y: [0, -30, 0],
                rotate: [-10, 10, -10] 
              }}
              transition={giftOpened ? { duration: 1.5 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleOpenGift}
              className="cursor-pointer relative group flex flex-col items-center"
            >
              <div className="text-[140px] md:text-[300px] filter drop-shadow-[0_0_60px_rgba(255,215,0,0.4)] transition-all">
                🎁
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <motion.div 
                    className="w-48 h-48 md:w-80 md:h-80 bg-yellow-400/20 rounded-full blur-[80px] md:blur-[150px]"
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                 />
              </div>
              <p className="mt-8 md:mt-12 font-black text-2xl md:text-4xl text-yellow-400 tracking-[0.2em] animate-bounce text-glow-gold uppercase">CHẠM ĐỂ MỞ NHÉ!</p>
            </motion.div>
          </motion.div>
        )}

        {currentScene === Scene.Final && (
          <motion.div
            key="scene-final"
            variants={variants}
            initial="initial"
            animate="animate"
            className="text-center z-20 w-full max-w-[95%] md:max-w-2xl px-2"
          >
            <div className="bg-gradient-to-br from-red-900/70 via-black/90 to-[#2d0a0a] backdrop-blur-3xl p-8 md:p-16 rounded-[3rem] md:rounded-[6rem] border-2 border-yellow-500/30 shadow-6xl relative overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-7xl md:text-[140px] mb-8 md:mb-12 drop-shadow-2xl"
              >
                🎁💖🎄
              </motion.div>
              
              <h2 className="text-3xl md:text-6xl font-title mb-8 md:mb-12 text-yellow-300 leading-tight text-glow uppercase italic font-black">
                Đoan xuống dưới trọ <br className="md:hidden" /> lấy quà nheeeee!
              </h2>
              
              <div className="space-y-6 md:space-y-10 relative z-10">
                <p className="text-white/95 text-xl md:text-2xl font-medium italic leading-relaxed font-body text-glow px-2">
                  "Có một ông già Noel 22 tuổi đang đứng dưới đợi Đoan với với <br className="hidden md:block" /> một bất ngờ cực to bự cho Đoan nà!"
                </p>

                <div className="flex justify-center gap-6 md:gap-10 py-4 md:py-8">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                      className="text-4xl md:text-6xl drop-shadow-lg"
                    >
                      ❤️
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => {
                    playChime();
                    setCurrentScene(Scene.Opening);
                    setGiftOpened(false);
                  }}
                  className="mt-6 md:mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white/60 flex items-center justify-center gap-2 mx-auto text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all border border-white/20"
                >
                  <RefreshCw size={16} className="md:w-5 md:h-5" /> Chưa thấy rõ thì xem lại nhe kkk
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trang trí chân trang */}
      <div className="fixed bottom-[-10px] left-0 w-full hidden sm:flex justify-around opacity-15 pointer-events-none z-10">
         {[...Array(8)].map((_, i) => (
           <div key={i} className="text-6xl md:text-8xl">🎄</div>
         ))}
      </div>

      <style>{`
        .shadow-5xl { box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 30px rgba(220,38,38,0.1); }
        .shadow-6xl { box-shadow: 0 0 120px rgba(0,0,0,0.9), 0 0 50px rgba(234,179,8,0.15); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
