<template>
  <div>
    <ModalSearch v-if="showModal === 'search'" />
    <ModalAddLink v-else-if="showModal === 'addLink'" />
    <ModalAddCrate v-else-if="showModal === 'addCrate'" />
    <ModalAddExternalCrate v-else-if="showModal === 'addExternalCrate'" />
    <ModalLinkDetails v-else-if="showModal === 'linkDetails'" />
    <ModalCopyOutput v-else-if="showModal === 'copyOutput'" />
    <ModalChangeName v-else-if="showModal === 'changeName'" />
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