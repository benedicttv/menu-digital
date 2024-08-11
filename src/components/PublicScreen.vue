<template>
  <div class="container">
    <HeaderGuest v-if="categoria_screen" :logo="logo_menu" :cantItems="cantItem" :num_whatsapp="numero_whatsapp">

        <Carrito :logo_restaurant="logo_menu" :cambios="cambios" @carritoLength="getCarritoLength"/>

    </HeaderGuest>

    <CategoriaPublic v-if="categoria_screen" :menu_id="menu_ref" @item_agregado="procesarOrden"/>
  </div>
</template>

<script>
import HeaderGuest from './HeaderGuest.vue'
import CategoriaPublic from './CategoriaPublic.vue'
import { computed } from 'vue'
import Carrito from './Carrito.vue'
export default {
    name: 'PublicScreen',
    components: {
        HeaderGuest,
        CategoriaPublic,
        Carrito
    },
    props:{
        menuId: {
            type: String,
            required: true
        }
    },
    data(){
        return{
            negocio: null,
            menu_ref: null,
            categoria_screen: false,
            logo_menu: '#',
            cantItem: 0,
            cambios: 0,
            ordenes: true,
            unsub: null,
            numero_whatsapp: null,
        }
    },
    provide() {
        return{
            id_menu: computed(()=>this.menu_ref),
            aceptarOrdenes: computed(()=>this.ordenes)
        }
    },
    methods:{
        getCarritoLength(resp){
            this.cantItem = resp
        },
        descargarLogo(logoRef){
            const pathReference = this.ref(this.storage, logoRef)
            this.getDownloadURL(pathReference)
            .then((url)=>{
                this.logo_menu = url
            })
            .catch((error)=>{
                console.log('Ha ocurrido un error: ', error)
            })
        },
        procesarOrden(){
            console.log('procesasando la orden')
            let orden = localStorage.getItem('miOrden')
            orden = JSON.parse(orden)
            this.cambios++
            this.cantItem =Object.keys(orden).length
            //chequea cuanto intems hay
            console.log('elementos en el carrito: ', this.cantItem)
        },
        async descargar_website(){
            try {
                const docRef = this.doc(this.db, "websites", this.menuId);
                const docSnap = await this.getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    this.menu_ref=docSnap.data().id
                    this.descargar_negocio()
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
            catch(error){
                console.log('Error: ', error)
            }

        },
        async descargar_negocio(){
            console.log('Descargar negocio: ... ')
            try {
                const docRef = this.doc(this.db, "menus", this.menu_ref);
                const docSnap = await this.getDoc(docRef);
                if(this.unsub==null){
                    this.unsub = this.onSnapshot(docRef, (doc)=>{
                        console.log("Document data:", doc.data());
                        this.negocio=doc.data()
                        this.descargarLogo(this.negocio.logoURL)

                        this.numero_whatsapp = this.negocio.whatsapp
                        //cambiar el nombre de la pagina
                        document.title = 'Menu | '+this.negocio.nombre
                        //cambiar el favicon
                        const favicon = document.querySelector('link[rel="icon"]')
                        favicon.href= this.negocio.logoURL
                        this.categoria_screen = true
                        if(this.negocio.ordenarMesa && this.negocio.ordenarMesa==true || this.negocio.ordenarDelivery==true){
                            this.ordenes = true
                        }else{
                            this.ordenes = false
                        }
                    })
                }
            }
            catch(error){
                console.log('Error: ', error)
            }
        },
        getItemsInOrden(){
            let miOrden = localStorage.getItem('miOrden')
            if(miOrden){
                miOrden = JSON.parse(miOrden)
                let cantidad = Object.keys(miOrden).length
                this.cantItem = cantidad
            }
        }
    },
    created(){
        console.log('creando publicscreen')
        this.descargar_website()
        this.getItemsInOrden()
    }

}
</script>

<style scoped>

</style>