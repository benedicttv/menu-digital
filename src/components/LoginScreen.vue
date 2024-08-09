<template>
  <div class="master-container screen-left">
    <div>
        <VolverIcon @click="volver" class="icon-one"/>
        <br>
        <br>
        <h1>Iniciar sesión</h1>
        <div class="form-container">
            <form @submit="iniciarSesion">
                <label for="email">Email:</label>
                <input @keyup="volverIntentar" type="email" v-model="email" placeholder="usuario@email.com" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" autocapitalize="none" required>
                <label for="password" >Contraseña:</label>
                <input @keyup="volverIntentar" type="password" v-model="password" required>
                <div>
                    <input type="checkbox" id="recordarme" name="recordarme" v-model="recordarme">
                    <label for="recordarme"> Recordarme</label>
                </div>
                 <span style="color: red" v-if="badPassword">Usuario o contraseña incorrecta</span>
                <input type="submit" value="Iniciar sesión">
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import VolverIcon from './icons/VolverIcon.vue'

export default {
    name: 'LoginScreen',
    emits:['volver', 'admin'],
    components:{
        VolverIcon
    },
    data(){
        return{
            email:'',
            password:'',
            recordarme: false,
            authUser: false,
            badPassword: false
        }
    },
    methods:{
        volver(){
            console.log('emitiendo volver')
            this.$emit('volver', true)
        },
        iniciarSesion(e){
            e.preventDefault()
            console.log('iniciando sesion...',this.email)

            this.signInWithEmailAndPassword(this.auth, this.email, this.password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                this.authUser=true
                const userInfo = {
                    email: this.email,
                    password: this.password
                }
                if(this.recordarme){
                    console.log('guardando informacion del usuario: ')
                    localStorage.setItem('user', JSON.stringify(userInfo))
                }
                this.validarAdmin()
                // ...
            })
            .catch((error) => {
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                this.badPassword=true
                // ..
            });
        },
        volverIntentar(){
            if(this.badPassword == true){
                this.badPassword = false
            }
        },
        validarAdmin(){
            this.$emit('admin', true)
            this.volver()
        }
    }

}
</script>

<style scoped>
h1{
    text-align: center;
}
</style>