<template>
  <div class="icon-container">
    <WhatsappIcon class="icon-one"/>
    <a :href="urlWithText" target="_blank">Ayuda/Info</a>
  </div>
</template>

<script>
    import WhatsappIcon from './icons/WhatsappIcon.vue';

    export default {
    inject: ['globalUser'],
    name: 'ContactSupportButton',
    components: {
        WhatsappIcon
    },
    data() {
        return {
        url: 'https://wa.me/+4792486558',
        text: ''
        }
    },
    computed: {
        urlWithText() {
        return `${this.url}?text=Hola,%0A%0ANecesito%20información%20sobre%20los%20menús%20digitales.%0A%0A${this.globalUser.name}`;
        }
    },
    mounted() {
        this.text = `Hola, %0ANecesito ayuda/info sobre el menú digital.%0A%0A${this.globalUser.name}`;
    }
    }
</script>

<style>

</style>