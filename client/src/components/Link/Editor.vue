<template>
  <div>
    <bubble-menu v-if="editor && editable" :editor="editor" class="bubble-menu">
      <Icon name="bold" :class="{ 'is-active': editor.isActive('bold') }" @click.native="editor.chain().focus().toggleBold().run()" />
      <Icon name="italic" :class="{ 'is-active': editor.isActive('italic') }" @click.native="editor.chain().focus().toggleItalic().run()" />
      <Icon name="strikethrough" :class="{ 'is-active': editor.isActive('strike') }" @click.native="editor.chain().focus().toggleStrike().run()" />
      <Icon name="code" :class="{ 'is-active': editor.isActive('code') }" @click.native="editor.chain().focus().toggleCode().run()" />
      <div class="divider"></div>
      <Icon name="h1" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click.native="editor.chain().focus().toggleHeading({ level: 1 }).run()" />
      <Icon name="h2" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click.native="editor.chain().focus().toggleHeading({ level: 2 }).run()" />
      <Icon name="paragraph" :class="{ 'is-active': editor.isActive('paragraph') }" @click.native="editor.chain().focus().setParagraph().run()" />
      <Icon name="link" :class="{ 'is-active': editor.isActive('link') }" @click.native="setLink" />
      <div class="divider"></div>
      <Icon name="listUnordered" :class="{ 'is-active': editor.isActive('bulletList') }" @click.native="editor.chain().focus().toggleBulletList().run()" />
      <Icon name="listOrdered" :class="{ 'is-active': editor.isActive('orderedList') }" @click.native="editor.chain().focus().toggleOrderedList().run()" />
      <Icon name="listCheck" :class="{ 'is-active': editor.isActive('taskList') }" @click.native="editor.chain().focus().toggleTaskList().run()" />
      <Icon name="doubleQuote" :class="{ 'is-active': editor.isActive('blockquote') }" @click.native="editor.chain().focus().toggleBlockquote().run()" />
    </bubble-menu>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'

export default {
	components: {
		EditorContent,
		BubbleMenu
	},

	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: 'Edit text'
		},
		editable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			editor: null
		}
	},

	watch: {
		value(value) {
			const isSame = this.editor.getHTML() === value

			if (isSame) {
				return
			}

			this.editor.commands.setContent(value, false)
		}
	},

	mounted() {
		this.editor = new Editor({
			editable: this.editable,
			extensions: [
				StarterKit,
				TaskList,
				TaskItem,
				Link.configure({
					linkOnPaste: true
				}),
				Placeholder.configure({
					placeholder: this.placeholder
				})
			],
			content: this.value,
			onUpdate: () => {
				this.$emit('input', this.editor.getHTML())
			},
			editorProps: {
				attributes: {
					class: 'editor'
				}
			}
		})
	},

	beforeUnmount() {
		this.editor.destroy()
	},

	methods: {
		async setLink() {
			const previousUrl = this.editor.getAttributes('link').href
			console.log(previousUrl)
			const url = await this.$prompt({
				title: previousUrl ? 'Change the URL' : `Enter a URL`,
				confirmText: 'Save URL',
				placeholder: 'https://',
				value: previousUrl
			})

			console.log(url)

			// cancelled
			if (url === null) {
				return
			}

			// empty
			if (url === '') {
				this.editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.unsetLink()
					.run()

				return
			}

			// update link
			this.editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: url })
				.run()
		}
	}
}
</script>

<style lang="scss">
	.ProseMirror {
		> * + * {
			margin-top: 0.5em;
		}

		&.editor {
			outline: none;
		}

		ul,
		ol {
			padding: 0 1rem;
		}

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			line-height: 1.1;
		}

		h1 {
			font-size: 25px;
		}

		h2 {
			font-size: 21px;
		}

		a {
			color: var(--accent);
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}

		code {
			background-color: var(--background-2nd);
			color: var(--text-light);
			padding: 0.2rem 0.2rem;
		}

		pre {
			background: #0D0D0D;
			color: #FFF;
			font-family: 'JetBrainsMono', monospace;
			padding: 0.75rem 1rem;
			border-radius: 0.5rem;

			code {
				color: inherit;
				padding: 0;
				background: none;
				font-size: 0.8rem;
			}
		}

		img {
			max-width: 100%;
			height: auto;
		}

		hr {
			margin: 1rem 0;
		}

		blockquote {
			padding-left: 1rem;
			border-left: 2px solid var(--grey);
			color: var(--text-light);
		}

		ul[data-type="taskList"] {
			list-style: none;
			padding: 0;

			li {
				display: flex;
				align-items: center;

				> label {
					flex: 0 0 auto;
					margin-right: 0.5rem;
				}
			}
		}
	}

	.ProseMirror p.is-editor-empty:first-child::before {
		content: attr(data-placeholder);
		float: left;
		color: var(--text-light);
		pointer-events: none;
		height: 0;
	}

	.bubble-menu {
		display: flex;
		border: 2px solid var(--grey);
		background-color: var(--background-2nd);
		padding: 0.5rem;
		border-radius: var(--border-radius);

		div {
			border: none;
			background: none;
			color: var(--text-dark);
			font-size: 0.85rem;
			font-weight: 500;
			margin: 0.2rem;
			opacity: 0.5;
			transition: opacity .2s ease;

			&:hover,
			&.is-active {
				opacity: 1;
				transition: none;
			}
		}

		.divider {
			width: 2px;
			height: 1.25rem;
			background-color: #0000001a;
			margin-left: .5rem;
			margin-right: .75rem;
		}
	}
</style>