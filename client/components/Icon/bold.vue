<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="color">
    <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z" />
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