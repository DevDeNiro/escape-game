<template>
  <button
    @click="action"
    class="font-bold py-2 px-4 rounded border-2"
    :class="[
      classes,
      isSecondary
        ? 'bg-white text-blue-500 border-blue-500'
        : 'bg-blue-500 border-transparent hover:bg-blue-700 text-white',
    ]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    action: Function,
    classes: String,
    isSecondary: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
