<template>
  <div>
    <ModalWrapper />
    <Help />
    <SideBar>
      <template #content>
        <Nuxt />
      </template>
      <template #sidebar>
        <SideBarMenuPublic v-if="isPublic" />
        <SideBarMenu v-else />
      </template>
    </SideBar>
  </div>
</template>

<script>
export default {
	data() {
		return {
			isPublic: false
		}
	},
	computed: {
		loadingCrates: {
			set(value) {
				this.$store.commit('SET_LOADING_CRATES', value)
			},
			get() {
				return this.$store.state.loadingCrates
			}
		}
	},
	created() {
		this.isPublic = this.$route.path.includes('public')

		if (!this.isPublic) {
			this.loadingCrates = true
			this.$store.dispatch('GET_CRATES').then(() => {
				setTimeout(() => {
					this.loadingCrates = false
				}, 500)
			})

			this.$store.dispatch('GET_EXTERNAL_CRATES')
		}
	}
}
</script>