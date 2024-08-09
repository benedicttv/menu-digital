<template>
    <div>
        <form  @submit="editarCategoria">
            <div class="mb-3 row">
                <label class="form-label" for="nombre">Nombre de la categoría:</label>
                <input class="form-control" type="text" v-model="nombre" :placeholder="prop_nombre" name="nombre" :disabled="loading" pattern="[A-Za-z0-9ñáéíóúü\s]+" maxlength="100">
            </div>
            <div class="mb-3 row">
                <label class="form-label" for="img">Foto:</label>
                <input ref="imagen" class="form-control" type="file" name="img" @change="handleFileUpload" :disabled="loading" accept="image/png, image/jpeg, image/webp">
            </div>
            <div class="mb-3 row">
                <img class="fs-6" @click="cambiarImagen" :src="img_src" :alt="'Foto '+prop_nombre" width="100" height="100">
            </div>
            <div class="mb-3 row">
                <LoadingIcon v-if="loading"/>
            </div>
            <div class="mb-3 row">
                <span class="form-text">{{ errorMsg }}</span>
            </div>
            <div class="mb-3 row">
                <button type="submit" class="btn btn-primary" :disabled="loading">Guardar</button>
            </div>
        </form>
    </div>
</template>

<script>
import Screen from './Screen.vue'
import CloseIcon from './icons/CloseIcon.vue'
import LoadingIcon from './icons/LoadingIcon.vue'

export default {
    inject:['globalUser'],
    name: 'FormEditarCategoria',
    emits: ['cerrar'],
    components: {
        Screen,
        CloseIcon,
        LoadingIcon
    },
    props:{
        prop_nombre: {type: String, required: true},
        prop_id: {type: String, required: true},
        prop_img: {type: String, required: true}
    },
    data(){
        return{
            loading: false,
            nombre: this.prop_nombre,
            imgFile: this.prop_img,
            archivo: null,
            errorMsg: '',
            img_src: ''
        }
    },
    methods:{
        cerrarForm(){
            this.$emit('cerrar', true)
        },
        cambiarImagen(){
            this.$refs.imagen.click()
        },
        async editarCategoria(e){
            this.errorMsg = ''
            e.preventDefault()
            console.log('Guardando cambios de Categoria')
            this.loading=true
            this.loading = true

            let storageUrl = ''

            if(this.img_src != ''){
                const imgRef = this.ref(this.storage, `categoria_${this.prop_id}`)
                try {
                    await this.uploadString(imgRef, this.img_src, 'data_url').then((snapshot)=>{
                    })
                } catch (error) {
                    console.log('Algo salió mal con la imagen: ', error)
                }
                

                await this.getDownloadURL(imgRef)
                .then((url)=>{
                    storageUrl = url
                    this.img_src = url
                })
                .catch((error)=>{
                    console.log('Ha ocurrido un error: ', error)
                })
            }else{
                this.img_src = this.prop_img
            }

            await this.updateDoc(this.doc(this.db, 'categorias', this.prop_id), {
                nombre: this.nombre,
                img: this.img_src
            });
            this.loading = false
            this.cerrarForm()
        },
        async handleFileUpload(event) {
            console.log('archivo agregado')
            if(event.target.files && event.target.files.length > 0){
                this.archivo = event.target.files[0];
                const imgPreview = document.createElement('img')
                const imageUrl = URL.createObjectURL(this.archivo)
                this.img_src = imageUrl
                imgPreview.src = imageUrl

                try{
                    this.img_src = await this.bajarResolucionImg(imgPreview, true)
                }catch(error){
                    console.log('Error al crear la imagen: ',error)
                }
            }else{
                this.archivo = null
            }
        },
    }

}
</script>

<style scoped>
form{
    padding: 10px;
}
form img{
    width: 200px;
    height: 200px;
    object-fit: cover;
    margin: auto;
}

</style>