<template>
  <div class="modal fade" :id="'modal_eliminar_categoria'+id" tabindex="-1" :aria-labelledby="'modal_eliminar_categoriaLabel'+id" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" :id="'modal_eliminar_categoriaLabel'+id">Eliminar Categoría</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="bt_cancelar"></button>
      </div>
      <div class="modal-body">
        <p>¿Seguro que deseas eliminar la categoría "<strong>{{nombre}}</strong>"?</p>
        <span>Después de eliminada no se puede deshacer</span>
            <LoadingIcon v-if="deleting" style="margin: auto"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="deleting">Cancelar</button>
        <button @click="deleteCategoria" type="button" class="btn btn-danger" :disabled="deleting">Eliminar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LoadingIcon from '../icons/LoadingIcon.vue'
export default {
    inject:['globalUser'],
    name: 'DeleteCategoriaModal',
    components:{
        LoadingIcon
    },
    props:{
        id:{
            type: String,
            required: true,
        },
        nombre:{
            type: String,
            required: true
        },
        img:{
            type: String,
            required: true
        }
    },
    data(){
        return{
            deleting: false
        }
    },
    methods:{
        async deleteCategoria() {
            this.$refs.bt_cancelar.click();
            this.deleting = true;

            const categoriaRef = this.doc(this.db, 'categorias', this.id);

            // Eliminar la categoría
            await this.deleteDoc(categoriaRef)
                .then(() => {
                    console.log('Se eliminó la categoría');
                })
                .catch((error) => {
                    console.log('Ha ocurrido un error al eliminar la categoría: ', error);
                    this.deleting = false;
                    return;
                });

            // Eliminar la imagen si existe
            if (this.img !== '') {
                const imgRef = this.ref(this.storage, `categoria_${this.id}`);
                this.deleteObject(imgRef)
                    .then(() => {
                        console.log('Archivo eliminado');
                    })
                    .catch((error) => {
                        console.log('Ups! Algo salió mal al eliminar el archivo: ', error);
                    });
            }

            // Eliminar todos los platos en esta categoría
            const platosQuerySnapshot = await this.getDocs(this.query(this.collection(this.db, 'platos'), this.where('categoria', '==', this.id)));

            // Iterar sobre los documentos y eliminar cada uno
            platosQuerySnapshot.forEach(async (doc) => {
                await this.deleteDoc(doc.ref)
                    .then(() => {
                        console.log('Se eliminó el plato con ID:', doc.id);
                    })
                    .catch((error) => {
                        console.log('Ha ocurrido un error al eliminar el plato con ID:', doc.id, error);
                    });
            });

            this.deleting = false;
        },//deleteCategoria
    }

}
</script>

<style>

</style>