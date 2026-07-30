<script setup lang="ts">
import { ref } from 'vue';
import { insertMailSubscription } from '../supabase';

const localStorageKey = 'kairu-subscribed-emails';

const getStoredEmails = () => {
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) return [] as string[];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
};

const saveStoredEmail = (email: string) => {
  const normalized = email.trim().toLowerCase();
  const current = getStoredEmails();
  if (current.includes(normalized)) return;
  const updated = [...current, normalized];
  localStorage.setItem(localStorageKey, JSON.stringify(updated));
};

const isEmailAlreadyStored = (email: string) => {
  const normalized = email.trim().toLowerCase();
  return getStoredEmails().includes(normalized);
};

const props = defineProps<{
  cadastro: { title: string; content: Array<{ type: string; level?: number; text?: string; ordered?: boolean; items?: string[] }> };
  devlog: Array<{ date: string; title: string; description: Array<{ subtitle: string; text: string }> }>;
  sobreJogo?: { title: string; content: Array<{ type: string; level?: number; text?: string; ordered?: boolean; items?: string[] }> };
  sobreEquipe?: { title: string; content: Array<{ type: string; level?: number; text?: string; ordered?: boolean; items?: string[] }> };
}>();

const activeTab = ref('cadastro');
const isMobile = ref(window.innerWidth <= 768);
const email = ref('');
const isSubmitting = ref(false);
const feedbackMessage = ref('');
const feedbackType = ref<'success' | 'error' | 'idle'>('idle');
const feedbackTimer = ref<number | null>(null);

const tabs = [
  { key: 'cadastro', label: 'Cadastro', icon: 'bi-envelope' },
  { key: 'sobreJogo', label: 'Sobre o Jogo', icon: 'bi-controller' },
  { key: 'sobreEquipe', label: 'Sobre a Equipe', icon: 'bi-people' },
  { key: 'devlog', label: 'Devlog', icon: 'bi-journal' },
];

const renderInline = (text: string): string => {
  if (!text) return '';
  let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html;
};

const clearFeedback = () => {
  if (feedbackTimer.value) {
    window.clearTimeout(feedbackTimer.value);
  }
  feedbackTimer.value = window.setTimeout(() => {
    feedbackMessage.value = '';
    feedbackType.value = 'idle';
  }, 4000);
};

const isEmailValid = (value: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
};

const updateMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

window.addEventListener('resize', updateMobile);

const submitNewsletter = async () => {
  const trimmedEmail = email.value.trim();

  if (!trimmedEmail || !isEmailValid(trimmedEmail)) {
    feedbackMessage.value = 'Informe um e-mail válido no formato exemplo@dominio.com.';
    feedbackType.value = 'error';
    clearFeedback();
    return;
  }

  if (isEmailAlreadyStored(trimmedEmail)) {
    saveStoredEmail(trimmedEmail);
    feedbackMessage.value = 'Já possuímos seu e-mail em nosso sistema.';
    feedbackType.value = 'error';
    clearFeedback();
    return;
  }

  isSubmitting.value = true;
  feedbackMessage.value = '';
  feedbackType.value = 'idle';

  try {
    await insertMailSubscription(trimmedEmail);
    saveStoredEmail(trimmedEmail);
    email.value = '';
    feedbackMessage.value = 'E-mail cadastrado com sucesso!';
    feedbackType.value = 'success';
  } catch (error) {
    saveStoredEmail(trimmedEmail);
    const message = error instanceof Error ? error.message : 'Não foi possível concluir o cadastro no momento.';
    feedbackMessage.value = message;
    feedbackType.value = 'error';
  } finally {
    isSubmitting.value = false;
    clearFeedback();
  }
};
</script>

