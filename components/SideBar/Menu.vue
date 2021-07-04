<template>
  <div class="sidemenu">
    <div class="headline">
      <h1>Maxi's WebCrate</h1>
    </div>
    <hr>
    <div class="menus">
      <SideBarMenuItem name="Home" icon="home" :selected="currentCrate === 'home'" @click.native="currentCrate = 'home'" />
      <SideBarMenuItem name="Today" :count="20" icon="calendar" :selected="currentCrate === 'today'" @click.native="currentCrate = 'today'" />
    </div>
    <div class="section-title">
      <h4>My Crates</h4>
    </div>
    <div class="menus">
      <SideBarMenuItem name="Read Later" emoji="📕" :selected="currentCrate === 'readLater'" @click.native="currentCrate = 'readLater'" />
      <SideBarMenuItem name="Design Resources" emoji="👩‍💻" :selected="currentCrate === 'design'" @click.native="currentCrate = 'design'" />
      <SideBarMenuItem name="Web Dev" emoji="💻" :selected="currentCrate === 'webDev'" @click.native="currentCrate = 'webDev'" />
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			currentCrate: 'home'
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
	}

	.headline {
		text-align: center;

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
		text-align: left;
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
</style>