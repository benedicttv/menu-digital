<template>
<div>
    <PlusCircle @click="mostrarForm" class="icon-one"/>
    <MenuPrincipal @mostrar="getMostrar" v-if="formCategoria">
        <h2>Crear nueva Categoria</h2>
        <div class="form-container">
            <form @submit="crearCategoria">
                <label for="nombre">Nombre</label>
                <input type="text" v-model="nombre" required>
                <input type="submit" value="Guardar" :disabled="loading">
                <LoadingIcon v-if="loading" class="rotar"/>
            </form>
        </div>
    </MenuPrincipal>

</div>
  
</template>

<script>

import PlusCircle from './icons/PlusCircle.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import MenuPrincipal from './MenuPrincipal.vue'
export default {
    name: 'AddCategoria',
    components: {
        PlusCircle,
        MenuPrincipal,
        LoadingIcon
    },
    data(){
        return{
            formCategoria: false,
            loading: false,
            nombre: ''
        }
    },
    methods:{
        mostrarForm(){
            console.log('Mostrando el formulario')
            this.ocultar = false
            this.formCategoria = true
        },
        getMostrar(resp){
            console.log('ocultando formulario')
            this.formCategoria = false
        },
        async crearCategoria(e){
            e.preventDefault()
            console.log('creando nueva categoria: ', this.nombre)
            this.loading=true
            const categoriaId = this.crearId(20)
            await this.setDoc(this.doc(this.db, "categorias", categoriaId), {
                id: categoriaId,
                lugar: -1000,
                nombre: this.nombre
            })
            this.loading = false
            this.formCategoria = false
        }
    }
}
</script>

<style scoped>
.menu-screen{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: gold;
    top: 0;
    left: 0;
}

</style>