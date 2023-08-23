<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke="color">
    <path id="svg_1" d="m4,16l4.586,-4.586a2,2 0 0 1 2.828,0l4.586,4.586m-2,-2l1.586,-1.586a2,2 0 0 1 2.828,0l1.586,1.586m-14,6l12,0a2,2 0 0 0 2,-2l0,-12a2,2 0 0 0 -2,-2l-12,0a2,2 0 0 0 -2,2l0,12a2,2 0 0 0 2,2z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    <line
      id="svg_2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      y2="2.43013"
      x2="21.51939"
      y1="21.48731"
      x1="2.46221"
      stroke-width="2"
    />
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