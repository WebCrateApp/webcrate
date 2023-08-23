<template>
  <div ref="container" v-images-loaded:on.progress="imagesLoaded" class="vsg-container">
    <slot class="test"></slot>
  </div>
</template>

<script>
import imagesLoaded from 'vue-images-loaded'

export default {
	directives: {
		imagesLoaded
	},
	props: {
		columnMinWidth: {
			type: Number,
			required: true
		},
		gutterWidth: {
			type: Number,
			default: 0
		},
		gutterHeight: {
			type: Number,
			default: 0
		},
		monitorImagesLoaded: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			containerWidth: 0,
			columnCount: 0,
			columnWidth: 0,
			baseColumns: []
		}
	},
	watch: {
		$$children(newVal) {
			console.log(newVal)
		}
	},
	mounted() {
		window.addEventListener('resize', this.reflow)
		this.update()
	},
	destroyed() {
		window.removeEventListener('resize', this.reflow)
	},
	methods: {
		updateColumnData() {
			this.containerWidth = this.getContainerWidth()
			this.columnCount = this.getColumnCount()
			this.columnWidth = this.getColumnWidth()
		},
		getContainerWidth() {
			return this.$refs.container ? this.$refs.container.clientWidth : 0
		},
		getColumnCount() {
			for (let i = 1; true; i++) {
				const w = i * this.columnMinWidth + (i - 1) * this.gutterWidth
				if (w > this.containerWidth)
					return Math.max(i - 1, 1)
			}
		},
		getColumnWidth() {
			return (this.containerWidth - (this.columnCount - 1) * this.gutterWidth) / this.columnCount
		},
		getBaseColumns() {
			const cols = []
			for (let i = 0; i < this.columnCount; i++)
				cols.push({
					x: i * (this.columnWidth + this.gutterWidth),
					h: 0
				})
			return cols
		},
		update() {
			this.$nextTick(this.reflow)
		},
		reflow() {
			this.updateColumnData()
			const cols = this.getBaseColumns()
			this.$emit('reflow', {
				containerWidth: this.containerWidth,
				columnCount: this.columnCount,
				columnWidth: this.columnWidth
			})
			this.$children.forEach((child, i) => {
				if (!child.$el.style) return

				// console.log(child.$el)
				child.$el.style.width = this.columnWidth + 'px'
				let n = 0
				if (i < this.columnCount)
					n = i
				else {
					let minH = -1
					cols.forEach((col, j) => {
						if ((minH === -1) || (col.h < minH)) {
							n = j
							minH = col.h
						}
					})
				}
				child.$el.style.transform = 'translate(' + cols[n].x + 'px, ' + cols[n].h + 'px)'
				cols[n].h += child.$el.offsetHeight + this.gutterHeight
			})
			let containerHeight = 0
			// eslint-disable-next-line no-return-assign
			cols.forEach((col) => containerHeight = Math.max(containerHeight, col.h))
			this.$el.style.height = containerHeight + 'px'
		},
		imagesLoaded() {
			this.$emit('images-loaded')
			if (this.monitorImagesLoaded)
				this.reflow()
		}
	}
}
</script>

<style lang="scss" scoped>
	.vsg-container {
		display: block;
		position: relative;
		width: 100%;

		& div {
			position: absolute;
			top: 0;
			left: 0;
			padding: 0.5rem;
		}
	}
</style>