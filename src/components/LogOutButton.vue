<template>
  <div @click="cerrarSesion" class="icon-container">
    <LogOutIcon class="icon-one"/>
    <span>Cerrar sesión</span>
  </div>
</template>

<script>
import LogOutIcon from './icons/LogOutIcon.vue'

export default {
    name: 'LogOutButton',
    emits: ['cerrar'],
    components: {
        LogOutIcon,
    },
    methods:{
        cerrarSesion(){
            this.signOut(this.auth).then(()=>{
                console.log('la sesion se ha cerrado')
                this.$emit('cerrar',true)
            }).catch((error) => {
            // An error happened.
            });
        }
    }
}
</script>

<style>

</style>