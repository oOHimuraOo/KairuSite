<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  theme: 'dark' | 'light';
  fontSize: 'normal' | 'large' | 'xlarge';
  readerMode: 'normal' | 'soft';
  blindMode: boolean;
  hideContent: boolean; // NOVO
}>();

const emit = defineEmits<{
  (e: 'toggle-theme'): void;
  (e: 'toggle-font'): void;
  (e: 'toggle-reader'): void;
  (e: 'toggle-blind'): void;
  (e: 'toggle-content'): void; // NOVO
}>();

const themeIcon = computed(() => (props.theme === 'dark' ? 'bi-brightness-high-fill' : 'bi-moon-stars-fill'));
const themeTitle = computed(() => (props.theme === 'dark' ? 'Modo claro' : 'Modo escuro'));

const fontLabel = computed(() => (props.fontSize === 'normal' ? 'A' : props.fontSize === 'large' ? 'A+' : 'A++'));
const fontTitle = computed(() => (props.fontSize === 'normal' ? 'Aumentar fonte' : props.fontSize === 'large' ? 'Aumentar mais' : 'Redefinir tamanho'));

const readerIcon = computed(() => (props.readerMode === 'soft' ? 'bi-eye-slash' : 'bi-eye'));
const readerTitle = computed(() => (props.readerMode === 'normal' ? 'Ativar modo leitura (suave)' : 'Desativar modo leitura'));

const blindIcon = computed(() => (props.blindMode ? 'bi-mic' : 'bi-mic-mute'));
const blindTitle = computed(() => (props.blindMode ? 'Desativar Leitor Dinâmico' : 'Ativar Leitor Dinâmico (leitura por foco e seleção)'));

const contentIcon = computed(() => (props.hideContent ? 'bi-journal-x' : 'bi-journal-check'));
const contentTitle = computed(() => (props.hideContent ? 'Mostrar conteúdo' : 'Esconder conteúdo'));
</script>

<template>
  <div class="top-bar">
    <button
      class="control-btn"
      id="theme-toggle"
      :title="themeTitle"
      @click="emit('toggle-theme')"
      :aria-pressed="props.theme === 'dark'"
    >
      <i :class="['bi', themeIcon]" aria-hidden="true"></i>
      <span class="visually-hidden">{{ themeTitle }}</span>
    </button>

    <button
      class="control-btn"
      id="font-toggle"
      :title="fontTitle"
      @click="emit('toggle-font')"
      :aria-pressed="props.fontSize !== 'normal'"
    >
      <h5>{{ fontLabel }}</h5>
      <span class="visually-hidden">{{ fontTitle }}</span>
    </button>

    <button
      class="control-btn"
      id="reader-toggle"
      :title="readerTitle"
      @click="emit('toggle-reader')"
      :aria-pressed="props.readerMode === 'soft'"
    >
      <i :class="['bi', readerIcon]" aria-hidden="true"></i>
      <span class="visually-hidden">{{ readerTitle }}</span>
    </button>

    <button
      class="control-btn"
      id="blind-toggle"
      :title="blindTitle"
      @click="emit('toggle-blind')"
      :aria-pressed="props.blindMode"
    >
      <i :class="['bi', blindIcon]" aria-hidden="true"></i>
      <span class="visually-hidden">{{ blindTitle }}</span>
    </button>

    <!-- NOVO BOTÃO: esconder/mostrar conteúdo da janela -->
    <button
      class="control-btn"
      id="content-toggle"
      :title="contentTitle"
      @click="emit('toggle-content')"
      :aria-pressed="props.hideContent"
    >
      <i :class="['bi', contentIcon]" aria-hidden="true"></i>
      <span class="visually-hidden">{{ contentTitle }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 10;
}

.control-btn {
  background: var(--surface-color);
  border: 1px solid var(--surface-border);
  color: var(--text-color);
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }

  h5 {
    margin: 0;
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .top-bar {
    top: 12px;
    right: 12px;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .control-btn {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
@media (max-width: 480px) {
  .control-btn {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
  .control-btn h5 {
    font-size: 1rem;
  }
}
</style>