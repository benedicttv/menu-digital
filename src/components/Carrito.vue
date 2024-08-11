<template>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas_carrito" aria-labelledby="offcanvas_carrito_Label">
  <div class="offcanvas-header">
    <img :src="logo_restaurant" width="auto" height="30px" alt="logo" class="me-2">
    <h5 class="offcanvas-title" id="offcanvas_carrito_Label" style="font-family: var(--font-4)">| Mi orden</h5>

    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">

    <!-- elegir si para comer aqui, llevar o delivery -->
    <div v-if="!carrito_vacio">
        <p v-if="menuSetting && menuSetting.order">Ordenar para: </p>
        <TipoOrden @tipo_orden="cambiarTipoOrden"/>
        <div class="mb-3 row input-mesa" v-if="menuSetting && menuSetting.ordenarMesa == true && ordenar_para=='comerAqui'">
            <label for="mesa">Cód. Mesa: </label>
            <input class="form-control" type="number" inputmode="numeric" min="1" max="9999" step="1" v-model="mesa" style="text-align: center;" minlength="6" maxlength="6" placeholder="000000"/>
        </div>

    </div>

    <div v-if="!loading && !carrito_vacio">
        <ItemCarrito v-for="item in Object.keys(carrito)" :key="carrito[item].plato.id" :data="carrito[item]" @sumar="sumar_item" @restar="restar_item" @eliminar="eliminar_item"/>
        <p>Sub-total: {{subTotal.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</p>
        <p>Itbis ({{itbis}}%): {{totalItbis.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</p>
        <p v-if="ordenar_para == 'comerAqui'">Propina ({{propina}}%): {{totalPropina.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</p>
        <p v-if="ordenar_para == 'delivery'">Delivery: {{costoDelivery.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</p>
        <p style="font-weight: bold">Total: {{total.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' })}}</p>
    </div>

    <p v-if="carrito_vacio">El carrito está vacío</p>

    <div v-if="enviada">
        <p style="color: black; text-align: center;">Orden envia!</p>
    </div>

    <button v-if="!carrito_vacio && menuSetting && menuSetting.ordenarMesa == true || menuSetting && menuSetting.ordenarDelivery" @click="ordenar" type="button" class="btn btn-primary" :disabled="!mesaOK">
        Ordenar
    </button>

    <div class="mt-5">
        <Cuenta/>
    </div>

  </div>
</div>
</template>

<script>
import LoadingIcon from './icons/LoadingIcon.vue'
import ItemCarrito from './ItemCarrito.vue'
import {computed} from 'vue'
import TipoOrden from './cliente/carrito/TipoOrden.vue'
import Cuenta from './Cuenta.vue'
export default {
    name: 'Carrito',
    components:{ItemCarrito, LoadingIcon, TipoOrden, Cuenta},
    inject: ['id_menu'],
    emtis: ['itemDeleted', 'carritoLength'],
    props:{
        logo_restaurant: {type: String},
        numItems: {type: Number},
        cambios: {type: Number}
    },
    data(){
        return{
            total: 0,
            carrito: null,
            mesa: 1,
            carrito_vacio: true,
            loading: false,
            enviada: false,
            recibos: {},
            ordenar_para: '',
            unsub: null,
            unsubMenu: null,
            menuSetting: null,
            mesaOK: false,
            itbis: 18,
            propina: 10,
            costoDelivery: 0,
            totalItbis: 0,
            totalPropina: 0,
            subTotal: 0
        }
    },
    provide(){
        return{
            losRecibos: computed(()=>this.recibos),
            setting: computed(()=>this.menuSetting)
        }
    },
    methods:{
        showCuenta(){
            console.log('emitiendo showBill')
        },
        cambiarTipoOrden(tipo){
            this.ordenar_para = tipo,
            console.log('Ordenar para: ', this.ordenar_para)
            if(this.ordenar_para=='delivery'){
                this.mesaOK = true
            }else{
                this.confirmarCodigoMesa()
            }
            this.updateCarrito()
        },
        async ordenar(){
            this.loading = true
            console.log('ordenando...', this.id_menu)
            //obtener numero de la orden
            const menuDoc = await this.getDoc(this.doc(this.db, 'menus', this.id_menu))
            const numeroOrden = menuDoc.data().numOrden+1
            console.log('Numero de la orden: ', numeroOrden)
            const ordenId = this.crearId(20)

            //get bill id from localstorage
            let cuentaId = this.crearId(20)
            let localCuenta = localStorage.getItem('localCuenta')
            if(localCuenta){
                cuentaId = localCuenta
                console.log('Ya habia comprado antes')
            }else{
                localStorage.setItem('localCuenta', cuentaId)
            }
            console.log(('items: ', this.carrito))
            let tipo = null
            if(this.ordenar_para=='delivery'){
                tipo= 'Whatsapp'
            }else if(this.ordenar_para=='comerAqui'){
                tipo = this.mesa
            }
            const orden_info = {
                mesa: tipo,
                hora: Date.now(),
                total: this.total,
                numOrden: numeroOrden,
                items: this.carrito,
                id: ordenId,
                menu: this.id_menu,
                estado: 'nueva',
                cuentaId: cuentaId,
                vista: false,
            }
            await this.setDoc(this.doc(this.db, "ordenes",ordenId), orden_info)
            .then((resp)=>{
            localStorage.removeItem('miOrden')
            this.updateCarrito()
            console.log('orden agregada')

            if(this.unsub===null){
                const cuentaQuery = this.query(this.collection(this.db, 'ordenes'), this.where('cuentaId', '==', cuentaId))
                const cuentaUnsub = this.onSnapshot(cuentaQuery, (cuentaSnapshot)=>{
                    this.recibos = {}
                    cuentaSnapshot.forEach((doc) =>{
                        this.recibos[doc.data().id]=doc.data()
                    })
                })
            }
            console.log('Recibos: ', this.recibos)
            this.enviada = true
            setTimeout(() => {
                this.enviada = false
            }, 3500);
            })
            .catch((error)=>{
                console.log('Error: ', error)
            })

            //actualizar el numero de la orden
            await this.updateDoc(this.doc(this.db, 'menus', this.id_menu), {numOrden: this.increment(1)})
            this.loading = false

            if(this.ordenar_para=='delivery'){
                let messeger = `Hola, les he enviado la orden #${orden_info.numOrden} con lo siguiente: \n`
                for(const [clave, valor] of Object.entries(orden_info.items)){
                    messeger += `-${valor.cantidad}x ${valor.plato.nombre}\n`
                }
                messeger += '\nPor favor confirmar'

                const textoWhatsApp = encodeURIComponent(messeger);
                window.open(`https://wa.me/1${this.menuSetting.whatsapp}?text=${textoWhatsApp}`, '_blank')
            }
        },
        actulizarCuenta(nueva){
            console.log('actualizar cuenta',nueva)
            let laCuenta = localStorage.getItem('laCuenta')
            if(laCuenta){
                laCuenta = JSON.parse(laCuenta)
                laCuenta.push(nueva)
                console.log('Hay una cuenta vieja: ', laCuenta)
            }else{
                console.log('creando una cuenta nueva')
                laCuenta = [nueva]
            }
            localStorage.setItem('laCuenta', JSON.stringify(laCuenta))
            this.recibos=laCuenta
            console.log(this.recibos)
        },
        sumar_item(resp){
            console.log(this.carrito[resp])

            console.log('sumando');
        
            // Utilizar el identificador único en lugar del ID del plato
            const item = this.carrito[resp];

            // Incrementar la cantidad del ítem seleccionado
            if (item) {
                item.cantidad++;
                localStorage.setItem('miOrden', JSON.stringify(this.carrito));
                this.updateCarrito();
            } else {
                console.error('El ítem no fue encontrado en el carrito');
            }

        },
        restar_item(resp){
            console.log('restando')
            this.carrito[resp].cantidad--
            if(this.carrito[resp].cantidad == 0){
                this.eliminar_item(resp)
            }
            localStorage.setItem('miOrden', JSON.stringify(this.carrito))
            this.updateCarrito()

        },
        eliminar_item(resp){
            console.log('eliminando')
            delete this.carrito[resp]
            localStorage.setItem('miOrden', JSON.stringify(this.carrito));
            this.updateCarrito();

        },
        updateCarrito(){

            //verifica si el sitio visitado es el mismo del menu
            //obten el parametro del menu
            const url = new URL(window.location.href)
            const menuSiteId = url.searchParams.get('menu')
            const menuSite = localStorage.getItem('menuSite')
            if(menuSite){
                //chequea si el el mismo sitio
                if(menuSite != menuSiteId){
                    localStorage.removeItem('miOrden')
                }
            }
            localStorage.setItem('menuSite', menuSiteId)
            console.log('actualizando el carrito...')
            let orden = localStorage.getItem("miOrden")
            let miOrden = {
            }
            if(orden){
            console.log('Ya hay una orden abierta')
            miOrden = JSON.parse(orden)

            }else{
            console.log('no hay orden')
            orden = JSON.stringify(miOrden)
            localStorage.setItem('miOrden', orden)
            }
            this.la_orden = Object.keys(miOrden).length
            console.log('La orden: ', this.la_orden)
            this.carrito = miOrden
            console.log('Items en esta orden: ', this.la_orden)
            if(this.la_orden > 0){
                this.carrito_vacio = false
            }else{
                this.carrito_vacio = true
            }
            this.$emit('carritoLength', this.la_orden)
            this.calcularTotal()
        },//updateCarrito
        calcularTotal(){
            console.log('calculando el total')
            this.total = 0
            let totalItbis = 0
            let totalPropina = 0
            let costoDelivery = 0

            for (let item in this.carrito){
                this.total = this.total+(this.carrito[item].cantidad * this.carrito[item].total)
            }
            this.subTotal = this.total
            if(this.ordenar_para == 'comerAqui'){
                totalPropina = this.total*(this.propina/100)
                this.totalPropina = totalPropina
                costoDelivery = 0
            }
            if(this.ordenar_para == 'delivery'){
                console.log('costo delivery: ', this.costoDelivery)
                this.totalPropina = 0
                costoDelivery = this.costoDelivery
            }
            totalItbis = this.total*(this.itbis/100)
            this.totalItbis = totalItbis
            this.total = this.total+totalItbis+totalPropina+costoDelivery
        },
        confirmarCodigoMesa(){
            const mesaLength = this.mesa.toString()
            if(mesaLength.length===6){
                console.log('comparando las mesas:', this.ordenar_para)
                //chequea si el numero coincide con alguna mesa
                this.menuSetting.mesas.forEach(mesa => {
                    if(mesa == this.mesa && this.ordenar_para=='comerAqui'){
                        this.mesaOK = true
                    }
                });
            }else{
                this.mesaOK = false;
            }
        }//confirmarCodigoMesa
    },
    watch:{
        numItems(nuevo, viejo){
            this.updateCarrito()
        },
        cambios(nuevo, viejo){
            this.updateCarrito()
        },
        mesa(nuevo, viejo){
            this.confirmarCodigoMesa()
        }
    },
    created(){
        this.updateCarrito()
        //chequea la orden
        let cuentaId = localStorage.getItem('localCuenta')
        if(cuentaId){
            if(this.unsub===null){
                const cuentaQuery = this.query(this.collection(this.db, 'ordenes'), this.where('cuentaId', '==', cuentaId), this.where('menu', '==', this.id_menu ))
                const cuentaUnsub = this.onSnapshot(cuentaQuery, (cuentaSnapshot)=>{
                    this.recibos = {}
                    cuentaSnapshot.forEach((doc) =>{
                        console.log(doc.data())
                        this.recibos[doc.data().id]=doc.data()
                    })
                })
            }
        }

        //chequea si el negocio permite ordenar desde la mesa
        if(this.unsubMenu==null){
            console.log('Revisando si acepta ordenes..')
            this.unsubMenu = this.onSnapshot(this.doc(this.db, 'menus', this.id_menu), (menu)=>{
                this.menuSetting = menu.data()
                console.log(this.menuSetting)
                if(!this.menuSetting.ordenarMesa){
                    this.menuSetting.ordenarMesa = false
                }
                if(this.menuSetting.itbis){
                    this.itbis = this.menuSetting.itbis
                }
                if(this.menuSetting.propina){
                    this.propina = this.menuSetting.propina
                }

                if(this.menuSetting.costoDelivery){
                    this.costoDelivery = this.menuSetting.costoDelivery
                }

                this.mesa = ''
                this.mesaOK = false

            })
        }
    },
}
</script>

<style scoped>
.input-mesa{
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    border-bottom: solid 1px whitesmoke;
    padding-bottom: 10px;
}
.input-mesa input{
    width: 200px;
    letter-spacing: 2px;
}
.btn-ordenar{
    position: sticky;
    bottom: 0px;
    background-color: white;

}

@media (prefers-color-scheme: dark){
    p{
        color: #151515;
    }
}


</style>