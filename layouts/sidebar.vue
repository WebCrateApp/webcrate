<template>
  <div>
    <ModalWrapper />
    <Help />
    <SideBar>
      <template #content>
        <Nuxt />
      </template>
      <template #sidebar>
        <SideBarMenu />
      </template>
    </SideBar>
  </div>
</template>

<script>
export default {
	created() {
		this.loadingCrates = true
		this.$store.dispatch('GET_CRATES').then(() => {
			this.loadingCrates = false
		})
	}
}
</script>