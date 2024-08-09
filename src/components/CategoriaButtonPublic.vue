<template>
<!-- <div @click="verCategoria" class="bt-categoria-home shadow-sm bg-body-tertiary" :style="'background-image:url('+img+')'">
<p class="fw-bold fs-4">{{nombre}}</p>

</div> -->
<div  @click="verCategoria">
    <div class="bt-categoria-home" :style="'background-image:url('+img+')'"></div>
    <p class="text-uppercase fs-6 fw-bold">{{ nombre }}</p>
</div>
</template>

<script>
export default {
    name: 'CategoriaButtonPublic',
    emits:['ver_platos'],
    props:{
        nombre: {type: String, requiered: true},
        id: {type: String, requiered: true},
        img: {type: String, requiered: true},
    },
    methods:{
        verCategoria(){
            console.log('Abriendo categoria',this.id)
            this.$emit('ver_platos', {id: this.id, nombre:this.nombre})
        }
    },
}
</script>

<style scoped>
.bt-categoria-home{
    height: 200px;
    background-color: gainsboro;
    border-radius: 10px;
    overflow: hidden;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
p{
    width: 100%;
    color: #343434;
    box-sizing: border-box;
    padding: 10px;
    font-family: var(--font-8);
}
@media(prefers-color-scheme: dark){
    p{
        color: whitesmoke;
    }
}

</style>