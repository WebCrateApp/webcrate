<template>
  <a :href="href" target="_blank" rel="noopener" class="feature">
    <Icon :name="icon" />
    <div class="text">
      <p class="title">
        {{ title }}
      </p>
      <p class="description">
        {{ description }}
      </p>
    </div>
  </a>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
	props: {
		title: String,
		description: String,
		icon: String,
		href: String
	}
}
</script>

<style lang="scss" scoped>
    .feature {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        padding: 1rem;
        padding-right: 1.5rem;
        background: var(--background-2nd);
        border-radius: var(--border-radius);
        flex-shrink: 0;
        min-width: 350px;

        & .icon-wrapper {
            flex-shrink: 0;
            margin-right: 1rem;
        }

        & .title {
            font-weight: 550;
        }

        & .description {
            color: var(--text-light);
        }
    }
</style>