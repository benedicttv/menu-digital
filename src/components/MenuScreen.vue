<template>
  <div class="container menu-screen">
    <Header v-if="the_header" @showhome="renderHome" :imgurl="logo"/>
    <ul class="nav nav-tabs">
        <li class="nav-item" @click="mostrarmenu">
            <a style="font-family: var(--font-3)" :class="['nav-link fw-bold', {active: show_categorias || mostrarPlatos}]" aria-current="page" href="#">Menú</a>
        </li>
        <li class="nav-item" @click="mostrarOrdenesScreen">
            <a style="font-family: var(--font-3)" :class="['nav-link fw-bold', {active: ordenesScreen}]" href="#">Órdenes</a>
        </li>
        <!-- <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Cuentas</a>
        </li> -->
    </ul>
    <CategoriasScreen @platos_screen="showPlatos" v-if="show_categorias"/>
    <PlatoScreen @volver="mostrar_categorias" :nombre_categoria="cat_nombre" :id_categoria="categoria_id" v-if="mostrarPlatos"/>
    <Ordenes v-if="ordenesScreen"/>
  </div>
</template>

<script>
import CategoriasScreen from './CategoriasScreen.vue'
import Screen from './Screen.vue'
import Header from './Header.vue'
import FormNuevaCategoria from './FormNuevaCategoria.vue'
import PlatoScreen from './PlatoScreen.vue'
import FormEditartCategoria from './FormEditartCategoria.vue'
import { computed } from 'vue'
import Ordenes from './admin/Ordenes.vue'

export default {
    inject: ['globalUser'],
    emits:['renderhome'],
    name: 'MenuScreen',
    components: {
        Screen,
        Header,
        CategoriasScreen,
        FormNuevaCategoria,
        PlatoScreen,
        FormEditartCategoria,
        Ordenes
    },
    data(){
        return{
            menu: null,
            logo: '../../src/assets/logo.svg',
            mostrarPlatos: false,
            cat_nombre: null,
            categoria_id: null,
            show_categorias: true,
            ubicacion: 'Menú',
            the_header: true,
            la_ubicacion: true,
            website: null,
            ordenesScreen: false,
            totalOrders: 0, 
            unsub: null,

        }
    },
    provide(){
        return{
            website: computed(() => this.website),
            nombreNegocio: computed(() => this.menu.nombre)
        }
    },
    methods: {
        mostrarOrdenesScreen(){
            this.show_categorias = false
            this.mostrarPlatos = false
            this.ordenesScreen = true
        },
        mostrarmenu(){
            this.show_categorias = true
            this.mostrarPlatos = false
            this.ordenesScreen = false
        },
        renderHome(){
            console.log('emitiendo:')
            this.$emit('renderhome', true)
        },
        showPlatos(resp){
            this.mostrarPlatos = true
            this.categoria_id = resp.id
            this.cat_nombre = resp.nombre
            this.show_categorias = false
        },
        mostrar_categorias(){
            this.mostrarPlatos = false
            this.show_categorias = true
        },
        descargarLogo(logoRef){
            const pathReference = this.ref(this.storage, logoRef)
            this.getDownloadURL(pathReference)
            .then((url)=>{
                this.logo = url
            })
            .catch((error)=>{
                console.log('Ha ocurrido un error: ', error)
            })
        }

    },//methods
    async created(){
        const docRef = this.doc(this.db, "menus", this.globalUser.menu);
        const docSnap = await this.getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            this.menu = docSnap.data()
            document.title = 'Menu | '+this.menu.nombre
            this.descargarLogo(this.menu.logoURL)
            //console.log('url del logo: ', this.logo)
            this.website = this.menu.website
            //console.log('Website: ',this.website)
            if(!this.menu.listas){
                this.menu.listas =  0
                console.log('la propiedad lista no existe')
            }

            //notificar de ordenes listas
            if (this.unsub === null) {
                this.unsub = await this.onSnapshot(docRef, (menu) => {
                    if(menu.data().listas && this.menu.listas != menu.data().listas){
                        this.menu.listas = menu.data().listas
                        const audio = new Audio('../../src/assets/bell-one.mp3')
                        audio.play()
                    }
                })
            }

        }
    }

}
</script>

<style scoped>

.menu-screen{
    box-sizing: border-box;
    padding-top: 100px;
}
h1{
    text-align: center;
}

@media (prefers-color-scheme: dark){

    a{
        color: lightblue;
    }
}
</style>