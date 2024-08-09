<template>
<div>
    <div class="container mb-5">
        <div class="cat-name">
            <GoBackIcon @click="volverCategorias" class="icon-one"/>
            <h2>{{ nombre_cat }}</h2>
            <button class="bt-add" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight_nuevoPlato'+id" :aria-controls="'offcanvasRight_nuevoPlato'+id">
                <AddIcon class="icon-one"/>
            </button>
        </div>
        <p v-if="descargando">Descargando... <LoadingIcon/></p>
        <div class="platos-container">
            <Plato v-for="plato in platos"
            :key="plato.id"
            :plato="plato"/>
        </div>
    </div>
    <FormNuevoPlato :cat_id="id_categoria" :name_cat="nombre_categoria" @abrir_plato_screen="scroll_top"/>
</div>

</template>

<script>

import GoBackIcon from './icons/GoBackIcon.vue';
import AddIcon from './icons/AddIcon.vue';
import FormNuevoPlato from './FormNuevoPlato.vue'
import Plato from './Plato.vue'
import CloseIcon from './icons/CloseIcon.vue'
import LoadingIcon from './icons/LoadingIcon.vue'

export default {
    inject: ['globalUser'],
    name: 'PlatoScreen',
    emits:['volver'],
    components: {
        AddIcon,
        FormNuevoPlato,
        CloseIcon,
        Plato,
        LoadingIcon,
        GoBackIcon
    },
    props:{
        nombre_categoria:{
            type: String,
            default: 'Nombre de la categoria',
            required: true
        },
        id_categoria: {
            type: String,
            required: true
        },
    },
    data(){
        return{
            nombre_cat: this.nombre_categoria,
            id: this.id_categoria,
            platos: [],
            descargando: true,
            unsub: null
        }
    },
    methods:{
        scroll_top(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        volverCategorias(){
            console.log('volviendo a categorias...')
            this.$emit('volver', true)
        },
        async descargarPlatos() {
            this.descargando = true
            const platosRef = this.query(this.collection(this.db, 'platos'), this.where('categoria', '==', this.id_categoria))

            try {
                this.unsub = await this.onSnapshot(platosRef, (querySnapshot) => {
                // Recibe actualizaciones en tiempo real
                    this.platos = [];
                    querySnapshot.forEach((doc) => {
                        this.platos.push(doc.data());
                    });
                    this.descargando = false
                    console.log('Los platos son:', this.platos);
                });
            } catch (error) {
                console.log('Error: ', error)
            }
        }
    },
    created(){
        this.descargarPlatos()
    },
    beforeUnmount(){
        this.unsub()
    }

}
</script>

<style scoped>

.platos-container{
    max-width: 450px;
    margin: auto;
}

.cat-name{
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 5px;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: solid 1px gainsboro;
    padding: 10px 0px;
    box-sizing: border-box;
    position: sticky;
    top: 90px;
    background-color: white;
    z-index: 499;
}
h2{
    margin: auto;
    margin-left: 0px;
}

.icon-one{
    width: 20px;
    height: 20px;
}

.bt-add{
    border: none;
    background-color: #00000000;
}

@media (prefers-color-scheme: dark) {
  .cat-name {
    background-color: #151515;
    color: white;
  }
  p{
    color: whitesmoke;
  }
  .icon-one{
    color: white;
  }
}

</style>