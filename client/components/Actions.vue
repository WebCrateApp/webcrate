<template>
  <div class="actions">
    <button v-for="button in buttons" :key="button.id || button.text" class="button" @click.stop="button.click">
      <Icon :name="button.icon" />
      <span v-if="button.showText">{{ button.text }}</span>
    </button>
    <ActionDropdown v-if="dropdowns && dropdowns.length > 0" class="dropdown-action" icon="dotsV" :actions="dropdowns" />
  </div>
</template>

<script>
export default {
	props: {
		actions: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			windowSize: undefined
		}
	},
	computed: {
		buttons() {
			return this.actions.filter((action) => {
				return !action.dropdown && action.show
			})
		},
		dropdowns() {
			return this.actions.filter((action) => {
				return action.dropdown && action.show
			})
		}
	}
}
</script>

<style lang="scss" scoped>
    .actions {
		margin-left: auto;
		display: flex;

		& .button {
			margin-right: 0.5rem;
			display: flex;
			align-items: center;
			flex-shrink: 0;

			& span {
				margin-left: 0.5rem;
			}
		}
	}
</style>