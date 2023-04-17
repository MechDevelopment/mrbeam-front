<template>
  <button type="button" @click="changeTheme">
    <nuxt-icon :name="isDark ? 'sun' : 'moon'" filled />
    <span class="sr-only">Change Theme</span>
  </button>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const changeTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 32px;
  background-color: transparent;
  cursor: pointer;
  color: inherit;

  .nuxt-icon :deep(svg) {
    width: 24px;
    height: 24px;
  }
}
</style>
