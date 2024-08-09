<template>
<div class="container login-screen">
    <div v-if="loading">
        <div class="text-center">
          <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
          </div>
        </div>
    </div>
    <div v-if="!loading" class="container" style="max-width: 350px">
        <p class="fs-3 fw-bold">Iniciar Sesión</p>
        <form @submit="singIngWhitEmail">
          <div class="row mb-3">
            <label for="email" class="form-lable">Usuario:</label>
            <input @keyup="error=''" class="form-control" type="email" v-model="email" autocomplete="email" autofocus required>
          </div>
          <div class="row mb-3">
            <label for="email" class="form-lable">Contraseña:</label>
            <input @keyup="error=''" class="form-control" type="password" v-model="password" autocomplete="current-password" required>
          </div>
          <div class="row mb-3">
            <span style="color: red;">{{ error }}</span>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="iniciando">
            <span v-if="iniciando" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status" v-if="iniciando"> Iniciando...</span>
            <span v-if="!iniciando">Iniciar</span>
          </button>
        </form>
        <div class="row mt-5">
          <span style="color: gray">Versión Beta 0.1 *En desarrollo*</span>
        </div>
    </div>
</div>
</template>

<script>
import LoadingIcon from '../icons/LoadingIcon.vue'
import GoogleIcon from '../icons/GoogleIcon.vue'
export default {
    name: 'IniciarSesion',
    emits:['theUser'],
    components:{
      GoogleIcon,
      LoadingIcon
    },
    data(){
        return{
            loading: true,
            user: null,
            iniciando: false,
            email: '',
            password: '',
            error: ''
        }
    },
    methods:{
      async singIngWhitEmail(e){
        e.preventDefault()
        this.signInWithEmailAndPassword(this.auth, this.email, this.password)
        .then(userCredential=>{
          this.getUserInfo(userCredential.user)

        })
        .catch(error=>{
          this.error = 'Usuario o contraseña inválidos'
          //console.log('Eerror al iniciar sesion: ', error)
        })
      },
        async createNewUser(info){
            //console.log('creando un nuevo usuario...')
            await this.setDoc(this.doc(this.db, 'users', info.uid),{
                name: info.displayName,
                id: info.uid,
                menu: null,
                createDate: new Date(),
                email: info.email,
                lastLogin: new Date()
            })
            this.loading = false
            this.loginWhitGoogle()
            ////console.log(this.globalUser)
        },
        async getUserInfo(info){
            this.iniciando = true
            //console.log('buscando la información del usuario.')
            const userRef = this.doc(this.db, 'users', info.uid)
            const docSnap = await this.getDoc(userRef)
            if(docSnap.exists()){
            //console.log('Ya existe el usuario', docSnap.data())
            this.user = docSnap.data()
            this.iniciando = false
            this.$emit('theUser', this.user)
            //display options

            } else{
            this.createNewUser(info)
            }
        },//getUserInfo
        loginWhitGoogle(){
        this.iniciando = true
        this.signInWithPopup(this.auth, this.gProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = this.GoogleAuthProvider.credentialFromResult(result);
          //console.log('Credential: ', credential)
          const token = credential.accessToken;
          //console.log('Token: ', token)
          // The signed-in user info.
          const user = result.user;
          //console.log('User: ', user.email)
          //console.log('User: ', user.uid)
          //console.log('User: ', user.displayName)
          // IdP data available using getAdditionalUserInfo(result)
          //buscar si el usuario
          this.getUserInfo(user)

        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          //console.log('Error Code: ', errorCode)
          const errorMessage = error.message;
          //console.log('Error Message: ', errorMessage)
          // The email of the user's account used.
          const email = error.customData.email;
          //console.log('Error email: ', email)
          // The AuthCredential type that was used.
          const credential = this.GoogleAuthProvider.credentialFromError(error);
          //console.log('Error credential: ', credential)
          this.iniciando = false
          // ...
        })
      },//loginWhitGoogle
    },
    created(){
      //chequea si ya inicio
      
        this.loading = true
        this.onAuthStateChanged(this.auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            //console.log(user)
            this.getUserInfo(user)
            // ...
          } else {
            // User is signed out
            this.user = null
            //console.log('no hay usuario..')
            // ...
          }
        })
        this.loading = false
    }//create
}
</script>

<style scoped>
.login-screen{
    min-height: 100vh;
    display: grid;
    align-content: center;
}

.google-button{
    border-radius: 25px;
    height: 50px;
    padding: 5px 20px;
    border: 1px solid var(--background-color);
    background-color: white;
}

</style>