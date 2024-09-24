<template>
  <div>
    <button @click="compartir" type="button" class="bt-offcanva-container">
        <ShareIcon class="bt-offcanva"/>
        <span>{{estado}}</span>
    </button>
  </div>
</template>

<script>
import ShareIcon from './icons/ShareIcon.vue'
export default {
    name: 'ShareUrl',
    inject: ['website', 'nombreNegocio'],
    components:{
        ShareIcon
    },
    data(){
        return{
            estado: 'Compartir'
        }
    },
    methods: {
        copiado(){
            this.estado = 'Enlace Copiado!'
            setTimeout(() => {
                this.estado = 'Compartir'
            }, 3000);
        },
        compartir() {
            const url = 'https://menu-rd.web.app/?menu='+this.website; 

            if (navigator.share) {
                navigator.share({
                /* title: 'Nuestro Menú',
                text: 'Menú | '+this.nombreNegocio, */
                url: url
                }).then(() => {
                console.log('Enlace compartido exitosamente');
                }).catch(error => {
                console.error('Error al compartir enlace:', error);
                });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                console.log('Enlace copiado al portapapeles');
                this.copiado()
                }).catch(error => {
                console.error('Error al copiar enlace al portapapeles:', error);
                });
            }
        }
    }

}
</script>

<style>
.bt-offcanva-container{
    width: 100%;
}

</style>