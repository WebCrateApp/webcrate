<template>
  <div>
    <ModalWrapper />
    <Help />
    <SideBar>
      <template #content>
        <Nuxt />
      </template>
      <template #sidebar>
        <SideBarMenuPublic />
      </template>
    </SideBar>
  </div>
</template>

<script>
export default {
}
</script>