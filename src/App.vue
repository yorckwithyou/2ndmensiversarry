<script setup>
import { ref, computed, reactive, onMounted } from 'vue';

// --- STATE MANAGEMENT ---
const currentStep = ref(0);
const userAnswer = ref('');
const errorMessage = ref('');
const isCompleted = ref(false);
const currentScreen = ref('landing'); // 'landing', 'welcome', 'game', 'final'
const showHint = ref(false);
const isTransitioning = ref(false);
const isMusicPlaying = ref(false);
const audioRef = ref(null);
const showPrizePhoto = ref(false);

// --- DYNAMIC BACKGROUND ELEMENTS (Minimalist) ---
const hearts = reactive(Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: Math.random() * 100 + '%',
  delay: Math.random() * 10 + 's',
  size: (Math.random() * 8 + 6) + 'px',
  duration: (Math.random() * 8 + 10) + 's',
  opacity: 0.08
})));

// --- CLUES DATA ---
const clues = reactive([
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
]);

// --- LOGIC ---
const currentClueData = computed(() => clues[currentStep.value]);

const navigateTo = (screen) => {
  isTransitioning.value = true;
  // If moving from landing, start music (browser requires user interaction)
  if (currentScreen.value === 'landing' && audioRef.value) {
    audioRef.value.play().then(() => {
      isMusicPlaying.value = true;
    }).catch(e => console.log("Music play blocked:", e));
  }
  
  setTimeout(() => {
    currentScreen.value = screen;
    isTransitioning.value = false;
  }, 400);
};

const checkAnswer = () => {
  const answer = userAnswer.value.trim().toLowerCase();
  const correct = currentClueData.value.correctAnswer.toLowerCase();

  if (answer === correct) {
    errorMessage.value = '';
    userAnswer.value = '';
    showHint.value = false;
    
    if (currentStep.value < clues.length - 1) {
      currentStep.value++;
    } else {
      navigateTo('final');
      isCompleted.value = true;
    }
  } else {
    errorMessage.value = "Ups, salah sayang. Coba ingat-ingat lagi!";
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    userAnswer.value = '';
    showHint.value = false;
    errorMessage.value = '';
  }
};

const toggleHint = () => {
  showHint.value = !showHint.value;
};

const resetGame = () => {
  currentStep.value = 0;
  userAnswer.value = '';
  errorMessage.value = '';
  isCompleted.value = false;
  navigateTo('landing');
  showHint.value = false;
};

