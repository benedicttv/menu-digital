<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="notificaciones" aria-labelledby="notificacionesLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="notificacionesLabel">Notificaciones</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <span v-if="notifications.length == 0">No nuevas notificaciones</span>
      <div class="mb-3" v-for="orden in orderedNotificaciones" :key="orden.id">
        <div class="order-list">
          <span class="fw-bold">Nueva Orden</span> <span><i class="bi bi-clock"></i>
        {{ Math.floor((hora_actual - new Date(orden.hora)) / 60000) < 2 ? 'Reciente' : Math.floor((hora_actual - new Date(orden.hora)) / 60000) + ' min' }}</span>
        </div>
        <span>Orden #{{orden.numOrden}} | Mesa: {{orden.mesa}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notificaciones',
  inject: ['globalUser'],
  emits: ['ordersLength'],
  data() {
    return {
      hora_actual: null,
      intervalId: null,
      unsubscribe: null,
      notifications: [],
      vistas: 0,
      bellOne: new Audio('../../src/assets/bell-two.mp3')
    }
  },
  computed: {
    orderedNotificaciones() {
      // Ordenar las notificaciones por la hora de la orden
      return this.notifications.sort((a, b) => new Date(a.hora) - new Date(b.hora));
    }
  },
  methods: {
    checkTheTime() {
      this.intervalId = setInterval(() => {
        this.hora_actual = Date.now()
      }, 60000);
    },//checkTheTime
    getOrder(){
      try {
        console.log('Menu:', this.globalUser.menu)
        const ordersQuery = this.query(this.collection(this.db, 'ordenes'), this.where('menu', '==', this.globalUser.menu), this.where('estado', '==', 'nueva'))
        this.unsubscribe = this.onSnapshot(ordersQuery, (orders)=>{
          this.notifications = []
          this.vistas =  0
          orders.forEach(order => {
            this.notifications.push(order.data())
            if(order.data().vista==false){
              this.vistas++
            }
          });
          if(this.vistas > 0){
            this.bellOne.play()
          }
          this.$emit('ordersLength', this.vistas)
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  created() {
    this.hora_actual = Date.now()
    this.checkTheTime()
    this.getOrder()

  },
  beforeUnmount() {
    clearInterval(this.intervalId)
    this.unsubscribe()
  }
}
</script>

<style scoped>
.order-list{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 5px;
}
</style>
