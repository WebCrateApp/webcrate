<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke="color">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19.74713,9.71837l0,-5.16636m0,0l-5.16636,0m5.16636,0l-6.45795,6.45795m-9.16179,3.88575l0,5.16636m0,0l5.16636,0m-5.16636,0l6.45795,-6.45795m11.41041,8.81626" />
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