<template>
    <div class="admin-buttons">
        <AddIcon class="icon-two"/>
        <span>Nuevo Plato</span>
    </div>
</template>

<script>
import AddIcon from './icons/AddIcon.vue'
export default {
    inject: ['globalUser'],
    components:{
        AddIcon,
    },
    name: 'AddPlatoBt'
}
</script>

<style>

</style>