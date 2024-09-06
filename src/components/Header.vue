<template>
    <div>
        <header>
            <div class="bts-header">
                <button @click="showSettings">
                    <House class="icon-header"/>
                </button>
                <button @click="verOrdenes" class="position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#notificaciones" aria-controls="notificaciones">
                    <Bell class="icon-header"/>
                     <span v-if="nuevas > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{nuevas}}
                        <span class="visually-hidden">unread messages</span>
                    </span>
                </button>
            </div>
            <img :src="urlLogo" alt="Logo" loading="lazy">
            <div class="bts-header">
                <button data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight_new'+id" :aria-controls="'offcanvasRight_new'+id">
                    <AddIcon class="icon-header"/>
                </button>
                <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" ref="close_form">
                    <IconList class="icon-header"/>
                </button>
            </div>
        </header>

        <FormNuevaCategoria :id="id"/>

        <!-- menu -->
        <div class="offcanvas offcanvas-bottom offcanvas-border" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasBottomLabel">-</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body small">
                <div class="bts-admin-container">
                    <DescargarQR/>
                    <ShareUrl/>
                </div>
            </div>
        </div>
        <Notificaciones @ordersLength="setOrderLength"/>
        <Configuracion @newLogo="getNewLogo"/>
    </div>
</template>

<script>
import CartPlus from './icons/CartPlus.vue'
import IconList from './icons/IconList.vue'
import Bell from './icons/Bell.vue'
import AddIcon from './icons/AddIcon.vue'
import House from './icons/House.vue'
import ListMenu from './icons/ListMenu.vue'
import LoginButton from './LoginButton.vue'
import { computed, inject } from 'vue'
import HomeButton from './HomeButton.vue'
import AddCategoriaBt from './AddCategoriaBt.vue'
import AddPlatoBt from './AddPlatoBt.vue'
import FormNuevaCategoria from './FormNuevaCategoria.vue'
import DescargarQR from './DescargarQR.vue'
import ShareUrl from './ShareUrl.vue'
import Notificaciones from './admin/Notificaciones.vue'
import Configuracion from './admin/Configuracion.vue'

export default {
    inject: ['globalUser'],
    props:{
        imgurl:{
            type: String,
        },
    },
    components: {
        //icons
        ListMenu,
        CartPlus,
        IconList,
        Bell,
        House,
        AddIcon,
        LoginButton,
        HomeButton,
        AddCategoriaBt,
        AddPlatoBt,
        FormNuevaCategoria,
        DescargarQR,
        ShareUrl,
        Notificaciones,
        Configuracion
        },
    name: 'Header',
    emits: ['renderLogin', 'showhome'],
    data(){
        return{
            mostrarMenuPrincipal: false,
            loginScreen: false,
            quitarMenu: false,
            id: 'nuevaCategoria',
            unsub: null,
            cuentas: [],
            ordenes: [],
            nuevas: 0,
            showSetting: false,
            urlLogo: this.urlLogo
        }
    },
    provide(){
        return{
            quitarMenu: computed(()=>this.quitarMenu),
            show_setting: computed(()=>this.showSetting)
        }
    },
    methods: {
        getNewLogo(newLogo){
            this.urlLogo = newLogo
        },//getNewLogo

        showSettings(){
            this.showSetting = !this.showSetting
            console.log(this.showSetting)
        },
        async verOrdenes(){
            //actualizar Ordenes vistas
            try {
                const ordenesQuery = this.query(
                    this.collection(this.db, 'ordenes'),
                    this.where('menu', '==', this.globalUser.menu)
                );

                // Obtener los documentos que coinciden con la consulta
                const ordenesSnapshot = await this.getDocs(ordenesQuery);

                // Iterar sobre los documentos y actualizar el campo 'vista' a true en cada uno
                ordenesSnapshot.forEach(async (ordenDoc) => {
                    const docRef = this.doc(this.db, 'ordenes', ordenDoc.id);
                    await this.updateDoc(docRef, {
                        vista: true
                    });
                });
            } catch (error) {
                console.error('Error al actualizar las órdenes:', error);
            }

        },
        setOrderLength(resp){
            this.nuevas = resp
        },
        cerrar_offcanvas(){
            console.log('cerrando el formulario...')
            this.$refs.close_form.click()
        },
        openFormCat(resp){
            this.$emit('abrirForm', resp)
            this.mostrarMenuPrincipal= false
            this.quitarMenu = true
        },
        showHome(){
            console.log('emitiendo desde header')
            this.quitarMenu = true
            this.mostrarMenuPrincipal=false
            this.$emit('showhome', true)

        },
        mostrarMenu(){
            console.log('mostrando menu')
            this.mostrarMenuPrincipal= true
            this.quitarMenu = false
        },
        ocultarMenu(){
            this.quitarMenu = true
            setTimeout(()=>{
                this.mostrarMenuPrincipal=false
            }, 200)
        },
    },//methods
    watch: {
    // Observar cambios en el prop imgurl
        imgurl(newVal) {
        this.urlLogo = newVal;  // Actualizar urlLogo cuando imgurl cambia
        },
    },//watch
    async created() {
        const cuentasRef = this.query(this.collection(this.db, 'ordenes'), this.where('menu', '==', this.globalUser.menu))
        //const cuentasRef = this.collection(this.db, 'menus', this.globalUser.menu, 'cuentas')
        this.unsub = this.onSnapshot(cuentasRef, (snaphot)=>{

            this.cuentas = []
            this.ordenes = {}
            snaphot.forEach((doc) => {
                this.ordenes[doc.data().id]=doc.data()
            });
        })
    },
    beforeUnmount(){
        this.unsub()
    }
}
</script>

<style>
header{
    width: 100%;
    min-height: 90px;
    position: fixed;
    background-color: whitesmoke;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 20px 3px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    text-align: center;
    align-items: center;
    z-index: 500;
}

.bts-header{
    display: grid;
    grid-template-columns: auto auto;
    gap: 5px;
}

.bts-header button{
    border: none;
    background-color: #00000000;
}

.icon-header{
    width: auto;
    height: 25px;
    color: #202020;
}


header img{
    max-width: 150px;
    height: 50px;
    margin: auto;
    object-fit: contain;
}
.primera-linea{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 20px;
}

.segunda-linea{
    background-color: white;
    margin-top: 15px;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 15px;
}

.bts-admin-container{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}


@media (prefers-color-scheme: dark) {
    header{
        background-color: whitesmoke;
    }
    .icon-header{
        width: 25px;
        height: 25px;
        color: #343434;
    }
}

</style>