<script setup>
import {defineProps} from "vue";
defineProps({
  classes: String,
});
</script>

<template>
  <div
    class="p-4 bg-white rounded-md flex flex-col w-5/6 gap-5 max-w-[900px] mx-auto"
    :class="[classes, classes?.includes('absolute') ? '' : 'relative']"
  >
    <slot></slot>
  </div>
</template>
