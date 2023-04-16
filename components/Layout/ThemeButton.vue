<template>
  <button @click="onChangeTheme" type="button">
    {{ translate('change_theme') }}
  </button>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const { translate } = useLocale()

const onChangeTheme = () => {
  const isDark = colorMode.value === 'dark'
  colorMode.preference = isDark ? 'light' : 'dark'
}
</script>
