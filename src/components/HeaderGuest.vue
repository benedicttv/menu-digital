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
      <button type="button" class="btn" @click="abrirWhatsApp" :disabled="!num_whatsapp || num_whatsapp === ''">
        <Bellservice class="icon-header"/><!-- debe abrir la app de whatsapp cuando hace click -->
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
      },
      num_whatsapp: {
        type: String,
        required: false
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
      },
      abrirWhatsApp() { // Nuevo método para abrir WhatsApp
        const whatsappUrl = `https://wa.me/+1${this.num_whatsapp}`;
        window.open(whatsappUrl, '_blank');
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