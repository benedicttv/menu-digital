<template>
  <div>
    <button type="button" class="bt-offcanva-container" @click="descargarImagen">
        <QrcodeIcon class="bt-offcanva"/>
        <span>Descargar QR</span>
    </button>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import QrcodeIcon from './icons/QRcodeIcon.vue'

export default {
  name: 'DescargarQR',
  inject: ['website'],
  components:{
    QrcodeIcon
  },
  data(){
    return{
        QrcodeImage: null
    }
  },
  methods: {
    async generarQR(codigoWebsite) {
      console.log('Este es el valor de web:', codigoWebsite);
      try {
        const canvas = document.createElement('canvas')
        this.QrcodeImage = canvas
        await QRCode.toCanvas(this.QrcodeImage, `https://menu-rd.web.app/?menu=${codigoWebsite}`)
        console.log('QR generado exitosamente')
      } catch (error) {
        console.error('Error al generar QR:', error)
      }
    },

    descargarImagen() {
      const canvas = this.QrcodeImage
      const url = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.href = url
      link.download = 'QRCode.png'
      link.click()
    }
  },

  async mounted() {
    console.log(this.website)
    await this.generarQR(this.website)
  }
}
</script>

<style scoped>

</style>