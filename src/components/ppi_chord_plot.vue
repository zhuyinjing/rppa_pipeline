<template>
  <div class="">

      <imgMenuShowComp></imgMenuShowComp>

      <degComp></degComp>

      <ppiComp></ppiComp>

    </div>

</template>

<script>
import degComp from './degComp.vue'
import imgMenuShowComp from './imgMenuShowComp.vue'
import ppiComp from './ppiComp.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    degComp,
    imgMenuShowComp,
    ppiComp
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped="true">
</style>
