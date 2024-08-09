<template>
  <div class="icon-container">
    <LoginIcon class="icon-one"/>
    <span>Admin</span>
  </div>
</template>

<script>
import LoginIcon from './icons/LoginIcon.vue'
export default {
    name: 'LoginButton',
    components: {
        LoginIcon
    }
}
</script>

<style>

</style>