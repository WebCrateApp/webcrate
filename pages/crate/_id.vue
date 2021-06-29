<template>
  <div>
    <p>Id: {{ id }}</p>
  </div>
</template>

<script>
export default {
  asyncData ({ params }) {
    return { id: params.id }
  }
}
</script>
