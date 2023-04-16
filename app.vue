<template>
  <NuxtLayout />
</template>

<script lang="ts" setup>
const { locale, getDictionaryAsync } = useLocale()

useAsyncData(async () => {
  await Promise.all([getDictionaryAsync()])

  useHead({
    title: 'Mr Beam',
    htmlAttrs: {
      lang: locale.value || 'en',
    },
  })

  return true
})
</script>
