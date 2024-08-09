<template>
  <div>
    <div class="offcanvas offcanvas-bottom offcanvas-border" tabindex="-1" :id="'offcanvasBottom_platoId_'+plato.id" :aria-labelledby="'offcanvasBottomLabel_platoId_'+plato.id">
      <div class="offcanvas-header">
        <h5 style="font-family: var(--font-6)" class="offcanvas-title" :id="'offcanvasBottomLabel_platoId_'+plato.id">{{plato.nombre}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrarOffcanvas"></button>
      </div>
      <div class="offcanvas-body small">
        <div class="options-container" style="max-width: 500px; margin: auto">
          <button class="bt-offcanva-container" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight_editPlato'+plato.id" :aria-controls="'offcanvasRight_editPlato'+plato.id">
            <EditIcon class="bt-offcanva"/>
            <span class="text-icon">Editar</span>
          </button>
          <button @click="ocultarPlato" v-if="!plato.visible" class="bt-offcanva-container" type="button">
            <SeeIcon class="bt-offcanva"/>
            <span class="text-icon">Mostrar</span>
          </button>
          <button @click="ocultarPlato" v-if="plato.visible" class="bt-offcanva-container" type="button" >
            <DontSeeIcon class="bt-offcanva"/>
            <span class="text-icon">Ocultar</span>
          </button>
          <button type="button" class="bt-offcanva-container" data-bs-toggle="modal" :data-bs-target="'#eliminarPlato'+plato.id">
            <DeleteIcon class="bt-offcanva" style="color:red;"/>
            <span class="text-icon">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  
    <!-- advertencia eliminar plato -->
    <div class="modal fade" :id="'eliminarPlato'+plato.id" tabindex="-1" :aria-labelledby="'eliminarPlatoLabel_'+plato.id" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" :id="'eliminarPlatoLabel_'+plato.id">Eliminar item</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <div>
              <h5 class="text-advertencia"> ¿Seguro que deseas eliminar {{plato.nombre}}?</h5>
              <p class="text-advertencia">Después de eliminado no podrás deshacerlo</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button @click="eliminarPlato" type="button" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditIcon from '../icons/EditIcon.vue'
import DeleteIcon from '../icons/DeleteIcon.vue'
import SeeIcon from '../icons/SeeIcon.vue'
import DontSeeIcon from '../icons/DontSeeIcon.vue'
export default {
  name: 'OpcionesPlato',
  emits: ['ocultar_mostrar_plato', 'eliminarPlato'],
  components:{
    EditIcon,
    DeleteIcon,
    SeeIcon,
    DontSeeIcon
  },
  props:{
    plato:{
      type: Object,
      required: true
    }
  },
  methods:{
    ocultarPlato(){
      this.$emit('ocultar_mostrar_plato')
      this.$refs.cerrarOffcanvas.click()
    },
    eliminarPlato(){
      this.$refs.cerrarModal.click()
      this.$emit('eliminarPlato')
    }
  }
}
</script>

<style scoped>
.text-advertencia{
  color: #151515;
}
</style>
