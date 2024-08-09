<template>
    <div>
        <div>
            <div  @click.self="abrirPlatos" class="degradado bt-categoria-home" :style="{backgroundImage: `url('${img}')`}">
                <div class="mini-icon" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvas_'+id" :aria-controls="'offcanvas_'+id" ref="bt_menu">
                    <ThreeDots/>
                </div>
            </div>
            <p class="fs-6">{{ nombre }}</p>
        </div>

        <!-- opciones categorias -->
        <div class="offcanvas offcanvas-bottom offcanvas-border" tabindex="-1" :id="'offcanvas_'+id" :aria-labelledby="'offcanvas_'+id+'_Label'">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" :id="'offcanvas_'+id+'_Label'">{{nombre}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="options-container">
                    <button class="bt-offcanva-container" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight_edit'+id" :aria-controls="'offcanvasRight_edit'+id">
                        <EditIcon class="bt-offcanva"/>
                        <span class="text-icon">Editar</span>
                    </button>
                    <button class="bt-offcanva-container" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight_nuevoPlato'+id" :aria-controls="'offcanvasRight_nuevoPlato'+id">
                        <AddIcon class="bt-offcanva"/>
                        <span class="text-icon">Agregar Plato</span>
                    </button>
                    <button @click="eliminar" type="button" class="bt-offcanva-container" data-bs-toggle="modal" :data-bs-target="'#modal_eliminar_categoria'+id">
                        <DeleteIcon class="bt-offcanva"/>
                        <span class="text-icon">Eliminar</span>
                    </button>
                </div>
                <div>
                    
                    <div class="input-group mt-3 mb-3">
                        <span class="input-group-text" id="basic-addon1">Posición: </span>
                        <select @change="cambiar" class="form-select" aria-label="Default select example" v-model="selectedPosition">
                            <option v-for="n in size" :key="n" :value="n - 1" :selected="n - 1 === posicion">{{ n }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div><!-- offcanvas -->

        <CategoriaOffcanva :id="id" :nombre="nombre" :img="img"/>

        <!-- modal eliminar -->
        <DeleteCategoriaModal :id="id" :nombre="nombre" :img="img"/>
        
        <!-- agregar nuevo plato -->
        <FormNuevoPlato :cat_id="id" :name_cat="nombre" @abrir_plato_screen="abrirPlatos"/>

    </div>
</template>

<script>
import CategoriaOffcanva from './admin/CategoriaOffcanva.vue'
import DeleteCategoriaModal from './admin/DeleteCategoriaModal.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import AddIcon from './icons/AddIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'
import ThreeDots from './icons/ThreeDots.vue'
import EditIcon from './icons/EditIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import MenuPrincipal from './MenuPrincipal.vue'
import FormNuevoPlato from './FormNuevoPlato.vue'
export default {
    inject: ['globalUser'],
    name: "CatButton",
    emits: ['mostrar_platos', 'cerrar_categorias', 'cambiarPosicion'],
    components:{
        FormNuevoPlato,
        DeleteCategoriaModal,
        CategoriaOffcanva,
        LoadingIcon,
        MenuPrincipal,
        AddIcon,
        EditIcon,
        MenuIcon,
        ThreeDots,
        DeleteIcon
    },
    props:{
        img:{
            type: String,
            required: true
        },
        nombre:{
            type: String,
            required: true
        },
        id:{
            type: String,
            required: true
        },
        posicion:{
            type: Number,
            required: true
        },
        size:{
            type: Number,
            required: true
        }
    },
    data(){
        return{
            loading: false,
            options: false,
            editar_categoria: false,
            formPlato: false,
            the_id: this.id,
            selectedPosition: this.posicion
        }
    },
    methods:{
        cambiar(){
            console.log('cambiando')
            this.$emit('cambiarPosicion', {oldPosition: this.posicion, newPosition: this.selectedPosition})
        },
        eliminar(){
            this.$refs.bt_menu.click()
        },
        abrirPlatos(){
            console.log('abriendo platos:', this.nombre)
            this.$emit('mostrar_platos', {id: this.the_id, nombre: this.nombre})

        },
        ocultar_form_plato(){
            this.formPlato = false
        },
        openFormPlato(){
            console.log('abriendo form nuevo plato')
            this.options = false
            this.formPlato = true
            //cerrar la pantalla de las categorias
            this.$emit('cerrar_categorias', {nombre: this.nombre, id: this.the_id})
        },
        ocultarOpciones(){
            console.log('ocultando')
            setTimeout(() => {
                this.options = false
            }, 200);
        },
        mostrarOpciones(){
            console.log('mostrando opciones de la categoria: ', this.nombre)
            /* this.options = true */
        },
        open_form_editar(){
            console.log('Abriendo form editar')
            this.$emit('form_edit_cat')
        },
        cerrar_form_editar(){
            console.log('Cerrando..')
            this.editar_categoria = false
        },
    },//methods
}
</script>

<style scoped>
p{
    font-family: var(--font-6);
    text-align: center;
}

h3{
    font-family: var(--font-dos);
    font-size: 12pt;
    margin: auto;
    text-align: center;
}

.bt-categoria-home{
    height: 200px;
    text-align: center;
    box-sizing: border-box;
    align-items: start;
    justify-items: flex-end;
    display: grid;
    border-radius: 10px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    background-color: gainsboro;
    margin-top: 10px;
}

.mini-icon{
    background-color: #ffffff90;
    width: 50px;
    margin-top: 5px;
    margin-right: 5px;
    border-radius: 25px;
}

</style>