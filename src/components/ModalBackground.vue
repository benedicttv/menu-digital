<template>
  <div @click.self="ocultarMenu" class="master-container modal-background">
    <slot/>
  </div>
</template>

<script>

export default {
    name: 'ModalBackground',
    emits: ['render'],
    methods: {
        ocultarMenu(){
            console.log('ocultarMenu')
            setTimeout(()=>{
                this.$emit('render', false)
            }, 200)
        },//ocultar Menu
    },//methods
}
</script>

<style scoped>

.master-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.modal-background{
  background-color: #00000060;
  z-index: 1000;
  backdrop-filter: blur(2px);
  display: grid;
  display: grid;
  align-items: baseline;
  overflow: scroll;
  min-height: 100vh;
  padding-bottom: 100px;
  box-sizing: border-box;
}

</style>