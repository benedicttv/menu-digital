<template>
  <div class="row g-3 container mb-3">
    <!-- para comer aquí -->
    <div v-if="setting && setting.ordenarMesa" class="form-check col">
        <input class="form-check-input" type="radio" name="tipoOrden" id="comerAqui" v-model="tipoOrden" value="comerAqui" :disabled="!setting.ordenarMesa">
        <label class="form-check-label" for="comerAqui">
            Para comer aquí
        </label>
    </div>

    <!-- <div class="form-check col">
        <input class="form-check-input" type="radio" name="tipoOrden" v-model="tipoOrden" value="llevar" id="llevar">
        <label class="form-check-label" for="llevar">
            Llevar
        </label>
    </div> -->

    <div v-if="setting && setting.ordenarDelivery" class="form-check col">
        <input class="form-check-input" type="radio" name="tipoOrden" v-model="tipoOrden" value="delivery" id="delivery">
        <label class="form-check-label" for="delivery">
            Ordenar por Whatsapp
        </label>
    </div>

  </div>
</template>

<script>
export default {
    name: 'TipoOrden',
    emits: ['tipo_orden'],
    inject: ['setting'],
    porps: {
        settings: {
            type: Object,
            required: true
        }
    },
    data(){
        return{
            tipoOrden: ''
        }
    },
    watch:{
        tipoOrden(tipoNuevo, tipoAnterior){
            console.log(`El tipo de orden cambió de ${tipoAnterior} a ${tipoNuevo}`)
            this.$emit('tipo_orden', tipoNuevo)
        }
    }

}
</script>

<style>

</style>
