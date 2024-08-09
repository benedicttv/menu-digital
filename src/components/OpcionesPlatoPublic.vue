<template>
<div class="offcanvas offcanvas-bottom offcanvas-border" tabindex="-1" :id="'offcanvasBottom_platoPublic'+plato.id" :aria-labelledby="'offcanvasBottomLabel_platoPublic'+plato.id">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" :id="'offcanvasBottomLabel_platoPublic'+plato.id">Agregar a mi orden + <i class="bi bi-basket2-fill"></i></h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrar_add_item"></button>
    </div>
    <div class="offcanvas-body small">
        <AgregarOrdenForm :plato="plato" @agregar_esto="agregarItem"/>
    </div>
</div>
</template>

<script>
import AgregarOrdenForm from './AgregarOrdenForm.vue'
export default {
    name: 'OpcionesPlatoPublic',
    emits: ['item_agregado'],
    components:{AgregarOrdenForm},
    props: {
        plato: {type: Object, required: true}
    },
    methods:{
        agregarItem(cant){
            let orden = localStorage.getItem("miOrden")
            let plato_existe = false
            const total =()=>{
                let precio = this.plato.precio
                if (this.plato.opcionesPlato && this.plato.opcionesPlato.name){
                    let precioAlternitiva = this.plato.opcionesPlato[cant.alternativa].precio
                    precio = this.plato.precio+precioAlternitiva
                }
                let resultado = precio*cant.cantidad
                return resultado
            }
            const getAlternativa =()=>{
                let alternativa = null
                if(this.plato.opcionesPlato && this.plato.opcionesPlato.name){
                    alternativa = cant.alternativa
                }
                return alternativa
            }

            const makeItemId =()=>{
                // crea un id para el item con el id del plato y el id de la alternativa
            }
            const item = {
                cantidad: cant.cantidad,
                alternativa: getAlternativa(),
                plato: this.plato,
                total: total()
            }
            let miOrden = JSON.parse(orden)
            console.log(miOrden)

            //verifica si el item ya ha sido agregado
            if(miOrden[item.plato.id]==undefined){
                miOrden[item.plato.id] = item
            }else{
                console.log(miOrden[item.plato.id])
                console.log(item)
                //verifica si es la misma alternativa
                if(miOrden[item.plato.id].alternativa == item.alternativa){
                    miOrden[item.plato.id].cantidad = miOrden[item.plato.id].cantidad+cant.cantidad
                }else{
                    miOrden[item.plato.id] = item
                }
            }
            orden = JSON.stringify(miOrden)
            localStorage.setItem('miOrden', orden)
            this.$emit('item_agregado')
            this.$refs.cerrar_add_item.click()
        }
    }
}
</script>

<style scoped>
h5{
    font-family: var(--font-1);
}

</style>