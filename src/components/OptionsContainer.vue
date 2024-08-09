<template>
  <div class="fw-center-center">
    <div class="contenedor-bt-lista">

      <button @click="abrirFormNuevoMenu" v-if="!user.menu" class="bt-lista">
        <div class="icon-bt">
          <ListMenu/>
        </div>
        <span class="text-icon">Crear Menú</span>
      </button><!-- bt-lista -->

      <button @click="abrir_menu" v-if="user.menu" class="bt-lista">
        <div class="icon-bt">
          <i class="bi bi-journal-richtext"></i>
        </div>
        <span class="text-icon">Mi Menú</span>
      </button><!-- bt-lista -->

      <button @click="cerrarSesion" class="bt-lista">
        <div class="icon-bt">
          <i class="bi bi-person-fill-slash"></i>
        </div>
        <span class="text-icon">Cerrar Sesión</span>
      </button><!-- bt-lista -->

      <a href="https://wa.me/+4792486558" class="bt-lista bt-lista-fw" target="_blank" style="text-decoration: none;">
        <div class="icon-bt">
          <i class="bi bi-whatsapp"></i>
        </div>
        <span class="text-icon">Servicio al cliente  <i class="bi bi-box-arrow-up-right"></i></span>
      </a><!-- bt-lista -->

    </div>
  </div>
</template>

<script>
import ListMenu from './icons/ListMenu.vue'
export default {
    name: 'OptionsContainer',
    emits:['abrir_menu', 'cerrar_sesion', 'abrir_form_nuevo_menu'],
    components:{
      ListMenu
    },
    props: {
      user:{
        type: Object,
        required: true
      }
    },
    methods:{
      abrir_menu(){
        this.$emit('abrir_menu')
      },//abrir_menu
        abrirFormNuevoMenu(){
            console.log('Abriendo el formulario de nuevo menu')
            this.$emit('abrir_form_nuevo_menu')

        },//crearNuevoMenu
        cerrarSesion(){
            this.signOut(this.auth).then(()=>{
                console.log('la sesion se ha cerrado')
                this.$emit('cerrar_sesion')
            }).catch((error) => {
            // An error happened.
            });
        }
    }

}
</script>

<style>


</style>