<template>
<div class="master-container">
    <slot/>
    
</div>  
</template>

<script>
export default {
    name: 'Screen'
}
</script>

<style>

.master-container{
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: whitesmoke;
  color: black;
  overflow: scroll;
}


</style>