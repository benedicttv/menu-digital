<template>
  <div class="icon-container">
    <ListMenu class="icon-one"/>
    <span>Crear Menú</span>
  </div>
</template>

<script>
import ListMenu from './icons/ListMenu.vue'

export default {
    name: 'CreateMenuButton',
    components:{
        ListMenu,
    },
}
</script>

<style>

</style>