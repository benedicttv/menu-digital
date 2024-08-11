<template>
  <div class="item-carrito mb-3">
    <div>
        <img v-if="data.plato.img !== ''" :src="data.plato.img" :alt="data.plato.nombre">
        <img v-else src='https://cdn-icons-png.flaticon.com/128/10701/10701484.png' :alt="data.plato.nombre">
    </div>
    <div>
        <span>{{ data.plato.nombre }}</span>

        <p v-if="data.alternativa && data.alternativa != '' && data.alternativa != null ">Precio: {{ ((data.plato.precio+data.plato.opcionesPlato[data.alternativa].precio) * data.cantidad).toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}} </p>
        <p v-else>
            Precio: {{ (data.plato.precio * data.cantidad).toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}} 
        </p>

        <div class="mb-1" v-if="data.alternativa && data.alternativa != '' && data.alternativa != null ">
            <span>{{data.plato.opcionesPlato[data.alternativa].name}}</span>
        </div>
        <div class="bt-minmax">
            
            <span>Cantidad: </span> <button @click="res">-</button><span></span>{{data.cantidad}}<button @click="sum">+</button>
        </div>
    </div>
    <button @click="eli" class="bt-delete">
        <DeleteIcon class="icon-one"/>
    </button>
  </div>
</template>

<script>
import DeleteIcon from './icons/DeleteIcon.vue'
export default {
    name:'ItemCarrito',
    emits: ['sumar', 'restar', 'eliminar'],
    components: { DeleteIcon},
    props:{
        data: {type: Object, required: true}
    },
    data(){
        return{
            total: 0
        }
    },
    methods:{
        sum(){
            const itemId = this.data.alternativa ? `${this.data.plato.id}-${this.data.alternativa}` : this.data.plato.id;
            this.$emit('sumar', itemId)
        },
        res(){
            const itemId = this.data.alternativa ? `${this.data.plato.id}-${this.data.alternativa}` : this.data.plato.id;
            this.$emit('restar', itemId)
        },
        eli(){
            const itemId = this.data.alternativa ? `${this.data.plato.id}-${this.data.alternativa}` : this.data.plato.id;
            this.$emit('eliminar', itemId)
        },
    },
}
</script>

<style scoped>
img{
    width: 50px;
    height: 50px;
    object-fit: cover;
}
.item-carrito{
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 5px;
    border-bottom: 1px solid gainsboro;
    padding-bottom: 15px;
}

.bt-delete{
    border: none;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    background-color: #dddddd00;
}
.icon-one{
    color: #151515;
    height: 25px;
    width: 25px;
}
.bt-minmax{
    display: grid;
    grid-template-columns: repeat(5, auto) ;
    column-gap: 5px;
}
.bt-minmax button{
    border: none;
    background-color: #dddddd;
    color: black;
}

@media (prefers-color-scheme: dark){
    p{
        color: #101010
    }
}

</style>