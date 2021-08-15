<!-- Adapted from https://github.com/Cobertos/vue-input-contenteditable - Copyright 2019 Peter Fornari / "Cobertos" -->
<template>
  <component
    :is="elem"
    ref="contenteditable"
    contenteditable
    :placeholder="placeholder"
    @input="onInput"
    @keydown="$emit('keydown', $event)"
    @keyup="$emit('keyup', $event)"
    @keypress="$emit('keypress', $event)"
  />
</template>

<script>
export default {
	name: 'InputContenteditable',
	props: {
		elem: {
			type: String,
			default: 'p'
		},
		placeholder: {
			type: String,
			default: ''
		},
		value: {
			type: String,
			required: true
		},
		maxlength: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {
			lastText: this.value // Initally set to value if exists
		}
	},
	watch: {
		value() {
			if (this.value !== this.$refs.contenteditable.innerText) {
				// Will reset cursor position, so only do this when the external component
				// completely changes the value (so not something caused by emitting the input event
				// and the reactivity framework)
				// TODO: Get smarter about this?
				this.$refs.contenteditable.textContent = this.value
			}
		}
	},
	mounted() {
		this.$refs.contenteditable.textContent = this.value
	},
	methods: {
		// eslint-disable-next-line no-unused-vars
		onInput(_e) {
			const text = this.$refs.contenteditable.textContent
			// enforce a maxlength
			if (this.maxlength !== -1) {
				// I chose this instead of preventDefault on 'keydown', 'paste', 'drop' as if we preventDefault
				// we need to check a bunch of specific valid cases to pass through like backspace, delete
				// Ctrl+A, A Ctrl+V that makes the text shorter, arrow keys, etc. which may be impossible...
				//
				// Instead, retroactively trimming the string after 'input' and setting the cursor properly
				// (as changing the text string will change the cursor in some browsers... :( ) is a better bet
				// IMO. Current method was tested in Chrome, FF, and Android
				const selection = window.getSelection()
				const {
					anchorNode,
					anchorOffset
				} = selection
				if (text.length > this.maxlength) {
					// Find the cursor position inside the contenteditable. Can't use anchorOffset
					// because Firefox will add multiple text nodes when pasting sometimes
					// (and then collapse them later? it's kind of weird...)
					const textNodes = Array.from(this.$refs.contenteditable.childNodes)
					// eslint-disable-next-line multiline-ternary
					const realAnchorOffset = textNodes.length <= 1 ? anchorOffset : (
						textNodes
							// Collect all nodes up to, but not including, anchorNode
							.slice(0, textNodes.indexOf(anchorNode))
							// Map them all to their length
							.map((n) => n.textContent.length)
							// Sum them together
							.reduce((acc, itm) => acc + itm, 0) +
							// And then add the final offset in the final node
							anchorOffset)
					// Use either the lastText if exists, or the current text but trimmed
					const newTextToSet = this.lastText || text.slice(0, this.maxlength)
					// Find the last position of the cursor before the input event. Use the
					// current cursor position, and remove the difference between the untrimmed text
					// and the trimmed text (to back the cursor up to the position the
					// input event happened at)
					// We can't use anchorOffset because FF likes to make new text nodes
					// for pasted text for some reason??
					let newOffsetToSet = realAnchorOffset - (text.length - newTextToSet.length)
					newOffsetToSet = Math.min(newOffsetToSet, this.maxlength) // Make sure not over maxlength
					// console.log(realAnchorOffset, anchorOffset, text.length, newTextToSet.length, this.$refs.contenteditable.childNodes.length);
					// This will reset the cursor to the start of the contenteditable _and_
					// make a new text node (so don't use anchorNode for selection.collapse())
					this.$refs.contenteditable.textContent = newTextToSet
					// Set selection using last valid offset
					selection.collapse(this.$refs.contenteditable.childNodes[0], newOffsetToSet)
					this.lastText = newTextToSet
					return
				} else {
					this.lastText = text
				}
			}
			this.$emit('input', text)
		}
	}
}

</script>

<style scoped="true">
	[contenteditable] {
		cursor: text;
		outline: 0;
	}

	[contenteditable]:empty:before {
		content: attr(placeholder);
		color: var(--text-light);
	}

</style>