<template>
  <div class="icon-wrapper" :style="{ '--size': size }">
    <NuxtDynamic :component="`Icon${ capitalize(name) }`" :color="color" />
  </div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: undefined
		},
		color: {
			type: String,
			default: 'currentColor'
		},
		size: {
			type: String,
			default: '20px'
		}
	},
	methods: {
		capitalize(s) {
			return s && s[0].toUpperCase() + s.slice(1)
		}
	}
}
</script>

<style scoped>
    .icon-wrapper {
        width: var(--size);
        height: var(--size);
    }
</style>