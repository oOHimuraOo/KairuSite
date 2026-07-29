<script setup lang="ts">
  defineProps<{
    slides: Array<{ src: string; alt: string }>;
  }>();
</script>

<template>
  <div id="CaroselBg" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        v-for="(_slide, index) in slides"
        :key="index"
        type="button"
        data-bs-target="#CaroselBg"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>

    <div class="carousel-inner min-vw-100 min-vh-100">
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
/* Estilos específicos do carrossel (opcional, a maior parte já está no main.scss) */
</style>