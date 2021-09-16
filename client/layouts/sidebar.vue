<template>
  <div>
    <ModalWrapper />
    <Help :is-public="isPublic" />
    <SideBar v-if="!isPublic">
      <template #content>
        <Nuxt />
      </template>
      <template #sidebar>
        <SideBarMenu />
      </template>
    </SideBar>
    <Nuxt v-else />
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

		this.$store.dispatch('GET_CONFIG').then((config) => {
			if (config && config.didUpdate) {
				this.$modal.show('changelog')
			}
		})

		if (!this.isPublic) {
			this.loadingCrates = true
			this.$store.dispatch('GET_CRATES', 0).then(() => {
				setTimeout(() => {
					this.loadingCrates = false
				}, 500)
			})

			this.$store.dispatch('GET_EXTERNAL_CRATES')
		}
	}
}
</script>