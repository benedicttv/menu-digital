<template>
  <div>
    <div v-if="menu_url">
      <PublicScreen :menuId="website"/>
    </div>

    <!-- admins -->
    <div v-if="!menu_url">
      <IniciarSesion v-if="iniciarSesion_screen" @theUser="getUser"/>
      <OptionsContainer v-if="optionsContainer_screen" @cerrar_sesion="cerrarSesion" @abrir_form_nuevo_menu="abrirFormNuevoMenu" @abrir_menu="open_menu" :user="user"/>
      <CreateMenuForm v-if="createMenuForm_screen" @ocultar_formulario="ocutar_form_new_menu" @frist_menu="open_menu_frist_time"/>
      <MenuScreen v-if="menuScreen_screen"/>
    </div>
  </div>
</template>

<script>

//admin screens
import IniciarSesion from './components/admin/IniciarSesion.vue'
import OptionsContainer from './components/OptionsContainer.vue'
import CreateMenuForm from './components/CreateMenuForm.vue'


import Screen from './components/Screen.vue'

import AddCategoria from './components/AddCategoria.vue'

import Header from './components/Header.vue'
import LoginScreen from './components/LoginScreen.vue'
import Home from './components/Home.vue'
import { computed, onUpdated, ref } from 'vue'
import ModalBackground from './components/ModalBackground.vue'
import MenuScreen from './components/MenuScreen.vue'
import PublicScreen from './components/PublicScreen.vue'

export default{
  name: 'App',
  components: {
    //admin
    IniciarSesion,
    OptionsContainer,

    //clientes
    Screen,
    Header,
    LoginScreen,
    AddCategoria,
    Home,
    ModalBackground,
    CreateMenuForm,
    MenuScreen,
    PublicScreen,
  },
  data () {
    return{
      user: null,
      //screens
      iniciarSesion_screen: true,
      optionsContainer_screen: false,
      createMenuForm_screen: false,
      menuScreen_screen: false,
      menu_url: null,
      website: null,

    }
  },
  provide() {
    return {
      admin: computed(() => this.admin),
      globalUser: computed(()=>this.user),
      db: this.db
    }
  },
  methods:{
    updateLogoUrl(newUrl) {
      this.logoUrl.value = newUrl;  // Actualizar la URL global del logo
    },
    abrirFormNuevoMenu(){
      console.log('Abriendo formulario')
      this.optionsContainer_screen = false
      this.createMenuForm_screen = true
    },//abrirFormNuevoMenu
    cerrarSesion(){
      this.user = null
      console.log('User: ', this.user)
      console.log('Global User: ', this.globalUser)
      this.iniciarSesion_screen = true
      this.optionsContainer_screen = false
    },
    getUser(resp){
      this.user = resp
      this.iniciarSesion_screen = false
      this.optionsContainer_screen = true
    },
    ocutar_form_new_menu(){
      this.createMenuForm_screen = false
      this.optionsContainer_screen = true
    },
    form_nuevo_menu(resp){
      console.log('listening openFormNewMenu from Home.vue', resp)
      this.newMenu = true
      this.Home_render = false
    },
    open_menu_frist_time(){
      console.log('abriendo menu por primera vez')
      this.createMenuForm_screen = false
      this.menuScreen_screen = true
    },
    open_menu(){
      this.optionsContainer_screen = false
      this.menuScreen_screen = true

    },//open_menu
    showLogin(resp){
      this.loginsecreen=resp
    },
    salirLogin(resp){
      this.volver=resp
      setTimeout(()=>{
        this.loginsecreen = false
        this.volver = false
      },200)
    },
    authAdmin(resp){
      this.admin=resp
    }//authAdmin
  },//methods
  async created(){
    console.log('klk Mundo!')
    //get la url actual
    const url = new URL(window.location.href)
    const url_id = url.searchParams.get('menu')
    if(url_id){
      console.log('url id: ', url_id)
      this.menu_url = true
      this.website = url_id
    }else{
      console.log('no hay id')
      this.menu_url = false
    }
  },
}
</script>


<style>

:root{
  --background-color: #323232;
  --icons-bt-bg-color: #343434;
  --contenedor-color: #252525;
  --icon-text-color: white;
  --font-h: "gastromond", sans-serif;
  --font-1: "calder-dark-grit-shadow", sans-serif;
  --font-2: "calder-shadow", sans-serif;
  --font-3: "calder-lc-grit", sans-serif;
  --font-4: "calder-lc", sans-serif;
  --font-5: "calder-grit-shadow", sans-serif;
  --font-6: "calder-dark-shadow", sans-serif;
  --font-7: "calder-dark-outline", sans-serif;
  --font-8: "calder-dark-grit", sans-serif;
  --font-9: "calder-dark", sans-serif;
  --font-10: "calder-dark-grit-shadow", sans-serif;

}

/* loading icon */
@keyframes girar {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

button{
  touch-action: manipulation !important;
}

.rotar{
  width: 25px;
  height: 25px;
  animation: girar 0.7s linear infinite; 
  margin-top: 10px;
  margin-bottom: 10px;
  margin: auto;
}

.fw-center-center{
  display: grid;
  width: 100vw;
  height: 100vh;
  background-color: white;
  text-align: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;

}

.contenedor-bt-lista{
  max-width: 500px;
  width: 100%;
  background-color: gainsboro;
  min-height: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 18px;
  margin: auto;
}

.bt-lista{
  border: none;
  gap: 5px;
  margin: auto;
  background-color: whitesmoke;
  padding: 10px 20px;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  color: #252525;
}

.bt-lista-fw{
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  text-align: left;
}

.text-icon{
  font-size: 11pt;
}

.mini-header{
  height: 40px;
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  padding: 5px;
  align-items: center;
  border-bottom: 1px gainsboro solid;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: white;
}

.mini-header button{
  border: none;
  background-color: white;
  font-size: 20px;
}

.mini-header h1{
  font-size: 20px;
  margin: auto;
  text-align: center;
  width: 100%;
  padding-right: 50px;
  background-color: white;
  color: var(--contenedor-color);
}

.center-form{
  margin: auto;
  max-width: 500px;
  box-sizing: border-box;
  padding-top: 70px;
}

.offcanvas-border{
  border-radius: 18px 18px 0px 0px;
  height: auto !important;
  padding-bottom: 50px;
}

.options-container{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.bt-offcanva-container{
  background-color: #f1f1f1;
  display: grid;
  grid-template-rows: auto auto;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  gap: 5px;
  border: none;
  color: black;
}

.bt-offcanva{
  margin: auto;
  width: auto;
  height: 25px;
}

.icon-bt{
  font-size: 25px;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: var(#151515);
    color: white;
  }
  p{
    color: whitesmoke;
  }
}




</style>
