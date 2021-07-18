<template>
  <div class="action-dropdown">
    <button class="button" @click.stop="showMenu = !showMenu">
      <Icon :name="icon" />
    </button>
    <div v-if="showMenu" v-click-outside="closeMenu" class="menu">
      <div v-for="action in actions" :key="action.text" class="menu-item" @click.stop="action.click">
        <Icon :name="action.icon" />
        <span>{{ action.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	directives: {
		ClickOutside
	},
	props: {
		icon: {
			type: String,
			default: 'dotsV'
		},
		actions: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			showMenu: false
		}
	},
	methods: {
		closeMenu() {
			this.showMenu = false
		}
	}
}

</script>

<style lang="scss" scoped>
	.action-dropdown {
		margin-left: auto;
		display: flex;
		align-items: center;
		position: relative;

		& button {
			display: flex;
			align-items: center;
		}
	}

	.menu {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 3rem;
		background: var(--background-2nd);
		border-radius: var(--border-radius);
		border: 2px solid var(--grey);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		& .menu-item {
			display: flex;
			align-items: center;
			width: 200px;
			padding: 0.8rem 1rem;
			transition: background .2s ease;
			cursor: pointer;
			font-size: 0.9rem;

			& div {
				margin-right: 0.5rem;
			}

			& span {
				flex-shrink: 0;
			}

			&:hover {
				background: var(--grey);
				transition: none;
			}
		}
	}
</style>