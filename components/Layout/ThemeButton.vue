<template>
  <button @click="onChangeTheme" type="button">Change Theme</button>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()

const onChangeTheme = () => {
  const isDark = colorMode.value === 'dark'
  colorMode.preference = isDark ? 'light' : 'dark'
}
</script>
