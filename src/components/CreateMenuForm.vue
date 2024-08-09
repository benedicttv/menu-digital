<template>
<div class="container">
    <div class="mini-header row ">
        <button @click="ocutar_form_nuevo_menu"><i class="bi bi-chevron-left"></i></button>
        <h1>Crear Nuevo Menú</h1>
    </div>
    <div class="row center-form">
        <form @submit="crearMenu" class="needs-validation">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre del negocio:*</label>
                <input type="text" class="form-control" name="nombre" v-model="nombre" required autofocus pattern="[A-Za-z0-9ñáéíóúü\s]+">
                <div class="invalid-feedback">
                    Ingresa solo caracteres válidos.
                </div>
            </div>
            <div class="mb-3">
                <label for="logo" class="form-label">Logo:*</label>
                <input type="file" class="form-control" name="logo" @change="handleFileUpload" accept="image/png, image/jpeg" required>
                <div class="invalid-feedback">
                    Carga un tipo archivo válido.
                </div>
            </div>
            <div class="mb-3">
                <label for="whatsapp" class="form-label">Whatsapp:</label>
                <input type="tel" class="form-control" name="whatsapp" v-model="whatsapp">
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Dirección:</label>
                <input type="text" class="form-control" name="address" v-model="direccion" pattern="[A-Za-z0-9ñáéíóúü#\s]+">
            </div>
            <div class="mb-3">
                <label for="tipo" class="form-label">Tipo de negocio:</label>
                <select name="tipo" class="form-select" v-model="tipo">
                    <option value="restaurante">Restaurant</option>
                    <option value="comedor">Comedor</option>
                    <option value="cafeteria">Cafetería</option>
                    <option value="comida-rapida">Comida Rápida</option>
                </select>
            </div>
            <div class="mb-3">
                <span style="color: red">{{ errorMsg }}</span>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span v-if="loading" role="status"> Creando el menú...</span>
                    <span v-if="!loading">Crear</span>
                </button>
            </div>
            
        </form>
    </div>
    
</div>
</template>

<script>
import ModalBackground from './ModalBackground.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import Screen from './Screen.vue'

export default {
    inject: ['globalUser'],
    name: 'CreateMenuForm',
    emits: ['frist_menu', 'ocultar_formulario',],
    components:{
        Screen,
        ModalBackground,
        LoadingIcon
    },
    data(){
        return{
            nombre: '',
            img_src: null,
            whatsapp: '',
            direccion: '',
            tipo: 'restaurante',
            archivo: null,
            buttonStatus: 'Crear',
            loading: false,
            errorMsg: ''
        }
    },
    methods: {
        ocutar_form_nuevo_menu(){
            console.log('Ocualtando el formulario')
            this.$emit('ocultar_formulario', )
        },
        async crearMenu(e){
            e.preventDefault()
            this.errorMsg = ''
            console.log(this.globalUser)
            this.loading = true
            console.log('crearMenu')
            const menuId = this.crearId(20)
            const website = this.crearId(20)
            this.loading = true
            this.buttonStatus = 'Creando el menú'
            try{

                const logoRef = this.ref(this.storage, `logo_${menuId}`)
                await this.uploadString(logoRef, this.img_src, 'data_url').then((snapshot)=>{
                    console.log('El logo ha sido cargado')
                })

                let storageUrl
                await this.getDownloadURL(logoRef)
                .then((url)=>{
                    storageUrl = url
                })
                .catch((error)=>{
                    console.log('Ha ocurrido un error: ', error)
                })

                await this.setDoc(this.doc(this.db, "menus", menuId), {
                    nombre: this.nombre,
                    id: menuId,
                    logoURL: storageUrl, //`gs://menu-rd.appspot.com/menus/${menuId}/logo/logo_${menuId}`,
                    whatsapp: this.whatsapp,
                    tipo: this.tipo,
                    direccion: this.direccion,
                    admin: this.globalUser.id,
                    created: new Date(),
                    lastUpdate: new Date(),
                    website: website,
                    numOrden: 0
                })
                console.log('creando el site')
                await this.setDoc(this.doc(this.db, "websites", website), {
                    id: menuId,
                    nombre: this.nombre
                })
                this.loading = false
                this.globalUser.menu = menuId
                this.actualizarUsurio(menuId)
            }catch(error){
                this.loading = false
                console.log('Error: ', error)
                this.errorMsg = 'No se pudo crear el menú'
            }

        },
        async actualizarUsurio(menuid){
            console.log('actualizando el usuario.. ')
            const userRef = this.doc(this.db, "users", this.globalUser.id);
            await this.updateDoc(userRef, {
                lastLogin: new Date(),
                menu: menuid
            });
            this.$emit('frist_menu', true)
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
    },
}
</script>

<style scoped>

.cerrar-form-icon{
    padding-left: 20px;
    font-size: 20pt;
    margin-bottom: 20px;
}


</style>