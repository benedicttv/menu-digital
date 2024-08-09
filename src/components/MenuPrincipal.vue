<template>
  <div @click.self="ocultar" class="master-container modal-background">
    <div class="menu-container" :class="{'menu-container-oculto': quitar}">
        <slot/>
    </div>
  </div>
</template>

<script>

export default {
    emmits: ['mostrar'],
    name: 'MenuPrincipal',
    props:{
        mover: {
            type: Boolean
        }
    },
    data(){
        return{
            quitar: false,
        }
    },
    methods: {
        ocultar(){
            this.quitar = true
            setTimeout(()=>{
                this.$emit('mostrar', false)
            },200)
        }
    }
}
</script>

<style scoped>
.master-container{
    padding: 0px !important;
}

</style>