<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  cadastro: { title: string; paragraphs: string[] };
  devlog: Array<{ date: string; title: string; description: string }>;
}>();

const activeTab = ref('cadastro');
const isMobile = ref(window.innerWidth <= 768);

const updateMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Atualiza ao redimensionar
window.addEventListener('resize', updateMobile);

const submitNewsletter = () => {
  window.alert('Inscrição realizada com sucesso!');
};
</script>

<template>
  <!-- Layout Desktop: janela sobreposta com abas -->
  <div v-if="!isMobile" class="info-box visible" id="main-info-box">
    <div class="tabs-header">
      <button
        :class="['tab-btn', { active: activeTab === 'cadastro' }]"
        @click="activeTab = 'cadastro'"
        :aria-selected="activeTab === 'cadastro'"
      >
        Cadastro & Sobre
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'devlog' }]"
        @click="activeTab = 'devlog'"
        :aria-selected="activeTab === 'devlog'"
      >
        Devlog
      </button>
    </div>

    <!-- Tab 1: Cadastro -->
    <div
      v-show="activeTab === 'cadastro'"
      class="tab-content active"
      :class="{ special: activeTab === 'cadastro' }"
      role="tabpanel"
    >
      <div>
        <h1>{{ cadastro.title }}</h1>
        <p v-for="(p, idx) in cadastro.paragraphs" :key="idx">{{ p }}</p>
      </div>
      <form class="newsletter-form w-100" @submit.prevent="submitNewsletter">
        <input
          type="email"
          class="newsletter-input w-100"
          placeholder="Seu melhor e-mail..."
          required
          aria-label="Endereço de e-mail"
        />
        <button type="submit" class="submit-btn">Inscrever</button>
      </form>
    </div>

    <!-- Tab 2: Devlog -->
    <div v-show="activeTab === 'devlog'" class="tab-content active" role="tabpanel">
      <h1>Diário de Desenvolvimento</h1>
      <div v-for="(item, idx) in devlog" :key="idx" class="devlog-item">
        <div class="devlog-date">{{ item.date }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>

  <!-- Layout Mobile: seções empilhadas (sem abas) -->
  <div v-else class="mobile-sections">
    <!-- Seção 1: Cadastro & Sobre -->
    <section class="mobile-section" id="sobre">
      <h2>{{ cadastro.title }}</h2>
      <p v-for="(p, idx) in cadastro.paragraphs" :key="idx">{{ p }}</p>
      <form class="newsletter-form" @submit.prevent="submitNewsletter">
        <input
          type="email"
          class="newsletter-input"
          placeholder="Seu melhor e-mail..."
          required
          aria-label="Endereço de e-mail"
        />
        <button type="submit" class="submit-btn">Inscrever</button>
      </form>
    </section>

    <!-- Seção 2: Devlog -->
    <section class="mobile-section" id="devlog">
      <h2>Diário de Desenvolvimento</h2>
      <div v-for="(item, idx) in devlog" :key="idx" class="devlog-item">
        <div class="devlog-date">{{ item.date }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
// ========== Estilos desktop (existente) ==========
.info-box {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 55vw;
  max-height: 55vh;
  background: var(--surface-color);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 5;

  &.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.special {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.tabs-header {
  display: flex;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--surface-border);

  [data-theme="light"] & {
    background: rgba(0, 0, 0, 0.05);
  }
}

.tab-btn {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  position: relative;
  opacity: 0.6;

  &.active {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary-color);
  }
}

.tab-content {
  padding: 30px;
  display: none;
  max-height: calc(100% - 60px);
  overflow-y: auto;

  &.active {
    display: block;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--surface-color);
  border-radius: 4px;
  border: 2px solid var(--surface-border);

  &:hover {
    background: var(--surface-border);
  }
}

.devlog-item {
  margin-bottom: 20px;
  color: var(--secondary-color);

  .devlog-date {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 4px;
  }
}

.newsletter-form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.newsletter-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.submit-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: var(--btn-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-speed);

  &:hover {
    background: var(--primary-hover);
  }
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--primary-color);
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: var(--primary-color);
}

p {
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
  color: var(--secondary-color);
}

// ========== Layout Mobile ==========
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
    color: var(--primary-color);
  }
  
  .devlog-item {
    margin-bottom: 20px;
    color: var(--secondary-color);
    
    .devlog-date {
      font-size: 0.85rem;
      opacity: 0.7;
      margin-bottom: 4px;
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
    color: var(--text-color);
    width: 100%;
  }
  
  .submit-btn {
    padding: 12px 20px;
    background: var(--primary-color);
    color: var(--btn-text-color, #ffffff);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transition-speed);
    width: 100%;
    
    &:hover {
      background: var(--primary-hover);
    }
  }
}

// Responsividade dos títulos no mobile
@media (max-width: 480px) {
  .mobile-section h2 {
    font-size: 1.5rem;
  }
}
</style>