<template>
  <div>
    <ModalSearch v-if="showModal && showModal.search" />
    <ModalAddLink v-else-if="showModal && showModal.addLink" />
    <ModalAddCrate v-else-if="showModal && showModal.addCrate" />
    <ModalAddExternalCrate v-else-if="showModal && showModal.addExternalCrate" />
    <ModalLinkDetails v-else-if="showModal && showModal.linkDetails" />
    <ModalChangeName v-else-if="showModal && showModal.changeName" />
    <ModalCopyOutput v-else-if="showModal && showModal.copyOutput" />
    <ModalShareLink v-if="showModal && showModal.shareLink" />
    <ModalBookmarklet v-if="showModal && showModal.bookmarklet" />

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