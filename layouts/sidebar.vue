<template>
  <div>
    <ModalSearch v-if="showSearchModal" />
    <ModalAddLink v-if="showAddLinkModal" />
    <ModalAddCrate v-if="showAddCrateModal" />
    <ConfirmModal />
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
	computed: {
		showSearchModal() {
			return this.$store.state.modals.search
		},
		showAddLinkModal() {
			return this.$store.state.modals.addLink
		},
		showAddCrateModal() {
			return this.$store.state.modals.addCrate
		}
	},
	created() {
		this.loadingCrates = true
		this.$store.dispatch('GET_CRATES').then(() => {
			this.loadingCrates = false
		})
	}
}
</script>