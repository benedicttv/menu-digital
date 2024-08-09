<template>
    <div class="offcanvas offcanvas-end" tabindex="-1" :id="'offcanvasRight_new'+id" :aria-labelledby="'offcanvasRightLabel_new'+id">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" :id="'offcanvasRightLabel_new'+id">Nueva Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrar_form"></button>
        </div>
        <div class="offcanvas-body">
            <form @submit="crearNuevaCategoria" ref="formulario">
                <div class="mb-3 row">
                    <label for="nombre" class="form-label">Nombre de la categoría:*</label>
                    <input  type="text" class="form-control" v-model="nombre" placeholder="" name="nombre" required :disabled="loading" pattern="[A-Za-z0-9ñáéíóúü\s]+" maxlength="50">
                </div>

                <div class="mb-3 row">
                    <label for="img" class="form-label">Foto (recomendado)</label>
                    <input type="file" class="form-control" name="img" @change="handleFileUpload" :disabled="loading" ref="img_categoria" accept="image/png, image/jpeg">
                </div>
                <div @click="editFoto" class="mb-3 row">
                    <img class="img-preview" :src="img_src" alt="Foto de la categaria">
                </div>
                <div class="mb-3 row">
                    <LoadingIcon v-if="loading"/>
                </div>

                <div class="mb-3">
                    <span>{{ errorMsg }}</span>
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="loading">Crear categoria</button>
                </div>
            </form>

        </div>

    </div>
</template>

<script>
import Screen from './Screen.vue'
import LoadingIcon from './icons/LoadingIcon.vue'

export default {
    inject:['globalUser'],
    name: 'FormNuevaCategoria',
    emits: ['cerrar'],
    components: {
        Screen,
        LoadingIcon
    },
    props:{
        id: {type: String, required: true}
    },
    data(){
        return{
            loading: false,
            nombre: '',
            archivo: null,
            errorMsg: '',
            img_src: null
        }
    },
    methods:{
        cerrarForm(){
            this.$refs.cerrar_form.click()
        },
        editFoto(){
            this.$refs.img_categoria.click()
        },
        async crearNuevaCategoria(e){
            this.errorMsg = ''
            e.preventDefault()
            console.log('Creando nueva Categoria')
            this.loading=true
            const categoriaId = this.crearId(20)
            this.loading = true
            console.log
            const imgRef = this.ref(this.storage, `categoria_${categoriaId}`)
            let storageUrl = ''
            try {
                if(this.img_src != ''){
                    await this.uploadString(imgRef, this.img_src, 'data_url')
                    .then((snapshot)=>{
                    })
                }
            } catch (error) {
                console.log('Error: ', error)
            }
            try {
                if(this.img_src != ''){
                    await this.getDownloadURL(imgRef)
                    .then((url)=>{
                        storageUrl = url
                    })
                    .catch((error)=>{
                        console.log('Ha ocurrido un error: ', error)
                    })
                }
            } catch (error) {
                console.log('Ha ocurrido un error: ', error)
            }
            try {
                //crea la posicion de la categoría
                const q = this.query(this.collection(this.db, 'categorias'), this.where('menu', '==', this.globalUser.menu))
                const categoriasSnapshot = await this.getDocs(q)
                const posicion = categoriasSnapshot.size
                console.log('La posicion es: ', posicion)

                await this.setDoc(this.doc(this.db, "categorias", categoriaId), {
                    nombre: this.nombre,
                    id: categoriaId,
                    img: storageUrl, //`gs://menu-rd.appspot.com/menus/${this.globalUser.menu}/categorias/categoria_${categoriaId}`,
                    posicion: posicion,
                    menu: this.globalUser.menu
                });

                this.cerrarForm()
                this.nombre = '',
                this.archivo = null,
                this.img_src = '#',
                this.errorMsg = ''
                this.loading = false
            } catch (error) {
                console.log('Algo saló mal: ', error)
                this.loading = false
            }
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
                this.img_src=''
            }
        },
    }

}
</script>

<style scoped>
form{
    box-sizing: border-box;
    padding: 20px;
    max-width: 500px;
    margin: auto;
}

.img-preview{
    object-fit: cover;
    width: 200px;
    height: 200px;
    margin: auto;
}

</style>