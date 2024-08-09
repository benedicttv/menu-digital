<template>
    <div class="menu-container">
        <h1 class="fw-bold text-center menu-title">Menú <br>
            <span v-if="platos_screen" class="fs-4">{{ categoria_activa }}</span>
        </h1>
        <div v-if="loading" class="mb-3 row">
            <LoadingIcon/>
        </div>
        <div v-if="categorias_screen" class="cat-buttons-container">
            <CategoriaButtonPublic v-for="categoria in categorias" :key="categoria.id" :nombre="categoria.nombre" :id="categoria.id" :img="categoria.img" @ver_platos="mostraPlatos"/>
        </div>
        <div v-if="platos_screen">
            <div class="header-plato">
                <button @click="volverCategorias" class="btn btn-primary btn-sm mt-2 mb-2"> <i class="bi bi-arrow-left-short"></i> Categorias</button>
            </div>
            <div v-if="!loadin_platos" class="platos-container mb-5">
                <PlatoPublicButton v-for="plato in platos" :key="plato.id" :data="plato" @nuevoPedido="item_agregado"/>
            </div>
        </div>

    </div>
</template>

<script>

import CategoriaButtonPublic from './CategoriaButtonPublic.vue'
import PlatoPublicButton from './PlatoPublicButton.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import GoBackIcon from './icons/GoBackIcon.vue'
export default {
    name: 'CategoriaPublic',
    emits:['item_agregado'],
    components:{
        CategoriaButtonPublic,
        LoadingIcon,
        PlatoPublicButton,
        GoBackIcon
    },
    props:{
        menu_id: {
            type: String,
            required: true,
        }
    },
    data(){
        return{
            categorias: [],
            unsub: null,
            categorias_screen: true,
            platos_screen: false,
            loading: true,
            platos: [],
            unsubPlato: null,
            categoria_activa: null,
            loadin_platos: false,
        }
    },
    methods:{
        item_agregado(){
            this.$emit('item_agregado')
            console.log('emit recibido!')
        },
        volverCategorias(){
            this.platos_screen = false,
            this.categorias_screen = true
            document.body.scrollTop = 0; // Para Safari
            document.documentElement.scrollTop = 0; // Para otros navegadores
        },
        async descargar_menu() {
            this.loading = true
            let loadingComplete = false

            const menuQ = this.query(this.collection(this.db, 'categorias'), this.where('menu', '==', this.menu_id))
            this.unsub = await this.onSnapshot(menuQ, (menuSnapshot)=>{
                const categorias= []
                this.categorias = [];
                    menuSnapshot.forEach((doc) => {
                        categorias.push(doc.data());
                        console.log(doc.data())
                    });
                    this.categorias = categorias.sort((a,b)=> a.posicion - b.posicion)
                    loadingComplete = true
            })
            const checkLoading = setInterval(()=>{
                if(loadingComplete){
                    this.loading = false
                    clearInterval(checkLoading)
                }
            }, 100)
       },
       async mostraPlatos(resp){
            this.loading = true
            let loadingComplete = false
            this.loadin_platos = true

            const platoQuery = this.query(this.collection(this.db, 'platos'), this.where('categoria', '==', resp.id))

            this.unsubPlato = await this.onSnapshot(platoQuery, (platos)=>{
                this.platos = []
                platos.forEach((plato)=>{
                    this.platos.push(plato.data())
                    console.log(plato.data())
                })
                loadingComplete = true,
                this.loadin_platos = false
            })

            const checkLoading = setInterval(()=>{
                if(loadingComplete){
                    this.loading = false
                    clearInterval(checkLoading)
                }
            }, 100)
            console.log('mostrando platos de: ', resp.id)
            this.categoria_activa = resp.nombre
            this.categorias_screen = false
            this.platos_screen = true
       }

    },
    created(){
        console.log('buscando categorias: ', this.menu_id)
        this.descargar_menu()
    },
    beforeUnmount() {
        if (this.unsub) {
            this.unsub();
        }
        if(this.unsubPlato){
            this.unsubPlato()
        }
    }
}
</script>

<style scoped>

.menu-container{
    padding-top: 110px;
    font-family: var(--font-h);
}
.cat-buttons-container{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;

}
span{
    font-family: "monarcha", serif;
}

.header-plato{
    height: 50px;
    box-sizing: border-box;
    padding: 5px 10px;
    position: sticky;
    top:88px;
    background-color: white;
    color: #006fcf;
    text-decoration: underline;
}
.header-plato button{
    text-align: center;
    border: none;
    font-family: var(--font-6);
}

/* platos */
.platos-container{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 450px));
    gap: 10px;
}

@media (prefers-color-scheme: dark){
    .header-plato{
        background-color: #252525;
    }
    .header-plato svg{
        fill: whitesmoke;
    }
}

</style>