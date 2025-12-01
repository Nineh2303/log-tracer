<template>
  <pre
      class="p-3 rounded-lg font-mono  whitespace-pre-wrap break-words text-sm h-full overflow-scroll"
      v-html="html"
  ></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {syntaxHighlight} from "../utils/SyntaxHightLight.ts";

// Props
const props = defineProps<{
  data: any
}>()

// Tính toán JSON + highlight
const html = computed(() => {
  try {
    const pretty = JSON.stringify(props.data, null, 2)
    return syntaxHighlight(pretty)
  } catch (e: any) {
    return `<span class='text-red-600'>${e.message}</span>`
  }
})
</script>
