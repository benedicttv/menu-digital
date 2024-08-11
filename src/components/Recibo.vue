<template>
<div class="accordion-item">
    <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapse'+recibo_id" aria-expanded="false" :aria-controls="'flush-collapse'+recibo_id">
            Orden #{{recibo.numOrden}} <i v-if="recibo.estado==='completa'" class="bi bi-check2 completa"></i><!-- 
                ({{ procesar_fecha }}) -->
                <i v-if="recibo.estado==='cancelada'" class="bi bi-x-lg cancelada"></i>
        </button>
    </h2>
    <div :id="'flush-collapse'+recibo_id" class="accordion-collapse collapse" data-bs-parent="#ordenes_cuenta">
        <div class="accordion-body">
            <div class="recibo-layout">
                <span><b>Descripción</b></span>
                <span><b>Und.</b></span>
                <span><b>Total</b></span>
            </div>
            <div class="recibo-layout" v-for="item in recibo.items" :key="item.plato.id">
                
                <span v-if="item.alternativa">{{ item.cantidad}} x {{ item.plato.nombre }} - {{ item.plato.opcionesPlato[item.alternativa].name }}</span>
                <span v-else>{{ item.cantidad}} x {{ item.plato.nombre }}</span>
                <span v-if="item.alternativa">{{ item.plato.precio + item.plato.opcionesPlato[item.alternativa].precio}}</span>
                <span v-else>{{ item.plato.precio}}</span>
                <span v-if="item.alternativa">{{ (item.plato.precio+item.plato.opcionesPlato[item.alternativa].precio) * item.cantidad}}</span>
                <span v-else>{{ item.plato.precio * item.cantidad}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Recibo',
    props:{
        recibo:{
            type: Object
        },
        recibo_id:{
            type: String
        }
    },
    computed:{
        procesar_fecha(){
            const fechaISO = this.recibo.hora;
            const fecha = new Date(fechaISO);
            
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
            let horas = fecha.getHours();
            const minutos = fecha.getMinutes();

            const periodo = horas >= 12 ? 'pm' : 'am';
            horas = horas % 12 || 12;

            //const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}${periodo}`;
            const fechaFormateada = `${horas}:${minutos}${periodo}`;
            
            return fechaFormateada

        }
    },//computed
    created(){
        console.log(this.recibo)
    }
}
</script>

<style scoped>
.recibo-layout{
    display: grid;
    grid-template-columns: 1fr 75px 50px;
}
.completa{
    color: green;
}
.cancelada{
    color: red;
}

</style>