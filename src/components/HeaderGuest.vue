<template>
<div>
  <header>
    <!-- lado izquierdo -->
    <div class="bts-header">
      <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_carrito" aria-controls="offcanvas_carrito" class="position-relative btn" :disabled="!aceptarOrdenes">
        <Basket2fill class="icon-header"/>
        <span v-if="cantItems > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{cantItems}}
          <span class="visually-hidden">unread messages</span>
        </span>
      </button>
    </div>
    <img :src="logo" alt="Logo" loading="lazy">
    <!-- lado derecho -->
    <div class="bts-header">
      <button style="opacity: 0.5">
        <Bellservice class="icon-header"/>
      </button>
    </div>
  </header>
  <slot/>
</div>
</template>

<script>
import { computed } from 'vue'
import Basket2fill from './icons/Basket2fill.vue'
import Bellservice from './icons/Bellservice.vue'

export default {
    name: 'HeaderGuest',
    emtis: ['eliminarItem'],
    inject: ['aceptarOrdenes'],
    components: {
      Basket2fill,
      Bellservice,
    },
    props:{
      logo: {
        type: String
      },
      cantItems: {
        type: Number
      }
    },
    data(){
      return{
        la_orden: 0,
        carrito: null,
        billOffcanvas: false,
      }
    },
    methods: {
      eliminarItem(){
        console.log('Elimando un item')
        this.$emit('eliminarItem')
      }
    }
}
</script>

<style scoped>
header{
  background-color: whitesmoke;
}
header svg{
  fill: #343434;
}
</style>