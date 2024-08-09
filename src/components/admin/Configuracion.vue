<template>
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
      <div class="offcanvas-header">
        <h5 style="font-family: var(--font-3)" class="offcanvas-title fw-bold" id="offcanvasWithBothOptionsLabel"> <i class="bi bi-gear"></i> Configuración</h5><div v-if="loading" class="spinner-border spinner-border-sm ms-1" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form @submit="guardarSetting">
          <div class="row mb-3 mt-3">
            <img v-if="info.menu && info.menu.logoURL" :src="info.menu.logoURL" height="50" class="object-fit-contain " :alt="info.menu.nombre">
          </div>
          <p class="fw-bold mb-3">Impuestos:</p>
          <div class="input-group mb-3">
            <label for="impuesto" class="input-group-text">Itbis (%)</label>
            <input type="number" class="form-control" v-model="itbis">
          </div>
          <div class="input-group mb-3">
            <label for="propina" class="input-group-text">Propina (%)</label>
            <input type="number" name="propina" inputmode="numeric" class="form-control" v-model="propina">
          </div>
          <div class="input-group mb-3">
            <label for="delivery" class="input-group-text">Costo Delivery</label>
            <input type="number" name="delivery" inputmode="numeric" class="form-control" v-model="costoDelivery">
          </div>
          <button @click="saveImpuestos" type="button" class="btn btn-primary btn-sm mb-3" :disabled="!guardarImpuestos"><i class="bi bi-floppy2-fill"></i> Guardar</button>
          <div class="border-top pt-2">
            <span class="mb-2 fw-bold">Permitir a los clientes:</span>
            <div class="form-check form-switch mb-1">
              <input class="form-check-input" type="checkbox" role="switch" id="permitir_ordenar" v-model="ordenarMesa" :disabled="loading">
              <label class="form-check-label" for="permitir_ordenar">Ordenar desde la mesa</label>
            </div>
            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" role="switch" id="permitir_delivery" v-model="ordenarDelivery" :disabled="whatsappError">
              <label class="form-check-label" for="permitir_delivery">Ordenar por Whatsapp</label>
            </div>
            <div class="input-group">
              <label for="num-whatsapp" class="input-group-text"><i class="bi bi-whatsapp"></i></label>
              <input @keyup="resetValido" class="form-control" style="max-width: 250px" type="text" inputmode="numeric" maxlength="10" minlength="10" name="num-whatsapp" placeholder="8095516239" v-model="whatsapp">
            </div>
            <span v-if="whatsappError" class="fs-7" style="color: red;">Número de Whatsapp inválido</span>
          </div>
          <!-- Mesas -->
          <div v-if="ordenarMesa" class="mt-5 border-top pt-2">
            <p class="fw-bold mb-2">Códigos de mesas:</p>
            <div v-for="(mesa, index) in mesas" :key="mesa" class="row mesas mb-3">
              <label :for="'mesa'+index" class="col-sm-2 col-form-label">Mesa {{index+1}}: </label>
              <div class="col-sm-10 input-mesa">
                <input class="form-control" type="number" minlength="6" maxlength="6" placeholder="Ingresa 6 digitos" v-model="mesas[index]" :id="'mesa'+index" required disabled>
                <button @click="resetCodigo(index)" type="button" class="btn btn-primary" :disabled="loading"><i class="bi bi-arrow-clockwise"></i></button>
                <button type="button" @click="eleminarMesa" v-if="index === mesas.length - 1 && mesas.length > 1" class="btn btn-secondary" :disabled="loading"><i class="bi bi-trash"></i></button>
              </div>
            </div>
            <!-- boton agregar mesas -->
            <button type="button" @click="crearMesa" class="btn btn-success btn-sm mb-5" :disabled="loading"><i class="bi bi-plus"></i> Agregar mesa</button>


          </div>

        </form>

      </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch } from 'vue'
import { getFirestore, doc, setDoc, updateDoc, deleteDoc,collection, query, where, getDoc, getDocs, onSnapshot, arrayUnion, arrayRemove, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
//descargar la configuración del restaurant
const globalUser = inject('globalUser')
const db = inject('db')
const offcanvasElement = ref(null)
const info = reactive({menu: null})
const mostrar = inject('show_setting')
const loading = ref(false)
const docRef = doc(db, 'menus', globalUser.value.menu)
const ordenarMesa = ref(false)
const ordenarDelivery = ref(false)
const mesas = ref([null])
const itbis = ref(18)
const propina = ref(10)
const guardarImpuestos = ref(false)
const whatsapp = ref('')
const whatsappError = ref(true)
const costoDelivery = ref(0)

//funciones
const getSetting = async ()=>{
  try {
    //console.log(globalUser.value.menu)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      info.menu = docSnap.data()
      //console.log(info.menu)
    }
    if(info.menu.ordenarMesa){
      ordenarMesa.value = info.menu.ordenarMesa
    }
    if(info.menu.ordenarDelivery){
      ordenarDelivery.value = info.menu.ordenarDelivery
    }
    if(info.menu.mesas){
      mesas.value = info.menu.mesas
    }else{
      mesas.value = []
    }

    //impuestos
    if(info.menu.itbis){
      itbis.value = info.menu.itbis
    }
    if(info.menu.propina){
      propina.value = info.menu.propina
    }
    if(info.menu.costoDelivery){
      costoDelivery.value = info.menu.costoDelivery
    }

    //whatsapp
    if(info.menu.whatsapp){
      whatsapp.value=info.menu.whatsapp
    }
    

  } catch (error) {
    //console.log('Error: ', error)
  }
}//getingSettin

