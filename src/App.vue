<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

let isRouterAlive = ref(true)
const reload = () => { this.isRouterAlive = false; this.$nextTick(function () { this.isRouterAlive = true })}
</script>

<template>
  <RouterView v-if="isRouterAlive" />
</template>