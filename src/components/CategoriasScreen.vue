<template>
  <div class="categorias-container">
    <div class="mt-3">
        <h1 class="fs-4 fw-bold" style="font-family: var(--font-3);">Categorías</h1>
    </div>
    <div v-if="descargando" class="d-flex justify-content-center mt-3 mb-3">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="no-categorias" v-if="hay_categorias">
        <p>No hay categorías</p>
    </div>
    <p>{{ error }}</p>
    <div v-if="!form">
        <div v-if="!descargando" class="cat-buttons-container">
            <CatButton v-for="categoria in categorias" :key="categoria.id" :id="categoria.id" :nombre="categoria.nombre" :img="categoria.img" @mostrar_platos="platos_screen" @cerrar_categorias="open_form_nuevo" :posicion="categoria.posicion" :size="categorias.length" @cambiarPosicion="changePosition"/>
        </div>
    </div>
    <FormNuevoPlato v-if="formPlato" @cerrar="ocultar_form_plato" :name_cat="cat_activa_nom" :cat_id="cat_activa_id"/>
  </div>
</template>

<script>
import CatButton from './CatButton.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import FormEditarCategoria from './FormEditartCategoria.vue'
import FormNuevoPlato from './FormNuevoPlato.vue'

export default {
    inject: ['globalUser'],
    name: 'CategoriasScreen',
    emits: ['platos_screen'],
    components: {
        CatButton,
        LoadingIcon,
        FormEditarCategoria,
        FormNuevoPlato,
    },
    data(){
        return{
            categorias: [],
            descargando: true,
            form: false,
            cat_activa_id: null,
            cat_activa_nom: null,
            formPlato: false,
            hay_categorias: null,
            unsub: null,
            error: ''
        }
    },
    methods:{
        async changePosition(resp){
            this.unsub()
            this.unsub = null
            console.log(resp)
            if(resp.oldPosition < 0 || resp.oldPosition >= this.categorias.length || resp.newPosition < 0 || resp.newPosition >= this.categorias.length){
                console.log('fuera de rango')
                return
            }
            const moverCategoria = this.categorias.splice(resp.oldPosition, 1)[0]
            this.categorias.splice(resp.newPosition, 0, moverCategoria)
            for(let n=0; n < this.categorias.length; n++){
                this.categorias[n].posicion = n
                console.log(this.categorias[n])
                await this.updateDoc(this.doc(this.db, 'categorias', this.categorias[n].id), {
                    posicion: n
                })
            }
            this.downloadCategorias()
        },
        open_form_nuevo(resp){
            this.cat_activa_id = resp.id
            this.cat_activa_nom = resp.nombre
            this.from = true;
            this.formPlato = true
        },
        ocultar_form_plato(){
            this.cat_activa_id = null
            this.cat_activa_nom = null
            this.from = false;
            this.formPlato = false
        },
        async downloadCategorias() {
            this.descargando = true
            try {
                const categoriaRef = this.collection(this.db, 'categorias');
                const categoriaQuery = this.query(categoriaRef, this.where('menu', '==', this.globalUser.menu));
                //const categoriaSnapshot = await this.getDocs(categoriaQuery);

                this.unsub = await this.onSnapshot(categoriaQuery, snapshot => {
                    const categorias= []
                    this.categorias = [];
                    snapshot.forEach(categoria => {
                        console.log(categoria.data());
                        categorias.push(categoria.data());
                    });
                    this.categorias = categorias.sort((a,b)=> a.posicion - b.posicion)
                    this.descargando = false
                });
            } catch (error) {
                console.log('Error: ', error);
                this.descargando = false
                this.error = 'Ocurrió un error al intentar descargar las categorías. Intenta reiniciar la página. Si continuas teniendo problemas comunicate con el administrador.'
            }

        },
        platos_screen(resp){
            console.log('abriendo platos')
            this.$emit('platos_screen', resp)
        }
    },
    created(){
        this.downloadCategorias()
    },
    beforeUnmount(){
        this.unsub()
    }

}
</script>

<style scoped>
.categorias-container{
    box-sizing: border-box;
    box-sizing: border-box;
    color: black;
    font-size: 14pt;
}
h1{
    text-align: center;
    font-size: 22pt;
    margin-bottom: 20px;
}

.cat-buttons-container{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;

}
.btn-grid{
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
}

.no-categorias{
    background-color: gold;
    color: #000000;
    text-align: center;
}

</style>