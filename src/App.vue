<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import CarroselBg from './components/CarroselBg.vue';
import PulsingLogo from './components/PulsingLogo.vue';
import ReguaAcessibilidade from './components/ReguaAcessibilidade.vue';
import WindowContent from './components/WindowContent.vue';

const showIntro = ref(true);
const introStorageKey = 'kairu-site-intro-last-shown';
const settingsStorageKey = 'kairu-site-settings';

const theme = ref<'dark' | 'light'>('dark');
const fontSize = ref<'normal' | 'large' | 'xlarge'>('normal');
const readerMode = ref<'normal' | 'soft'>('normal');
const blindMode = ref(false);
const hideContent = ref(false);

const siteData = ref<any>(null);
const loading = ref(true);

const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let hoverSpeechTimeout: ReturnType<typeof setTimeout> | null = null;

const speakAlt = (event: MouseEvent) => {
  if (!blindMode.value) return;
  const target = event.target as HTMLElement;
  let text = target.getAttribute('alt') 
    || target.getAttribute('title') 
    || target.getAttribute('aria-label');
  if (!text) {
    if (target.tagName === 'BUTTON') {
      text = target.textContent?.trim();
    }
    if (target.tagName === 'IMG' && !text) return;
  }
  if (!text) return;

  if (hoverSpeechTimeout) clearTimeout(hoverSpeechTimeout);
  hoverSpeechTimeout = setTimeout(() => {
    if (!isSpeechSupported) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, 200);
};

const speakSelection = () => {
  if (!blindMode.value) return;
  const selection = window.getSelection();
  const text = selection?.toString().trim();
  if (!text || text.length === 0) return;

  if (!isSpeechSupported) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

const stopSpeech = () => {
  if (isSpeechSupported) speechSynthesis.cancel();
};

const applySettings = () => {
  const root = document.documentElement;
  root.dataset.theme = theme.value;
  root.dataset.fontSize = fontSize.value;
  root.dataset.readerMode = readerMode.value;
  root.dataset.blindMode = String(blindMode.value);
};

const saveSettings = () => {
  try {
    localStorage.setItem(
      settingsStorageKey,
      JSON.stringify({
        theme: theme.value,
        fontSize: fontSize.value,
        readerMode: readerMode.value,
        blindMode: blindMode.value,
        hideContent: hideContent.value,
      }),
    );
  } catch {
  }
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(settingsStorageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    theme.value = parsed.theme === 'light' ? 'light' : 'dark';
    fontSize.value = ['normal', 'large', 'xlarge'].includes(parsed.fontSize) ? parsed.fontSize : 'normal';
    readerMode.value = ['normal', 'soft'].includes(parsed.readerMode) ? parsed.readerMode : 'normal';
    blindMode.value = parsed.blindMode === true;
    hideContent.value = parsed.hideContent === true;
  } catch {
  }
};

const toggleTheme = () => { theme.value = theme.value === 'dark' ? 'light' : 'dark'; };
const toggleFontSize = () => {
  fontSize.value =
    fontSize.value === 'normal' ? 'large' : fontSize.value === 'large' ? 'xlarge' : 'normal';
};
const toggleReaderMode = () => {
  readerMode.value = readerMode.value === 'normal' ? 'soft' : 'normal';
};
const toggleBlindMode = () => {
  blindMode.value = !blindMode.value;
};
const toggleContentVisibility = () => {
  hideContent.value = !hideContent.value;
};

const hideIntro = () => {
  showIntro.value = false;
};

onMounted(async () => {
  try {
    const res = await fetch('/site-data.json');
    if (!res.ok) throw new Error('Falha ao carregar dados');
    siteData.value = await res.json();
  } catch (e) {
    console.error('Erro ao carregar site-data.json:', e);
  } finally {
    loading.value = false;
  }

  const today = new Date().toISOString().slice(0, 10);
  try {
    const lastShown = localStorage.getItem(introStorageKey);
    if (lastShown === today) {
      showIntro.value = false;
    } else {
      localStorage.setItem(introStorageKey, today);
      showIntro.value = true;
    }
  } catch {
    showIntro.value = true;
  }

  loadSettings();
  applySettings();

  if (blindMode.value) {
    document.addEventListener('mouseover', speakAlt);
    document.addEventListener('selectionchange', speakSelection);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseover', speakAlt);
  document.removeEventListener('selectionchange', speakSelection);
  if (hoverSpeechTimeout) clearTimeout(hoverSpeechTimeout);
  stopSpeech();
});

watch([theme, fontSize, readerMode, blindMode, hideContent], () => {
  applySettings();
  saveSettings();
});

watch(blindMode, (val) => {
  if (val) {
    document.addEventListener('mouseover', speakAlt);
    document.addEventListener('selectionchange', speakSelection);
  } else {
    document.removeEventListener('mouseover', speakAlt);
    document.removeEventListener('selectionchange', speakSelection);
    if (hoverSpeechTimeout) {
      clearTimeout(hoverSpeechTimeout);
      hoverSpeechTimeout = null;
    }
    stopSpeech();
  }
});
</script>

<template>
  <transition name="fade" mode="out-in">
    <PulsingLogo v-if="showIntro" @completed="hideIntro" />
  </transition>

  <transition name="fade" appear>
    <div v-if="!showIntro && !loading && siteData" class="app-container">
      <ReguaAcessibilidade
        :theme="theme"
        :font-size="fontSize"
        :reader-mode="readerMode"
        :blind-mode="blindMode"
        :hide-content="hideContent"
        @toggle-theme="toggleTheme"
        @toggle-font="toggleFontSize"
        @toggle-reader="toggleReaderMode"
        @toggle-blind="toggleBlindMode"
        @toggle-content="toggleContentVisibility"
      />
      <CarroselBg :slides="siteData.carousel" />
      <WindowContent 
        v-if="!hideContent"
        :cadastro="siteData.cadastro" 
        :devlog="siteData.devlog"
        :sobreJogo="siteData.sobreJogo"
        :sobreEquipe="siteData.sobreEquipe"
      />
    </div>
    <div v-else-if="!showIntro && !siteData && !loading" class="error-message">
      Erro ao carregar dados do site. Verifique o arquivo site-data.json.
    </div>
  </transition>
</template>

<style lang="scss">
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
    align-items: stretch;
  }
}

.error-message {
  color: var(--text-color);
  background: var(--surface-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
  text-align: center;
}
</style>