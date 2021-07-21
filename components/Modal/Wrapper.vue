<template>
  <div>
    <ModalSearch v-if="showModal === 'search'" />
    <ModalAddLink v-else-if="showModal === 'addLink'" />
    <ModalAddCrate v-else-if="showModal === 'addCrate'" />
    <ModalLinkDetails v-else-if="showModal === 'linkDetails'" />
    <ModalLinkDetailsPublic v-else-if="showModal === 'linkDetailsPublic'" />
    <ModalCopyOutput v-else-if="showModal === 'copyOutput'" />
    <ConfirmModal />
  </div>
</template>

<script>
export default {
	computed: {
		showModal() {
			return this.$modal.getShown()
		}
	}
}
</script>