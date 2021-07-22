<template>
  <div class="sidemenu">
    <div class="headline">
      <h1>
        {{ username }}'s WebCrate
      </h1>
    </div>
    <hr>
    <div class="menus">
      <a href="https://webcrate.app" target="_blank" rel="noopener">
        <SideBarMenuItem name="What's WebCrate?" icon="info" />
      </a>
      <a href="https://webcrate.app/docs" target="_blank" rel="noopener">
        <SideBarMenuItem name="Create your own crate" icon="add" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			currentPage: 'Home'
		}
	},
	computed: {
		username() {
			return this.$store.state.username
		}
	},
	methods: {
		showModal(value) {
			this.$modal.show(value)
		}
	}
}
</script>

<style lang="scss" scoped>
	.sidemenu {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1rem;

		&.abs {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
		}
	}

	.headline {
		text-align: center;
		width: 100%;
		height: 26px;

		& h1 {
			font-size: 1.2rem;
		}
	}

	hr {
		margin: 1rem 0;
	}

	.menus {
		width: 100%;
	}

	.section-title {
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;

		& div {
			color: var(--text-light);
			margin-left: auto;
			transition: border .2s ease;
			border-radius: var(--border-radius);
			border: 2px solid var(--background-2nd);
			cursor: pointer;

			&:hover {
				border: 2px solid var(--grey);
				transition: none;
			}
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .1s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>