const guardarSetting =(e)=>{
  e.preventDefault()
}
const mostrarSettings =()=>{
  offcanvasElement.value.show()
}
const resetValido=()=>{
  if(verificarNumero()==true && whatsappError==true){
    whatsappError.value = false
  }
}

const createTableCode =()=>{
  return Math.floor(Math.random()*900000)+100000
}

const eleminarMesa = async ()=>{
  loading.value = true
  mesas.value.pop()
  await updateDoc(docRef, {
    'mesas': mesas.value
  })
  loading.value = false
}

const crearMesa = async()=>{
  loading.value = true
  const codigo = createTableCode()
  //console.log('Codigo: ', codigo)
  mesas.value.push(codigo)
  await updateDoc(docRef, {
    'mesas': mesas.value
  })
  loading.value = false
}

const resetCodigo = async (mesaNum)=>{
  loading.value = true
  //console.log('Resetando codigo mesas: ', mesaNum)
  const codigo = createTableCode()
  mesas.value[mesaNum] = codigo
  await updateDoc(docRef, {
    'mesas': mesas.value
  })
  loading.value = false
}

const saveImpuestos= async ()=>{
  loading.value = true
  guardarImpuestos.value = false
  await updateDoc(docRef, {
    'itbis': itbis.value,
    'propina': propina.value,
    'costoDelivery': costoDelivery.value
  })
  loading.value = false
}

const verificarNumero=()=>{
  if (!/^\d+$/.test(whatsapp.value)) {
    console.log(whatsapp.value, ': no es un numero')
    return false; 
  }
  if(whatsapp.value.length !== 10){
    console.log('cantidad de numeros incorrecta')
    return false
  }
  let primeroTresDigitos = whatsapp.value.substring(0,3)
  if(whatsapp.value.length > 2 && primeroTresDigitos !== '849' && primeroTresDigitos !== '829' && primeroTresDigitos !== '809'){
    console.log('Primeros tres digitos inválidos')
    return false
  }
  return true
}//verificarNumero

//wactchers
watch(propina, (newVal, oldVal)=>{
  guardarImpuestos.value = true
})
watch(itbis, (newVal, oldVal)=>{
  guardarImpuestos.value = true
})
watch(costoDelivery, (newVal, oldVal)=>{
  guardarImpuestos.value = true
})

watch(mostrar, (newVal, oldVal) => {
  // Handle prop changes
  mostrarSettings()
})

watch(ordenarMesa, async (newVal, oldVal)=>{
  loading.value = true
  await updateDoc(docRef, {
    'ordenarMesa': newVal
  })
  console.log(mesas.value.length,'-',newVal)
  if(newVal==true && mesas.value.length < 1){
    crearMesa()
  }
  loading.value = false
})

watch(whatsapp, (newNum, oldNum)=>{
  if(verificarNumero()==true){
    whatsappError.value=false
  }else{
    whatsappError.value=true
  }
})

watch(whatsappError, (newVal, oldVal)=>{ 
  if(newVal==true){
    ordenarDelivery.value = false
  }
})

watch(ordenarDelivery, async (newVal, oldVal)=>{
  loading.value = true

  if(newVal===true){
    //revisar si el cliente tiene el numero de whatsapp
    let actualizar = verificarNumero()
    if(actualizar==true){
      console.log('verficado')
      await updateDoc(docRef, {
        'ordenarDelivery': newVal,
        'whatsapp': whatsapp.value
      })
    }else{
      whatsappError.value = true
      loading.value = false
      console.log('desactivando ordenar delivery', ordenarDelivery.value)
      return
    }

  }else{
    await updateDoc(docRef, {
      'ordenarDelivery': newVal,
    })
  }
  loading.value = false
})

onMounted(()=>{
  console.log('desactivando ordenar delivery', ordenarDelivery.value)
  //console.log('Cargando configuracion')
  offcanvasElement.value = new bootstrap.Offcanvas(document.getElementById('offcanvasWithBothOptions'))
  getSetting()
})
</script>

<style>

.offcanvas-body{
  font-family: var(--font-3);
}

.mesas{
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 5px;
}

.input-mesa{
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 5px;
}

</style>