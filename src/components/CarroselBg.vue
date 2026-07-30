<script setup lang="ts">
defineProps<{
  slides: Array<{ src: string; alt: string }>;
}>();
</script>

<template>
  <div id="CaroselBg" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        v-for="(_, index) in slides"
        :key="index"
        type="button"
        data-bs-target="#CaroselBg"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>

    <div class="carousel-inner">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-item"
        :class="{ active: index === 0 }"
      >
        <img :src="slide.src" class="d-block carousel-img" :alt="slide.alt" />
      </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#CaroselBg" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#CaroselBg" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Próximo</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
#CaroselBg {
  width: 100vw;
  height: 100vh;
  
  .carousel-inner {
    height: 100%;
    
    .carousel-item {
      height: 100%;
    }
  }
  
  @media (max-width: 768px) {
    height: 100vh;
  }
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.carousel-indicators [data-bs-target] {
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  width: 30px;
  height: 3px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &.active {
    background-color: var(--primary-color, #BA5710);
    opacity: 1;
    width: 40px;
  }
}

[data-theme="dark"] .carousel-indicators [data-bs-target] {
  background-color: rgba(255, 255, 255, 0.25);
  &.active {
    background-color: var(--primary-dark, #6C3209);
  }
}

[data-theme="light"] .carousel-indicators [data-bs-target] {
  background-color: rgba(0, 0, 0, 0.2);
  &.active {
    background-color: var(--primary-color, #BA5710);
  }
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  opacity: 0.7;
  transition: opacity 0.3s ease;

  background-color: var(--primary-color, #BA5710);
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;

  mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BA5710' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M15 18l-6-6 6-6'/%3e%3c/svg%3e");
  -webkit-mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BA5710' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M15 18l-6-6 6-6'/%3e%3c/svg%3e");
}

.carousel-control-next-icon {
  mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BA5710' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M9 18l6-6-6-6'/%3e%3c/svg%3e");
  -webkit-mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BA5710' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M9 18l6-6-6-6'/%3e%3c/svg%3e");
}

[data-theme="dark"] .carousel-control-prev-icon,
[data-theme="dark"] .carousel-control-next-icon {
  background-color: var(--primary-dark, #6C3209);
  opacity: 0.6;
}

[data-theme="light"] .carousel-control-prev-icon,
[data-theme="light"] .carousel-control-next-icon {
  background-color: var(--primary-color, #BA5710);
  opacity: 0.5;
}

.carousel-control-prev:hover .carousel-control-prev-icon,
.carousel-control-next:hover .carousel-control-next-icon {
  opacity: 1;
}

[data-reader-mode="soft"] .carousel-control-prev-icon,
[data-reader-mode="soft"] .carousel-control-next-icon {
  background-color: var(--primary-color, #BA5710);
  opacity: 0.6;
}
</style>