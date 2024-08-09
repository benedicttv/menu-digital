<template>
<div class="border-bottom" v-if="data.visible">
    <div :data-bs-toggle="aceptarOrdenes ? 'offcanvas': null" :data-bs-target="'#offcanvasBottom_platoPublic'+data.id" :aria-controls="'offcanvasBottom_platoPublic'+data.id">
        <img v-if="data.img != ''" :src="data.img" :alt="data.nombre" loading="lazy">
        <h3 class="fw-bold fs-5">{{ data.nombre }}</h3>
        <h4 class="fw-bold fs-6">{{ data.precio.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' }) }}</h4>
        <p class="descripcion-plato">{{data.descripcion}}</p>
        <div v-if="data.opcionesPlato && data.opcionesPlato.name != ''">
            <p class="fw-bold" style="font-family: var(--font-3)">{{data.opcionesPlato.name}}</p>
            <div style="font-family: var(--font-3)"  v-for="(alternativa, clave) in data.opcionesPlato" :key="clave">
                <div class="alternativas" v-if="alternativa.name">
                    <span>{{alternativa.name}}</span>
                    <span>{{(alternativa.precio+data.precio).toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</span>
                </div>
            </div>
        </div>
        <button class="btn btn-outline-primary mb-3 mt-2" style="font-family: var(--font-4)">
            <i v-if="aceptarOrdenes" class="bi bi-bag-plus-fill shop-icon"></i> Agregar a la orden
        </button>
    </div>
  <OpcionesPlatoPublic :plato="data" @item_agregado="nuevo_item_orden"/>
</div>
</template>

<script>
import OpcionesPlatoPublic from './OpcionesPlatoPublic.vue'
export default {
    name: 'PlatoPublicButton',
    components: { OpcionesPlatoPublic },
    emits:['nuevoPedido',],
    inject: ['aceptarOrdenes'],
    props:{
        data:{
            type: Object,
            required: true,
        },
    },
    methods:{
        nuevo_item_orden(){
            console.log('emitiendo')
            this.$emit('nuevoPedido')
        },
    },//methods
}
</script>

<style scoped>
.title-font{
    font-family: var(--font-h);
}

h3{
    font-family: var(--font-1)
}
h4{
    font-family: var(--font-4);
}
.plato{
    border: none;
    background-color: #00000000;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: grid;
    align-items: end;
    padding: 0px;
    width: 100%;
}

img{
    width: 100%;
    height: 350px;
    object-fit: cover;
    margin-bottom: 5px;
}

.plato-height{
    height: auto;
}

.plato-data{
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 15px;
    text-align: left;
    width: 100%;
    padding: 10px 10px 0px 10px;
}

.plato-data-img{
    background-image: linear-gradient(#343434, #000000);
    color: #ffffff;
}

.plato-data-no-img{
    border-bottom: solid 1px gainsboro;
    color: black;
}

.descripcion-plato{
    grid-column: 1 / span 2;
    font-family: var(--font-4);
}
.alternativas{
    display: grid;
    grid-template-columns: 1fr auto;
}

@media (prefers-color-scheme: dark){
    h3, h2, h4, .shop-icon{
        color: white;
    }
}

</style>