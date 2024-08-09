<template>
  <Screen v-if="show" class="home">
    <div v-if="!user">
      <p>Versión Beta 0.1 <br>- En desarrollo -</p>
      <button @click="loginWhitGoogle" :disabled="loading"><GoogleIcon class="google-icon"/> Iniciar con Google</button>
      <LoadingIcon v-if="loading"/>
    </div>
    <OptionsContainer v-if="user">
      <IrAmenuBt @click="openMenuScreen" v-if="user.menu!=null"/>
      <CreateMenuButton @render="openMenuScreen" @click="openFormNewMenu" v-if="globalUser.menu==null"/>
      <ContactSuportButton/>
      <LogOutButton @cerrar="cerrarSesion"/>
    </OptionsContainer>
  </Screen>
</template>

<script>
import ModalBackground from './ModalBackground.vue';
import GoogleIcon from '../components/icons/GoogleIcon.vue'
import Screen from './Screen.vue';
import LoadingIcon from './icons/LoadingIcon.vue';
import OptionsContainer from './OptionsContainer.vue'
import CreateMenuButton from './CreateMenuButton.vue'
import ContactSuportButton from './ContactSuportButton.vue'
import LogOutButton from './LogOutButton.vue'
import IrAmenuBt from './IrAmenuBt.vue'


export default {
    inject: ['globalUser'],
    name: 'Home',
    emits:['theUser','abrir_formulario', 'open_menu_screen'],
    components: {
      ModalBackground,
        Screen,
        GoogleIcon,
        LoadingIcon,
        OptionsContainer,
        CreateMenuButton,
        ContactSuportButton,
        LogOutButton,
        IrAmenuBt,
    },
    data(){
      return{
        user: false,
        loading: false,
        googleUser: null,
        show: true
      }
    },
    methods: {
      openMenuScreen(){
        this.$emit('open_menu_screen', true)
      },
      openFormNewMenu(){
          console.log('emiting abrir_formulario:')
          this.show = false;
          this.$emit('abrir_formulario', true)
        },//openFormNewMenu
      loginWhitGoogle(){
        this.loading = true
        this.signInWithPopup(this.auth, this.gProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = this.GoogleAuthProvider.credentialFromResult(result);
          console.log('Credential: ', credential)
          const token = credential.accessToken;
          console.log('Token: ', token)
          // The signed-in user info.
          const user = result.user;
          console.log('User: ', user.email)
          console.log('User: ', user.uid)
          console.log('User: ', user.displayName)
          // IdP data available using getAdditionalUserInfo(result)
          
          //buscar si el usuario
          this.getUserInfo(user)

        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          console.log('Error Code: ', errorCode)
          const errorMessage = error.message;
          console.log('Error Message: ', errorMessage)
          // The email of the user's account used.
          const email = error.customData.email;
          console.log('Error email: ', email)
          // The AuthCredential type that was used.
          const credential = this.GoogleAuthProvider.credentialFromError(error);
          console.log('Error credential: ', credential)
          this.loading = false
          // ...
        })
      },
      async getUserInfo(info){
        this.loading = true
        console.log('buscando la información del usuario.')
        const userRef = this.doc(this.db, 'users', info.uid)
        const docSnap = await this.getDoc(userRef)
        if(docSnap.exists()){
          console.log('Ya existe el usuario', docSnap.data())
          this.user = docSnap.data()
          this.loading = false
          this.$emit('theUser', this.user)
          //display options

        } else{
          this.createNewUser(info)
        }
      },
      async createNewUser(info){
        console.log('creando un nuevo usuario...')
        await this.setDoc(this.doc(this.db, 'users', info.uid),{
          name: info.displayName,
          id: info.uid,
          menu: null,
          createDate: new Date(),
          email: info.email,
          lastLogin: new Date()
        })
        this.loading = false
      },
      cerrarSesion(resp){
        this.googleUser = !resp
      }
    },//methods
    created(){
      //chequea si ya inicio
      /* this.gProvider.setCustomParameters({
        'login_hint': 'benedictt@pluma.no'
      }) */
        this.loading = true
        this.onAuthStateChanged(this.auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            this.getUserInfo(user)
            // ...
          } else {
            // User is signed out
            this.user = null
            // ...
          }
        })
        this.loading = false
    }//create

}
</script>

<style scoped>

button{
  padding: 15px;
  display: grid;
  grid-template-columns: auto 1fr ;
  gap: 10px;
  align-items: center;
  margin: auto;
  border: none;
  border-radius: 8px;
  background-color: gainsboro;
  transition: 0.2s;
  margin-top: 10px;
}

.home{
  align-items: center;
  text-align: center;
  display: grid;
  gap: 0px;
}

.google-icon{
  width: 30px;
  height: 30px;
}

</style>