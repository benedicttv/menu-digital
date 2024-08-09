<template>
  <div>
    <div class="d-flex justify-content-center mt-3" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="row p-2">
      <div class="form-check col">
        <input class="form-check-input" type="radio" id="pendientes" value="nueva" v-model="orderStatus">
        <label class="form-check-label" for="pendientes">
          Pendientes
        </label>
      </div>
      <div class="form-check col">
        <input class="form-check-input" type="radio" id="listas" value="completa" v-model="orderStatus">
        <label class="form-check-label" for="listas">
          Listas
        </label>
      </div><!-- 
      <div class="form-check col">
        <input class="form-check-input" type="radio" id="canceladas" value="cancelada" v-model="orderStatus">
        <label class="form-check-label" for="canceladas">
          Canceladas
        </label>
      </div> -->
      <div class="form-check col">
        <input class="form-check-input" type="radio" id="todas" value="todas" v-model="orderStatus">
        <label class="form-check-label" for="todas">
          Todas
        </label>
      </div>
    </div>
    <span class="mb-3" v-if="ordenesLength < 1">No hay ordenes pendientes</span>
    <div v-else class="ordenes-board mt-3">
      <Orden v-for="orden in ordenarOrdenes" :key="orden.id" :data="orden"/>
    </div>

    <!-- mensajes -->
  </div>
</template>

<script>
import Orden from './Orden.vue'

export default {
    name: 'Ordenes', // Ordenes screen
    inject: ['globalUser'],
    emits: ['totalpendiente'],
    components: {
      Orden
    },
    data() {
      return {
        loading: true,
        unsub: null,
        ordenes: {},
        ordenesLength: 0,
        orderStatus: 'nueva'
      }
    },
    computed:{
      ordenarOrdenes() {
        // Ordenar las notificaciones por la hora de la orden
        if(this.orderStatus != 'todas'){
          this.ordenesLength = Object.keys(this.ordenes).length
          return Object.values(this.ordenes)
          .filter(orden => orden.estado === this.orderStatus)
          .sort((a, b) => new Date(a.hora) - new Date(b.hora));
        }else{
          return Object.values(this.ordenes)
          .sort((b, a) => new Date(a.hora) - new Date(b.hora));
        }
      },
    },
    methods: {
      async getOrders() {
        try {
          const ordenesQuery = this.query(this.collection(this.db, 'ordenes'), this.where('menu', '==', this.globalUser.menu))
          //console.log('Menú id: ', this.globalUser.menu)

          if (this.unsub === null) {
            this.unsub = await this.onSnapshot(ordenesQuery, (ordenes) => {
              this.ordenes = {}
              ordenes.forEach((orden) => {
                this.ordenes[orden.data().id] = orden.data()
              });
              this.loading = false // Desactivar la carga después de recibir los datos
              this.ordenesLength = Object.keys(this.ordenes).length
              this.$emit('totalpendiente', this.ordenesLength)
            })
          }
        } catch (error) {
          this.loading = false
          console.log('Error: ', error)
        }
      }
    },
    created() {
      this.getOrders()
    }
}
</script>

<style scoped>
.ordenes-board{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}

</style>
