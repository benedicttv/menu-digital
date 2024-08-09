<template>
  <div>
    <form @submit="agregarOrden">
        <span class="fs-6">{{plato.nombre}}</span>
        <div class="mt-3">
            <div class="cant-container mb-3">
                <label class="col-form-label fs-5 fw-bold" for="cantidad">Cant.:</label>
                <button @click.prevent="restar" class="btn btn-secondary" :disabled="cantidad < 2">-</button>
                <input class="form-control" type="number" inputmode="numeric" min="1" step="1" v-model="cantidad" required>
                <button @click.prevent="sumar" class="btn btn-secondary">+</button>
            </div>

            <div class="mb-3" v-if="plato.opcionesPlato && plato.opcionesPlato.name != ''">
                <span>{{plato.opcionesPlato.name}}:</span>

                <div class="form-check mb-1" v-for="(option, clave) in Object.keys(plato.opcionesPlato).filter(clave => clave !== 'name')" :key="clave">
                        <input class="form-check-input"  type="radio" name="alternativa" v-model="alternativa" :id="clave" :value="option" required>
                        <label class="form-check-label" :for="clave">{{plato.opcionesPlato[option].name}}</label>
                </div>

            </div>
            <div>
                <button type="submit" class="btn btn-primary fw-bold">Agregar</button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
export default {
    name: 'AgregarOrdenForm',
    emtis: ['agregar_esto'],
    props:{
        plato:{type: Object}
    },
    data(){
        return{
            cantidad: 1,
            alternativa: null,
        }
    },
    methods:{
        agregarOrden(e){
            e.preventDefault()
            let item = {
                cantidad: this.cantidad, 
                alternativa: this.alternativa
            }
            console.log('agregando a la orden', item)
            this.$emit('agregar_esto', item)
        },
        restar(){
            this.cantidad--
        },
        sumar(){
            this.cantidad++
        }
    },
    computed:{
        alternativasPlato(){
            if(this.plato && this.plato.opcionesPlato){
                
            }
        }
    }

}
</script>

<style scoped>
.cant-container{
    display: grid;
    grid-template-columns: auto auto 50px auto auto;
    column-gap: 10px;
    align-items: center;
    width: 100%;
}
label, input{
    font-family: var(--font-3);
}
button{
    font-family: var(--font-6);
}
span{
    font-family: var(--font-3);
}

</style>