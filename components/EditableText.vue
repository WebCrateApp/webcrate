<template>
  <p ref="editable" contenteditable v-on="listeners">
    {{ !value ? placeholder : prepend }}{{ value }}
  </p>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		prepend: {
			type: String,
			default: ''
		}
	},
	computed: {
		listeners() {
			return {
				...this.$listeners,
				input: this.onInput
			}
		}
	},
	mounted() {
		this.$refs.editable.innerText = this.value
	},
	methods: {
		onInput(e) {
			this.$emit('input', e.target.innerText)
		}
	}
}

</script>