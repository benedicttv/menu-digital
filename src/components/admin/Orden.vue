<template>
  <div class="orden-container">
    <div class="orden-header mb-2">
        <span>Orden #{{data.numOrden}} - Mesa: {{data.mesa}}</span>
        <span v-if="data.estado == 'nueva'">
            <i class="bi bi-clock"></i>
                {{ Math.floor((hora_actual - new Date(data.hora)) / 60000) < 2 ? 'Nueva' : Math.floor((hora_actual - new Date(data.hora)) / 60000) + ' min' }}
        </span>
    </div>

    <div class="order-options mb-2 g-2 row">
        <div v-if="data.estado == 'nueva'" class="col">
            <button @click="completarOrden" type="button" class="btn btn-primary btn-sm">
            Lista
            </button>
        </div>

        <div v-if="data.estado =='completa' || data.estado=='nueva'" @click="cancelarOrden" class="col">
            <button type="button" class="btn btn-secondary btn-sm">
            Eliminar
            </button>
        </div>
    </div>

    <div v-for="item in data.items" :key="item.id" class="order-items">
        <span>{{ item.cantidad}} x {{item.plato.nombre}}</span>
        <span v-if="item.alternativa"> — {{ item.plato.opcionesPlato[item.alternativa].name }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Orden',
    inject:['globalUser'],
    props:{
        data: {type: Object, required: true}
    },
    data() {
        return {
        hora_actual: null,
        intervalId: null
        }
    },
    methods: {
        checkTheTime() {
        this.intervalId = setInterval(() => {
            this.hora_actual = Date.now()
        }, 60000);
        },
        async completarOrden(){
            const ordenRef = this.doc(this.db, 'ordenes', this.data.id)
            await this.updateDoc(ordenRef, {
                estado: 'completa'
            })

            const menuRef = this.doc(this.db, 'menus', this.globalUser.menu)
            await this.updateDoc(menuRef, {
                listas: this.increment(1)
            })
        },
        async cancelarOrden(){
            const ordenRef = this.doc(this.db, 'ordenes', this.data.id)
            await this.updateDoc(ordenRef, {
                estado: 'cancelada'
            })
        }
    },
    created() {
        this.hora_actual = Date.now()
        this.checkTheTime()
    },
    beforeUnmount() {
        clearInterval(this.intervalId)
    }

}
</script>

<style scoped>
.orden-container{
    background-color: whitesmoke;
    padding: 10px;
}

.orden-header{
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid gainsboro;
}

@media(prefers-color-scheme: dark){
    span{
        color: #343434;
    }
}

</style>