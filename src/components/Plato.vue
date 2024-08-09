<template>
<div>
    <div class="border border-1 rounded p-3 mb-2" ref="plato_img" :style="{opacity: opacidad}" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasBottom_platoId_'+plato.id" :aria-controls="'offcanvasBottom_platoId_'+plato.id">
        <div v-if="plato.img !== ''">
            <img :src="plato.img" height="350" class="img-fluid mb-2" :alt="plato.name">
        </div>
        <div>
            <LoadingIcon v-if="loading"/>
            <div>
                <h2 class="nombre-plato fs-6 fw-bold">{{ plato.nombre }}</h2>
                <span class="fs-6 descripcion">{{ plato.descripcion }}</span>

                <h2 class="fs-6 nombre-plato mt-2">{{ plato.precio.toLocaleString('en-EN', { style: 'currency', currency: 'DOP' }) }}</h2>

                <div style="font-family: var(--font-3)" v-if="plato.opcionesPlato && plato.opcionesPlato.name != ''">
                    <span class="fw-bold fs-6" style="font-family: var(--font-3)">{{ plato.opcionesPlato.name }}</span>
                    <div class="variantes mb-1" v-for="(alternativa, clave) in opcionesOrdenadas" :key="clave">
                        <span v-if="alternativa.precio == '' || alternativa.precio >=0">{{ alternativa.name }}</span>
                        <span v-if="alternativa.precio == '' || alternativa.precio >=0"> +${{alternativa.precio}}</span>
                    </div> <!-- quisiera ordenar las alterntivas por el .precio, es posible? -->

                </div>
            </div>
            <span v-if="hasChange" class="fs-7" style="color: red">No has guardado los cambios</span>
        </div>
    </div>
    <OpcionesPlato @eliminarPlato="deletePlato" :plato="plato" @ocultar_mostrar_plato="ocultarPlato"/>
    <FormEditarPlato :plato="plato"/>
</div>
</template>

<script>
import OpcionesPlato from './admin/OpcionesPlato.vue'
import LoadingIcon from './icons/LoadingIcon.vue'
import EditIcon from './icons/EditIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import DontSeeIcon from './icons/DontSeeIcon.vue'
import SeeIcon from './icons/SeeIcon.vue'
import MenuPrincipal from './MenuPrincipal.vue'
import FormEditarPlato from './FormEditarPlato.vue'
export default {
    inject: ['globalUser'],
    name: 'Plato',
    components:{
        LoadingIcon,
        MenuPrincipal,
        EditIcon,
        DeleteIcon,
        DontSeeIcon,
        FormEditarPlato,
        SeeIcon,
        OpcionesPlato
    },
    props:{
        plato: {
            type: Object,
            required: true
        }
    },
    data(){
        return{
            loading: false,
            deleting: false,
            platoRef: null,
            formEditar: false,
            opacity_grade: '1',
            hasChange: false
        }
    },
    computed: {
        opacidad(){
            if(this.plato.visible==true){
                this.opacity_grade = '1'
            }else{
                this.opacity_grade = '0.2'
            }
            return this.opacity_grade
        },
        opcionesOrdenadas(){
            if(!this.plato.opcionesPlato) return []
            return Object.values(this.plato.opcionesPlato).sort((a,b)=> a.precio - b.precio)
        }
    },//computed
    methods:{
        async ocultarPlato(){
            console.log('ocultando plato: ')
            const platoRef = this.doc(this.db, 'platos', this.plato.id);
            await this.updateDoc(platoRef, {
                visible: !this.plato.visible
            })
        },
        editarPlato(){
            console.log('editar plato')
            this.formEditar = true
            this.ocultarOpciones()

        },//editarPlato
        cerrarEditar(){
            this.formEditar = false
        },
        mostrarOpciones(){
            console.log('Mostrando opciones: ',this.plato.nombre)
            this.options = true
        },
        ocultarOpciones(){
            console.log('ocultando')
            setTimeout(() => {
                this.options = false
            }, 200);
        },
        async deletePlato(){
            this.deleting = true
            const platoRef = this.doc(this.db, 'platos', this.plato.id)
            this.platoRef = platoRef
            await this.deleteDoc(platoRef)
            .then((resp)=>{
                console.log('Plato eliminado',this.plato.nombre)
                this.ocultarOpciones()
                this.deleting = false
            })
            .catch((error)=>{
                console.log('Ha ocurrido un error: ', error)
                this.deleting = false
            })

            const desertRef = this.ref(this.storage, `plato_${this.plato.id}`);

            // Delete the file
            this.deleteObject(desertRef).then(() => {
            // File deleted successfully
            }).catch((error) => {
            // Uh-oh, an error occurred!
            });

        },//deletePlato

    },//methods

}
</script>

<style scoped>
.variantes{
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 5px;
    align-items: center;
}
.plato-container{
    width: 100%;
    height: 430px;
    max-width: 500px;
    background-color: whitesmoke;
    margin-bottom: 10px;
    display: grid;
    align-items: end;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    /* como puedo aliniar los elementos que estan dentro (.nombre-precio y descripcion) al bottom */
}

.nombre-plato{
    font-family: var(--font-6);
}

.plato-info{
    box-sizing: border-box;
    padding: 10px;
    /* background-image: linear-gradient(#00000000, #000000); */
    color: white;
    box-sizing: border-box;
    padding-top: 50px;
}

.no-img{
    border-bottom: solid gainsboro 1px;
}

.nombre-precio{
    font-weight: 900;
    display: grid;
    grid-template-columns: 1fr auto;
    margin-bottom: 10px;
    font-size: 18pt;
    font-family: var(--font-6);
}
.descripcion{
    font-family: var(--font-3);
}

</style>