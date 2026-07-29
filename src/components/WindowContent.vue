<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  cadastro: { title: string; paragraphs: string[] };
  devlog: Array<{ date: string; title: string; description: string }>;
}>();

const activeTab = ref('cadastro');

const submitNewsletter = () => {
  window.alert('Inscrição realizada com sucesso!');
};
</script>

<template>
  <div class="info-box visible" id="main-info-box">
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

    <div v-show="activeTab === 'devlog'" class="tab-content active" role="tabpanel">
      <h1>Diário de Desenvolvimento</h1>
      <div v-for="(item, idx) in devlog" :key="idx" class="devlog-item">
        <div class="devlog-date">{{ item.date }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

@media (max-width: 768px) {
  .info-box {
    max-width: 90vw;
    max-height: 80vh;
    width: 90%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
  }

  .tab-content {
    padding: 20px;
    max-height: 60vh;
  }

  .tab-btn {
    padding: 12px 8px;
    font-size: 0.9rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .newsletter-form {
    flex-direction: column;
    gap: 8px;
  }

  .submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tab-btn {
    font-size: 0.8rem;
    padding: 10px 6px;
  }

  .tab-content {
    padding: 16px;
  }

  h1 {
    font-size: 1.4rem;
  }
}
</style>