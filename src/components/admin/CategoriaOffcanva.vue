<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" :id="'offcanvasRight_edit'+id" :aria-labelledby="'offcanvasRightLabel_edit'+id">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" :id="'offcanvasRightLabel_edit'+id">Editar categoría: {{nombre}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrar_form"></button>
    </div>
    <div class="offcanvas-body">
        <FormEditartCategoria @cerrar="cerrar_offcanva" :prop_id="id" :prop_nombre="nombre" :prop_img="img"/>
    </div>
</div>
</template>

<script>
import FormEditartCategoria from '../FormEditartCategoria.vue'
export default {
    props:{
        nombre: {
            type: String,
            required: true
        },
        id:{
            type: String,
            required: true
        },
        img:{
            type: String
        }
    },
    components:{
        FormEditartCategoria
    },
    name: 'CategoriaOffcanva',
    methods:{
        cerrar_offcanva(){
            console.log('cerrando offcanva')
            this.$refs.cerrar_form.click()
        }
    }

}
</script>

<style>

</style>