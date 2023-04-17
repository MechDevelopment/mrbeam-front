<template>
  <header>
    <nav>
      <nuxt-link to="/" class="logo">Mr Beam</nuxt-link>
      <AppTheme />
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  padding: 12px 0;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 24px;
  }
}
</style>
