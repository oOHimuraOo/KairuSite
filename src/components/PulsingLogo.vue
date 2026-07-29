<script setup lang="ts">
const emit = defineEmits<{
  (e: 'completed'): void;
}>();

const handleAnimationEnd = () => {
  emit('completed');
};
</script>

<template>
  <div id="intro-overlay">
    <div
      class="pulsing-logo"
      @animationend="handleAnimationEnd"
    >
      <img src="https://placehold.co/380x380" alt="Logo" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  transition: opacity 0.8s ease;
}

.pulsing-logo {
  width: 180px;
  height: 180px;
  max-width: 180px;
  max-height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #818cf8);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 0 var(--accent-glow);
  animation: pulse-animation 1.2s ease-in-out 3;
  
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@keyframes pulse-animation {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 var(--accent-glow);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 35px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
</style>