const toggleMusic = () => {
  if (audioRef.value) {
    if (isMusicPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isMusicPlaying.value = !isMusicPlaying.value;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#fdfdfd] selection:bg-romantic-100 flex flex-col items-center justify-center p-6 font-sans text-slate-700 relative overflow-hidden">
    
    <!-- Audio Element -->
    <audio ref="audioRef" loop>
      <source src="/assets/Waking_Up_Together_With_You.mp3" type="audio/mpeg">
    </audio>

    <!-- Music Toggle Button -->
    <button 
      v-if="currentScreen !== 'landing'"
      @click="toggleMusic"
      class="fixed top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm hover:bg-white transition-all text-slate-400"
    >
      <span v-if="isMusicPlaying" class="text-xs">ON</span>
      <span v-else class="text-xs opacity-50">OFF</span>
    </button>

    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 -left-20 w-64 h-64 bg-romantic-50 rounded-full blur-[100px] opacity-20"></div>
      <div class="absolute bottom-0 -right-20 w-80 h-80 bg-gold-50 rounded-full blur-[120px] opacity-15"></div>

      <!-- Minimalist Floating Hearts -->
      <div 
        v-for="heart in hearts" 
        :key="'h-'+heart.id"
        class="absolute animate-float-up text-romantic-200"
        :style="{ left: heart.left, animationDelay: heart.delay, fontSize: heart.size, animationDuration: heart.duration, opacity: heart.opacity }"
      >
        ❤
      </div>
    </div>

    <!-- Transition Loader -->
    <div v-if="isTransitioning" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] transition-opacity duration-300 flex items-center justify-center">
      <div class="w-6 h-6 border-2 border-slate-100 border-t-romantic-400 rounded-full animate-spin"></div>
    </div>

    <!-- Main Content -->
    <Transition name="fade-scale" mode="out-in">
      
      <!-- 1. REFINED LANDING PAGE -->
      <div v-if="currentScreen === 'landing'" key="landing" class="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-10">
        <div class="relative group cursor-pointer" @click="navigateTo('welcome')">
          <div class="absolute -inset-4 bg-romantic-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative bg-white w-24 h-24 rounded-full shadow-sm border border-slate-50 flex items-center justify-center overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform duration-700">✉</span>
          </div>
        </div>

        <div class="space-y-4">
          <h1 class="text-2xl md:text-3xl font-light tracking-widest text-slate-900 uppercase">
            The <span class="text-romantic-500 font-medium">Treasure</span> Hunt
          </h1>
          <p class="text-sm text-slate-400 font-light tracking-wide max-w-xs mx-auto leading-relaxed">
            A small journey through our memories. <br/>
            Designed specifically for you.
          </p>
        </div>

        <button 
          @click="navigateTo('welcome')"
          class="px-12 py-4 bg-slate-900 text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
        >
          Enter
        </button>
      </div>

      <!-- 2. WELCOME PAGE -->
      <div v-else-if="currentScreen === 'welcome'" key="welcome" class="relative z-10 w-full max-w-sm space-y-6">
        <div class="bg-white p-10 rounded-2xl shadow-sm border border-slate-50 text-center space-y-6">
          <h2 class="text-xl font-bold text-slate-800 tracking-tight">Halo Sayang</h2>
          <p class="text-sm text-slate-500 font-light leading-relaxed px-2">
            Aku punya kejutan kecil untukmu. Jawablah beberapa pertanyaan tentang kita untuk membukanya.
          </p>
          <div class="h-px w-8 bg-slate-100 mx-auto"></div>
          <button 
            @click="navigateTo('game')"
            class="w-full py-4 bg-romantic-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-romantic-600 transition-colors"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>

      <!-- 3. NEAT GAME UI -->
      <div v-else-if="currentScreen === 'game'" key="game" class="relative z-10 w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-50 p-8 space-y-8 relative overflow-hidden">
          
          <!-- Minimal Progress -->
          <div class="space-y-3">
            <div class="flex justify-between items-end">
              <span class="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Step {{ currentStep + 1 }} of {{ clues.length }}</span>
            </div>
            <div class="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                class="h-full bg-romantic-400 rounded-full transition-all duration-700"
                :style="{ width: `${((currentStep + 1) / clues.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Question Content -->
          <div class="py-2">
            <h2 class="text-lg md:text-xl font-medium text-slate-800 leading-snug tracking-tight">
              {{ currentClueData.clueText }}
            </h2>
          </div>

          <!-- Input Section -->
          <div class="space-y-4">
            <input 
              v-model="userAnswer"
              @keyup.enter="checkAnswer"
              type="text" 
              placeholder="Jawabanmu..."
              class="w-full bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-romantic-200 focus:bg-white transition-all placeholder:text-slate-300"
            />
            
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="prevStep"
                :disabled="currentStep === 0"
                class="py-4 border border-slate-100 text-slate-400 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button 
                @click="checkAnswer"
                class="py-4 bg-slate-900 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-all"
              >
                Kirim
              </button>
            </div>

            <!-- Hint & Feedback -->
            <div class="flex flex-col items-center gap-4">
              <button 
                @click="toggleHint"
                class="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-romantic-400 transition-colors"
              >
                {{ showHint ? 'Tutup Bantuan' : 'Butuh Bantuan?' }}
              </button>

              <Transition name="fade">
                <div v-if="showHint" class="w-full bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p class="text-xs text-slate-500 font-light italic text-center">"{{ currentClueData.hint }}"</p>
                </div>
              </Transition>

              <Transition name="shake">
                <div v-if="errorMessage" class="text-red-400 text-[10px] font-bold text-center">
                  {{ errorMessage }}
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. ELEGANT FINAL PAGE -->
      <div v-else-if="currentScreen === 'final'" key="final" class="relative z-10 w-full max-w-2xl text-center space-y-12">
        <div class="space-y-3">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Selamat, Sayang!</h1>
          <p class="text-sm text-slate-400 font-light max-w-xs mx-auto">Kamu berhasil menjawab semuanya dengan sempurna.</p>
        </div>

        <!-- Digital Letter -->
        <div class="max-w-xl mx-auto bg-white p-8 md:p-12 shadow-premium rounded-sm border-t-2 border-romantic-200 relative overflow-hidden">
          <div class="space-y-8 text-left relative z-10">
            <p class="font-serif text-romantic-500 text-lg italic">Dear, My Hiyori</p>
            
            <div class="space-y-6 text-slate-600 leading-relaxed font-light text-sm md:text-base">
              <p>
                Aku pernah dengar kutipan dari sebuah film: <span class="text-romantic-400 font-medium">"Kalau aku harus ngulang hidup 1000 kali pun, kayaknya aku bakal tetep milih kamu."</span> Kutipan itu bagus, tapi buatku... aku nggak butuh 1000 kali percobaan buat tahu kalau itu kamu. Aku nggak mau nunggu kehidupan-kehidupan selanjutnya cuma buat ngasih versi cinta terbaikku.
              </p>
              
              <p>
                Aku mau ngelakuinnya di kehidupan yang ini aja. Aku pengen ngabisin waktuku sekarang buat ngasih kamu cinta yang bakal terus membekas sampai kita tua nanti. Di semesta atau kemungkinan yang lain, takdir kita mungkin beda. 
              </p>
              
              <p>
                Tapi di sini, sekarang, aku cuma berharap caraku mencintaimu bisa selalu jadi pengingat buat kamu, bahwa kamu itu sangat spesial, dan memang begitulah seharusnya kamu dicintai.
              </p>
            </div>

            <div class="pt-8 text-right border-t border-slate-50">
              <p class="font-serif text-slate-400 italic text-sm">With all my heart,</p>
              <p class="font-bold text-slate-800 mt-2 uppercase tracking-[0.3em] text-[10px]">Yours Forever</p>
            </div>
          </div>
          <div class="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        </div>

        <!-- Photos -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-10 px-4">
          <div class="bg-white p-3 pb-10 shadow-sm border border-slate-50 rotate-[-2deg] hover:rotate-0 transition-all duration-500 w-full max-w-[240px]">
            <img src="/assets/Fall_in_Love_(1).png" alt="Memory 1" class="w-full aspect-[3/4] object-cover grayscale-[20%]" @error="(e) => e.target.src='https://placehold.co/600x800/fdfdfd/ddd?text=Dear+Hiyori'"/>
            <p class="text-[10px] text-slate-300 mt-4 tracking-widest uppercase">Memory I</p>
          </div>

          <div class="bg-white p-3 pb-10 shadow-sm border border-slate-50 rotate-[2deg] hover:rotate-0 transition-all duration-500 w-full max-w-[240px]">
            <img src="/assets/Fall_in_Love.png" alt="Memory 2" class="w-full aspect-[3/4] object-cover grayscale-[20%]" @error="(e) => e.target.src='https://placehold.co/600x800/fdfdfd/ddd?text=Yummm...'"/>
            <p class="text-[10px] text-slate-300 mt-4 tracking-widest uppercase">Memory II</p>
          </div>
        </div>

        <div class="pt-8">
          <button 
            @click="showPrizePhoto = true"
            class="px-10 py-4 bg-romantic-500 text-white rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-romantic-600 transition-all shadow-sm active:scale-95"
          >
            Lihat Hadiah Spesial
          </button>
        </div>

        <div class="pt-4">
          <button 
            @click="resetGame"
            class="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-romantic-400 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>

    </Transition>

    <!-- Prize Photo Modal -->
    <Transition name="fade">
      <div v-if="showPrizePhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md" @click="showPrizePhoto = false">
        <div class="relative max-w-4xl w-full bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/10 overflow-y-auto max-h-[90vh]" @click.stop>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <!-- Prize Photo 1 -->
            <div class="space-y-4">
              <div class="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
                <img src="/assets/Fall_in_Love_(1).png" alt="Prize 1" class="w-full rounded-xl"/>
              </div>
              <a 
                href="/assets/Fall_in_Love_(1).png" 
                download="Memory_1.png"
                class="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all"
              >
                <span>Download Memory I</span>
                <span>↓</span>
              </a>
            </div>

            <!-- Prize Photo 2 -->
            <div class="space-y-4">
              <div class="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
                <img src="/assets/Fall_in_Love.png" alt="Prize 2" class="w-full rounded-xl"/>
              </div>
              <a 
                href="/assets/Fall_in_Love.png" 
                download="Memory_2.png"
                class="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all"
              >
                <span>Download Memory II</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          <button 
            @click="showPrizePhoto = false"
            class="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </Transition>

    <!-- Global Footer -->
    <footer class="mt-16 relative z-10">
      <p class="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-200">
        MCMXXVI &bull; Crafted with Love
      </p>
    </footer>

  </div>
</template>

<style>
/* REFINED TRANSITIONS */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.99) translateY(10px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.01) translateY(-10px);
}

/* SUBTLE FLOATING ANIMATION */
@keyframes float-up {
  0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
  20% { opacity: 0.1; }
  80% { opacity: 0.1; }
  100% { transform: translateY(-10vh) rotate(20deg); opacity: 0; }
}

.animate-float-up {
  animation-name: float-up;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

/* SHAKE ANIMATION */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out both;
}

/* Selection */
::selection {
  background: #fecdd3;
  color: #881337;
}

body {
  background-color: #fdfdfd;
}
</style>
