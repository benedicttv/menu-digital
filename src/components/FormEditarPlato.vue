<template>
<div class="offcanvas offcanvas-end" tabindex="-1" :id="'offcanvasRight_editPlato'+plato.id" :aria-labelledby="'offcanvasRightLabel_editPlato'+plato.id">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">Editar {{ plato.nombre }}</h5>
    
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrar_edit_form"></button>
  </div>
  <div class="offcanvas-body">
        <form @submit="actualizarPlato">
            <div class="mb-3 row">
                <label class="form-label" for="nombre">Nombre:*</label>
                <input class="form-control" type="text" v-model="nombre" placeholder="" name="nombre" required :disabled="loading">
            </div>
            <div class="mb-3 row">
                <label class="form-label" for="precio" required>Precio:*</label>
                <input class="form-control" type="number" v-model="precio" name="precio">
            </div>

            <!-- opciones del plato -->
        <div>
            <span>Opciones:</span>
            <div class="mb-2">
                <button v-if="opcionesPlato.name != ''" @click="opcionesPlato.name = ''" type="button" class="btn btn-sm btn-light">Borrar todas las opciones</button>
            </div>
            <div class="mb-3 row">
                <input class="form-control" type="text" placeholder="Ej.: Guarniciones o Tamaño" v-model="opcionesPlato.name">
                <div v-if="opcionesPlato.name" class="mt-2 ps-5">
                    <span class="form-text fw-bold">Alternativas:</span>
                    <div v-for="(alternativa, clave) in opcionesPlato" :key="clave">
                        <div class="mb-3 border-bottom" v-if="clave != 'name'">
                            <div class="mb-2 input-group">
                                <div style="align-items: center; display: grid" class="form-check form-switch " @click="ocultarAlternativa(alternativa)">
                                    <input class="form-check-input" type="checkbox" role="switch" :checked="alternativa.avilable">
                                </div>
                                <input class="form-control col-md-3" type="text" placeholder="Ej.: Tostones o Grande" v-model="alternativa.name" required>
                                <button @click="delete opcionesPlato[clave]" v-if="Object.keys(opcionesPlato).length > 3" class="btn" type="button"><i class="bi bi-x-lg"></i></button>
                            </div>
                            <div class="mb-2 input-group">
                                <div class="input-group-text">$+</div>
                                <input class="form-control col-md-3" type="number" min="0" v-model="alternativa.precio">
                            </div>

                        </div>
                    </div>
                    <button @click="addOption" type="button" class="btn btn-success btn-sm"><i class="bi bi-plus-lg"></i>Agregar otra alternativa</button>
                </div>

            </div>
        </div>
        <!-- fin opciones del plato -->


            <div class="mb-3 row">
                <label class="form-label" for="descripcion">Descripción: (opcional)</label>
                <textarea class="form-control" name="descripcion" id="" cols="30" rows="3" v-model="descripcion"></textarea>
            </div>
            <div class="mb-3 row">
                <label class="form-label" for="img">Foto (opcional)</label>
            <input class="form-control" type="file" name="img" @change="handleFileUpload" :disabled="loading" ref="btFile" accept="image/*">
            </div>
            <div v-if="img_src != ''" class="mb-3 row" @click="openFileImg">
                <img :src="img_src" alt="Imagen preview" width="100" >
            </div>
            <div v-if="img_src != ''" class="mb-2 row">
                <button @click="quitarPhoto" type="button" class="btn btn-light"><i class="bi bi-trash-fill"></i> Quitar la foto</button>
            </div>
            <div class="mb-3 row">
                <LoadingIcon v-if="loading"/>
            </div>
            <div class="mb-3 row">
                <span>{{ errorMsg }}</span>
            </div>
            <div class="mb-3 row">
                <button type="submit" class="btn btn-primary" :disabled="loading">Guardar</button>
            </div>
        </form>
  </div>
</div>
</template>

<script>
import Screen from './Screen.vue'
import CloseIcon from './icons/CloseIcon.vue'
import LoadingIcon from './icons/LoadingIcon.vue'

export default {
    inject:['globalUser'],
    name: 'FormEditarPlato',
    emits: ['cerrar', 'update',],
    props: {
        plato: {
            type: Object,
            required: true,
        }
    },
    components: {
        Screen,
        CloseIcon,
        LoadingIcon
    },
    data(){
        return{
            loading: false,
            nombre: this.plato.nombre,
            img_src: this.plato.img,
            archivo: null,
            descripcion: this.plato.descripcion,
            precio: this.plato.precio,
            errorMsg: '',
            theId: this.plato.id,
            opcionesPlato: {
                name: '',
            },
            platoChanges: false
        }
    },
    watch:{
        'opcionesPlato.name'(newOpciones, oldOpciones){
            if(newOpciones === ''){
                this.opcionesPlato = {
                    name: ''
                }
            }
            else if(newOpciones != '' && Object.keys(this.opcionesPlato).length < 2){
                this.addOption()
                this.addOption()
            }
        },
    },
    created(){
        if(this.plato.opcionesPlato){
            console.log(`${this.plato.nombre} tiene opciones`)
            this.opcionesPlato = this.plato.opcionesPlato
        }
    },
    methods:{
        quitarPhoto(){
            const desertRef = this.ref(this.storage, `plato_${this.plato.id}`);
            // Delete the file
            this.deleteObject(desertRef).then(() => {
                console.log('Se eliminó el archivo')
            }).catch((error) => {
                console.log(error)
            });

            this.archivo = null
            this.img_src=''
            this.$refs.btFile.value = null;
        },
        ocultarAlternativa(alternativa){
            alternativa.avilable = !alternativa.avilable
        },
        hasChange(){
            this.platoChanges = true
        },
        addOption(){
            //adding new option
            //numero de la opcion
            const optionLength = Object.keys(this.opcionesPlato).length
            const optionName = `alternativa_${optionLength}`
            this.opcionesPlato[optionName]={
                name: '',
                precio: 0,
                avilable: true
            }
            console.log('adding new option', optionName)

        },
        openFileImg(){
            this.$refs.btFile.click()
            console.log('Abriendo archivo de imagen')
        },
        async actualizarPlato(e){
            this.errorMsg = ''
            e.preventDefault()
            console.log('Actualizando plato')
            this.loading=true

            const plato_img_ref = this.ref(this.storage, `plato_${this.theId}`)

            if(this.img_src != ''){
                try {
                    await this.uploadString(plato_img_ref, this.img_src, 'data_url').then((snapshot)=>{
                    })

                    let storageUrl = ''
                    await this.getDownloadURL(plato_img_ref)
                    .then((url)=>{
                        storageUrl = url
                    })
                    .catch((error)=>{
                        console.log('Ha ocurrido un error: ', error)
                    })
                } catch (error) {
                    console.log('Ha ocurrido un error: ', error)
                }
            }

            const platoRef = this.doc(this.db, 'platos', this.theId)
            await this.updateDoc(platoRef, {
                nombre: this.nombre,
                img: this.img_src,
                descripcion: this.descripcion,
                precio: this.precio,
                opcionesPlato: this.opcionesPlato
            })
            .then(()=>{
                this.$emit('update',true)
            })
            this.loading = false
            this.$refs.cerrar_edit_form.click(),
            this.platoChanges = false
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
    padding: 10px;
}
img{
    width: 200px;
    height: 150px;
    object-fit: cover;
}

</style>