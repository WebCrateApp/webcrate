<template>
  <div>
    <transition :name="sideBarTransition">
      <div v-if="showSideMenu" key="menu" v-click-outside="hide" class="wrapper">
        <div v-if="showAsOverlay" class="header">
          <Icon name="close" class="close-icon" @click.native="hide" />
        </div>
        <slot name="sidebar"></slot>
      </div>
      <div v-else key="button" @click.stop="show">
        <Icon name="menu" class="menu-icon" />
      </div>
    </transition>
    <div class="content" :class="{ 'moveContent': !showAsOverlay && showSideMenu, 'isOverlay': showAsOverlay, 'moveBelowIcon': mobile }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ClickOutside from 'vue-click-outside'

export default Vue.extend({
	directives: {
		ClickOutside
	},
	data() {
		return {
			mobile: false,
			showAsOverlay: false,
			enableTransition: false
		}
	},
	computed: {
		showSideMenu() {
			return this.mobile === false || this.showAsOverlay === true
		},
		sideBarTransition() {
			return this.enableTransition ? 'sidebar' : 'disabled'
		}
	},
	mounted() {
		// Only enable transition after first load
		setTimeout(() => {
			this.enableTransition = true
		}, 500)

		const onResize = () => {
			this.mobile = window.innerWidth <= 800

			// If we switch from mobile to desktop, don't show menu as overlay anymore
			if (this.mobile === false) { this.showAsOverlay = false }
		}

		onResize()

		window.onresize = onResize
	},
	methods: {
		hide() {
			if (this.showAsOverlay) {
				this.showAsOverlay = false
			}
		},
		show() {
			if (!this.showAsOverlay) {
				this.showAsOverlay = true
			}
		}
	}
})
</script>

<style lang="scss" scoped>
	.menu-icon {
		position: fixed;
		left: 1rem;
        top: 1rem;
		cursor: pointer;
		z-index: 99;
	}

	.wrapper {
		position: fixed;
		left: 0;
        top: 0;
        height: 100vh;
        width: 280px;
        z-index: 100;
		background-color: var(--background-2nd);
		display: flex;
		flex-direction: column;
	}

	.header {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
	}

	.content {
		position: relative;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.footer {
		margin-top: auto;
	}

	.nav-menu {
		padding: 5px 0;
	}

	.close-icon {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}

	.moveContent {
		transition: margin-left .3s ease-in-out;
		margin-left: 280px;
	}

	.isOverlay {
		opacity: 0.8;
	}

	.moveBelowIcon {
		transition: margin-top .2s ease-in-out;
		padding-top: 3rem;
	}

	.sidebar-enter-active{
		left: 0;
		opacity: 1;
		transition-property: left, opacity;
		transition-duration: .3s, .5s;
		transition-timing-function: ease-in-out;
    }

	.sidebar-leave-active {
		left: 0;
		opacity: 1;
		transition-property: left, opacity;
		transition-duration: .3s, .2s;
		transition-timing-function: ease-in-out;
    }

    .sidebar-enter,
	.sidebar-leave-to {
		left: -280px;
		opacity: 0;
    }
</style>