<template>
  <div class="accordion accordion-flush" id="ordenes_cuenta">
    <Recibo v-for="recibo in Object.values(losRecibos)" :key="recibo.id" :recibo="recibo" :recibo_id="recibo.id"/>
  </div>
</template>

<script>
import Recibo from './Recibo.vue'
export default {
    name: 'Cuenta',
    inject:['losRecibos'],
    components: { Recibo },
    data(){
        return{
            total: 0,
        }
    },
}
</script>

<style>

</style>