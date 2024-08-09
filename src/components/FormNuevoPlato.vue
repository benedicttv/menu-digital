<template>
<div class="offcanvas offcanvas-end" tabindex="-1" :id="'offcanvasRight_nuevoPlato'+id" :aria-labelledby="'offcanvasRightLabel_nuevoPlato'+id">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title fw-bold" style="font-family: var(--font-4)" :id="'offcanvasRightLabel_nuevoPlato'+id">Agregar plato a: {{name_cat}}</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref="cerrar_form_nuevo_plato_button"></button>
  </div>
  <div class="offcanvas-body">
    <form @submit="creaNuevoPlato" style="padding: 10px">
        <div class="mb-3 row">
            <label class="form-label" for="nombre">Nombre:*</label>
            <input class="form-control" type="text" v-model="nombre" placeholder="" name="nombre" required :disabled="loading">
        </div>
        <div class="mb-3 row">
            <label class="form-label" for="precio">Precio:*</label>
            <input class="form-control" type="number" inputmode="numeric" v-model="precio" name="precio" required>
        </div>
        <!-- opciones del plato -->
        <div>
            <span>Opciones:</span>
            <div class="mb-3 row">
                <input class="form-control" type="text" placeholder="Ej.: Guarniciones o Tamaño" v-model="opcionesPlato.name">
                <div v-if="opcionesPlato.name" class="mt-2 ps-5">
                    <span class="form-text fw-bold">Alternativas:</span>
                    <div v-for="(alternativa, clave) in opcionesPlato" :key="clave">
                        <div class="mb-3 border-bottom" v-if="clave != 'name'">
                            <div class="mb-2 input-group">
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

        <div class="mb-3 mt-4 row">
            <label class="form-label" for="descripcion">Descripción: (opcional)</label>
            <textarea class="form-control" name="descripcion" id="" cols="30" rows="3" v-model="descripcion"></textarea>
        </div>
        <div class="mb-3 row">
             <label class="form-label" for="img">Foto</label>
            <input class="form-control" type="file" name="img" @change="handleFileUpload" :disabled="loading" ref="archivo_img">
        </div>
        <div v-if="archivo" class="mb-3 row">
            <img @click="abrirArchivo" :src="img_src" alt="Imagen preview">
            <LoadingIcon v-if="loading"/>
        </div>
        <div class="mb-3 row">
            <span>{{ errorMsg }}</span>
        </div>
        <div class="d-grid gap-2 d-md-block">
            <button class="btn btn-primary" type="submit" :disabled="loading">Guardar</button>
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
    name: 'FormNuevoPlato',
    emits: ['cerrar'],
    props: {
        name_cat: String,
        cat_id: {
            type: String,
            required: true
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
            nombre: '',
            img_src: '',
            archivo: null,
            descripcion: '',
            precio: '',
            errorMsg: '',
            nombre_categoria: this.name_cat,
            id: this.cat_id,
            posicion: -1000,
            opcionesPlato: {
                name: '',
            },
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
        }
    },
    methods:{
        addOption(){
            const optionLength = Object.keys(this.opcionesPlato).length
            const optionId = this.crearId(20)
            this.opcionesPlato[optionId]={
                id: optionId,
                name: '',
                precio: 0,
                avilable: true
            }
            console.log('adding new option', optionId)

        },
        nuevoPlatoCreado(){
            this.nombre = ''
            this.img_src = '#',
            this.archivo = null,
            this.descripcion = ''
            this.precio = ''
            this.errorMsg = ''
            console.log('abre los platos')
        },
        abrirArchivo(){
            this.$refs.archivo_img.click()
        },
        async creaNuevoPlato(e){
            this.errorMsg = ''
            e.preventDefault()
            console.log('Creando nuevo plato')
            this.loading=true
            const platoId = this.crearId(20)
            this.loading = true

            let storageUrl = ''

            const plato_img_ref = this.ref(this.storage, `plato_${platoId}`)

            if(this.img_src != ''){
                try {
                    await this.uploadString(plato_img_ref, this.img_src, 'data_url').then((snapshot)=>{
                    })

                    await this.getDownloadURL(plato_img_ref)
                    .then((url)=>{
                        storageUrl = url
                    })
                    .catch((error)=>{
                        console.log('Ha ocurrido un error: ', error)
                    })
                } catch (error) {
                    console.log('Error: ', error)
                }
            }

            //la posicion del plato
            let posicion = 0
            try {
                const q = this.query(this.collection(this.db, 'platos'), this.where('categoria', '==', this.cat_id))
                const platosSnapshot = await this.getDocs(q)
                posicion = platosSnapshot.size
                console.log('La pocision de este plato es: ', posicion)

                await this.setDoc(this.doc(this.db, 'platos', platoId), {
                    nombre: this.nombre,
                    id: platoId,
                    img: storageUrl,
                    descripcion: this.descripcion,
                    precio: this.precio,
                    visible: true,
                    categoria: this.cat_id,
                    posicion: posicion,
                    opcionesPlato: this.opcionesPlato
                });
            } catch (error) {
                console.log('Error: ', error)
                
            }
            this.loading = false
            this.$refs.cerrar_form_nuevo_plato_button.click()
            this.nuevoPlatoCreado()
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
img{
    width: 200px;
    height: 150px;
    object-fit: cover;
}
label{
    font-family: var(--font-4);
}

.input-alternativa{
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
}

</style>