<template>
  <div v-if="!isMobile" class="info-box visible" id="main-info-box">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :class="[
          'tab-btn',
          { active: activeTab === tab.key },
          { 'first-tab': index === 0 },
          { 'last-tab': index === tabs.length - 1 }
        ]"
        @click="activeTab = tab.key"
        :aria-selected="activeTab === tab.key"
        role="tab"
      >
        <i :class="['bi', tab.icon, 'me-2']" aria-hidden="true"></i>
        {{ tab.label }}
      </button>
    </div>

    <div class="pasta-content">
      <div v-if="activeTab === 'cadastro'" class="tab-content active special" role="tabpanel">
        <div class="tab-text-content">
          <h1>{{ cadastro.title }}</h1>
          <template v-for="(block, idx) in cadastro.content" :key="idx">
            <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
            <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
            <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
            <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
            <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
            <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
            <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
            <ul v-else-if="block.type === 'list' && !block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ul>
            <ol v-else-if="block.type === 'list' && block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ol>
            <hr v-else-if="block.type === 'hr'" />
          </template>
        </div>
        <div class="tab-footer">
          <form class="newsletter-form w-100" @submit.prevent="submitNewsletter">
            <input
              v-model="email"
              type="email"
              class="newsletter-input w-100"
              placeholder="Seu melhor e-mail..."
              required
              aria-label="Endereço de e-mail"
              autocomplete="email"
            />
            <button type="submit" class="submit-btn" :disabled="isSubmitting || !isEmailValid(email)">
              {{ isSubmitting ? 'Enviando...' : 'Inscrever' }}
            </button>
          </form>
          <p v-if="feedbackMessage" class="feedback-message" :class="feedbackType">
            {{ feedbackMessage }}
          </p>
        </div>
      </div>

      <div v-if="activeTab === 'sobreJogo'" class="tab-content active" role="tabpanel">
        <div v-if="sobreJogo">
          <h1>{{ sobreJogo.title }}</h1>
          <template v-for="(block, idx) in sobreJogo.content" :key="idx">
            <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
            <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
            <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
            <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
            <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
            <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
            <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
            <ul v-else-if="block.type === 'list' && !block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ul>
            <ol v-else-if="block.type === 'list' && block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ol>
            <hr v-else-if="block.type === 'hr'" />
          </template>
        </div>
        <div v-else>
          <p>Informações sobre o jogo em breve.</p>
        </div>
      </div>

      <div v-if="activeTab === 'sobreEquipe'" class="tab-content active" role="tabpanel">
        <div v-if="sobreEquipe">
          <h1>{{ sobreEquipe.title }}</h1>
          <template v-for="(block, idx) in sobreEquipe.content" :key="idx">
            <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
            <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
            <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
            <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
            <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
            <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
            <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
            <ul v-else-if="block.type === 'list' && !block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ul>
            <ol v-else-if="block.type === 'list' && block.ordered">
              <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
            </ol>
            <hr v-else-if="block.type === 'hr'" />
          </template>
        </div>
        <div v-else>
          <p>Informações sobre a equipe em breve.</p>
        </div>
      </div>

      <div v-if="activeTab === 'devlog'" class="tab-content active" role="tabpanel">
        <h1>Diário de Desenvolvimento</h1>
        <div v-for="(item, idx) in devlog" :key="idx" class="devlog-item">
          <h2 class="mb-0">{{ item.title }}</h2>
          <div class="devlog-date mb-3">{{ item.date }}</div>
          <div v-for="(desc, dIdx) in item.description" :key="dIdx" class="devlog-description">
            <h4 v-if="desc.subtitle && desc.subtitle.trim() !== ''" class="mt-4 mb-2">{{ desc.subtitle }}</h4>
            <p>{{ desc.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mobile-sections">
    <section class="mobile-section" id="cadastro">
      <h2>{{ cadastro.title }}</h2>
      <template v-for="(block, idx) in cadastro.content" :key="idx">
        <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
        <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
        <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
        <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
        <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
        <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
        <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
        <ul v-else-if="block.type === 'list' && !block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ul>
        <ol v-else-if="block.type === 'list' && block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ol>
        <hr v-else-if="block.type === 'hr'" />
      </template>
      <form class="newsletter-form" @submit.prevent="submitNewsletter">
        <input
          v-model="email"
          type="email"
          class="newsletter-input"
          placeholder="Seu melhor e-mail..."
          required
          aria-label="Endereço de e-mail"
          autocomplete="email"
        />
        <button type="submit" class="submit-btn" :disabled="isSubmitting || !isEmailValid(email)">
          {{ isSubmitting ? 'Enviando...' : 'Inscrever' }}
        </button>
      </form>
      <p v-if="feedbackMessage" class="feedback-message" :class="feedbackType">
        {{ feedbackMessage }}
      </p>
    </section>

    <section v-if="sobreJogo" class="mobile-section" id="sobreJogo">
      <h2>{{ sobreJogo.title }}</h2>
      <template v-for="(block, idx) in sobreJogo.content" :key="idx">
        <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
        <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
        <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
        <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
        <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
        <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
        <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
        <ul v-else-if="block.type === 'list' && !block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ul>
        <ol v-else-if="block.type === 'list' && block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ol>
        <hr v-else-if="block.type === 'hr'" />
      </template>
    </section>

    <section v-if="sobreEquipe" class="mobile-section" id="sobreEquipe">
      <h2>{{ sobreEquipe.title }}</h2>
      <template v-for="(block, idx) in sobreEquipe.content" :key="idx">
        <div v-if="block.type === 'heading' && block.level === 1" v-html="renderInline(block.text || '')" class="heading-level-1"></div>
        <div v-else-if="block.type === 'heading' && block.level === 2" v-html="renderInline(block.text || '')" class="heading-level-2"></div>
        <div v-else-if="block.type === 'heading' && block.level === 3" v-html="renderInline(block.text || '')" class="heading-level-3"></div>
        <div v-else-if="block.type === 'heading' && block.level === 4" v-html="renderInline(block.text || '')" class="heading-level-4"></div>
        <div v-else-if="block.type === 'heading' && block.level === 5" v-html="renderInline(block.text || '')" class="heading-level-5"></div>
        <div v-else-if="block.type === 'heading' && block.level === 6" v-html="renderInline(block.text || '')" class="heading-level-6"></div>
        <p v-else-if="block.type === 'paragraph'" v-html="renderInline(block.text || '')"></p>
        <ul v-else-if="block.type === 'list' && !block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ul>
        <ol v-else-if="block.type === 'list' && block.ordered">
          <li v-for="(item, i) in block.items" :key="i" v-html="renderInline(item)"></li>
        </ol>
        <hr v-else-if="block.type === 'hr'" />
      </template>
    </section>

    <section class="mobile-section" id="devlog">
      <h2>Diário de Desenvolvimento</h2>
      <div v-for="(item, idx) in devlog" :key="idx" class="devlog-item">
        <div class="devlog-date">{{ item.date }}</div>
        <h3>{{ item.title }}</h3>
        <div v-for="(desc, dIdx) in item.description" :key="dIdx" class="devlog-description">
          <h5 v-if="desc.subtitle && desc.subtitle.trim() !== ''">{{ desc.subtitle }}</h5>
          <p>{{ desc.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.info-box {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 55vw;
  max-height: 55vh;
  background: transparent;
  border-radius: 16px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 5;
  overflow: visible;
  display: flex;
  flex-direction: column;

  &.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.tabs-header {
  display: flex;
  position: relative;
  z-index: 0;
  background: transparent;
  width: auto;
  flex-shrink: 0;
  gap: 0;
}

.tab-btn {
  flex: 0 1 auto;
  padding: 10px 18px 8px 18px;
  background: var(--surface-color);
  border: 1px solid var(--surface-border);
  border-bottom: none;
  color: var(--text-color-dark);
  font-weight: 600;
  cursor: pointer;
  opacity: 0.8;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  transform: translateY(0);
  position: relative;
  z-index: 1;
  margin-bottom: 0;

  i { font-size: 1.1rem; }

  &.first-tab { border-radius: 10px 0 0 0; }
  &.last-tab { border-radius: 0 10px 0 0; }
  &.first-tab.last-tab { border-radius: 10px 10px 0 0; }

  &:not(.first-tab) { border-left: none; }
  &:not(.last-tab) { border-right: none; }

  &:hover {
    opacity: 1 !important;
    background: var(--surface-color-hover);
    z-index: 2;
  }

  &.active {
    opacity: 1;
    background: var(--surface-color);
    border-color: var(--surface-border);
    border-bottom: 1px solid var(--surface-color);
    color: var(--primary-color);
    transform: translateY(-1px);
    z-index: 3;
    margin-bottom: -1px;
    box-shadow:
      0 -4px 12px rgba(0, 0, 0, 0.1),
      4px 0 8px -4px rgba(0, 0, 0, 0.15),
      -4px 0 8px -4px rgba(0, 0, 0, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: 14px;
      width: 20px;
      height: 7px;
      background: var(--primary-color);
      border-radius: 5px 5px 0 0;
      opacity: 0.7;
    }
  }

  &.active + .tab-btn:not(.active) {
    box-shadow: -4px 0 8px -4px rgba(0, 0, 0, 0.15);
  }
  
  .tab-btn:has(+ .active) {
    box-shadow: 4px 0 8px -4px rgba(0, 0, 0, 0.15);
  }
}

.pasta-content {
  background: var(--surface-color);
  border: 1px solid var(--surface-border);
  border-top: 1px solid var(--surface-border);
  border-radius: 0 16px 16px 16px;
  backdrop-filter: blur(16px);
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px 30px 24px;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  width: 100%;

  scrollbar-width: thin;
  scrollbar-color: var(--surface-border) transparent;

  &::-webkit-scrollbar { 
    width: 6px; 
  }
  
  &::-webkit-scrollbar-track { 
    background: transparent; 
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--surface-border);
    border-radius: 4px;
  }

  [data-theme="light"] & {
    background: var(--surface-color);
  }
}

.tab-content {
  display: block;
  height: 100%;

  &.active { display: block; }

  &.special {
    display: flex !important;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .tab-text-content {
      flex: 1;
      overflow-y: auto;
    }
    .tab-footer {
      margin-top: 20px;
      flex-shrink: 0;
    }
  }
}

.heading-level-1 {
  font-size: 2.5rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.heading-level-2 {
  font-size: 2rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.heading-level-3 {
  font-size: 1.5rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.heading-level-4 {
  font-size: 1.2rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.heading-level-5 {
  font-size: 1rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.heading-level-6 {
  font-size: 0.9rem;
  font-family: 'Permanent Marker', cursive;
  color: var(--primary-color);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

h1 {
  color: var(--primary-color) !important;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--secondary-color) !important;
  font-family: 'Share Tech Mono', monospace;
}

ul, ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;

  li {
    margin-bottom: 0.3rem;
    color: var(--secondary-color) !important;
    font-family: 'Share Tech Mono', monospace;
  }
}

a {
  color: var(--primary-color);
  text-decoration: underline;

  &:hover { 
    opacity: 0.8; 
  }
}

strong { 
  font-weight: 700; 
}

hr {
  border: none;
  border-top: 1px solid var(--surface-border);
  margin: 1.5rem 0;
}

.devlog-item {
  margin-bottom: 30px;
  color: var(--secondary-color);

  .devlog-date {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 4px;
    font-family: 'Share Tech Mono', monospace;
  }

  h2 {
    font-size: 1.8rem;
    margin: 8px 0 12px 0;
    font-family: 'Permanent Marker', cursive;
  }

  .devlog-description {
    margin-bottom: 12px;

    h4 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 12px 0 4px 0;
      font-family: 'Google Sans Code', monospace;
    }

    p {
      margin: 4px 0 0 0;
      line-height: 1.6;
      opacity: 0.9;
      color: var(--secondary-color) !important;
      font-family: 'Google Sans Code', monospace;
    }
  }
}

.newsletter-form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.newsletter-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, 0.07);
}

.submit-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: var(--btn-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-speed), opacity 0.3s;

  &:hover:not(:disabled) { 
    background: var(--primary-hover); 
  }

  &:disabled {
    background: var(--surface-border);
    color: var(--text-color);
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.feedback-message {
  margin-top: 10px;
  font-size: 0.95rem;
  font-weight: 600;

  &.success { 
  color: #16a34a; 
  }

  &.error { 
    color: #dc2626; 
    }
}

.mobile-sections {
  width: 100%;
  max-width: 100%;
  padding: 20px;
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-section {
  background: var(--surface-color);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  h2 {
    font-size: 1.8rem;
    margin-bottom: 16px;
    font-family: 'Permanent Marker', cursive;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 8px;
    font-family: 'Permanent Marker', cursive;
  }

  .devlog-item {
    margin-bottom: 30px;

    .devlog-date {
      font-size: 0.85rem;
      opacity: 0.7;
      margin-bottom: 4px;
      font-family: 'Share Tech Mono', monospace;
    }

    h3 {
      font-size: 1.4rem;
      margin: 8px 0 12px 0;
    }

    .devlog-description {
      margin-bottom: 12px;

      h5 {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 12px 0 4px 0;
        font-family: 'Google Sans Code', monospace;
      }

      p {
        margin: 4px 0 0 0;
        line-height: 1.6;
        opacity: 0.9;
        font-family: 'Google Sans Code', monospace;
      }
    }
  }

  .newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
  }

  .newsletter-input {
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid var(--surface-border);
    background: rgba(255, 255, 255, 0.05);
    width: 100%;
  }

  .submit-btn {
    background: var(--primary-color);
    transition: background var(--transition-speed), opacity 0.3s;
    &:hover:not(:disabled) { 
      background: var(--primary-hover); 
    }
    
    &:disabled {
      background: var(--btn-bg-disabled);
      opacity: 0.7;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}

@media (max-width: 480px) {
  .mobile-section h2 { font-size: 1.5rem; }
}
</style>