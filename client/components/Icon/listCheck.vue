<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="color">
    <path d="M11 4h10v2H11V4zm0 4h6v2h-6V8zm0 6h10v2H11v-2zm0 4h6v2h-6v-2zM3 4h6v6H3V4zm2 2v2h2V6H5zm-2 8h6v6H3v-6zm2 2v2h2v-2H5z" />
  </svg>
</template>

<script>
export default {
	props: {
		color: {
			type: String,
			default: 'currentColor'
		}
	}
}
</script>