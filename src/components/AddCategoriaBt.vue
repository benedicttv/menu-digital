<template>
    <div @click="openForm" class="admin-buttons">
        <AddIcon class="icon-two"/>
        <span>Nueva Categoría</span>
        
    </div>
</template>

<script>
import AddIcon from './icons/AddIcon.vue'

export default {
    inject: ['globalUser'],
    emits:['open_form_cat'],
    components:{
        AddIcon,
    },
    name: 'AddCategoriaBt',
    methods:{
        openForm(){
            console.log('Abrir formulario para', this.globalUser.menu)
            this.$emit('open_form_cat', true)
        }
    }
}
</script>

<style scoped>

</style>