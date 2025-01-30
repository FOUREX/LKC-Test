<script>
export default {
  props: {
    role: {
      type: String,
      required: true,
      default: "user",
    },
    content: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    }
  }
}  // this.received ? { marginRight: 'auto' } : {marginLeft: 'auto'}
</script>

<template>
  <div
      class="px-2 py-2 rounded-[.5rem] bg-[#303030] max-w-[90%] whitespace-normal break-words"
      :style="{
        ...(this.role === 'user' ? {marginLeft: 'auto'} : { marginRight: 'auto' }),
        color: this.error ? 'red' : 'white',
      }"
  >
    {{ this.content }}
  </div>
</template>

<style scoped>

</style>