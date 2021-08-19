<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke="color">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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