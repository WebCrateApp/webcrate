<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <path :fill="color" d="m88.22837,49.15743c0,-20.26882 -16.43849,-36.70731 -36.70731,-36.70731s-36.70731,16.43849 -36.70731,36.70731m6.22428,0c0,-16.75769 13.56574,-30.48303 30.48303,-30.48303s30.48303,13.72535 30.48303,30.48303">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="1s"
        from="0 50 50"
        to="360 50 50"
        repeatCount="indefinite"
      />
    </path>
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