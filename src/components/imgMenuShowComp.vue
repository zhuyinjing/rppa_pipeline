<template>
  <div class="">
    <img v-show="$store.state.menuShow" class="cursor-pointer imgShowStyle" src="../assets/img/menu.png" @click="hideMenu()">
    <img v-show="!$store.state.menuShow" class="cursor-pointer imgHideStyle" src="../assets/img/menu.png" @click="showMenu()">
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    hideMenu () {
      this.$store.commit("setmenuShow", false)
    },
    showMenu () {
      this.$store.commit("setmenuShow", true)
    },
  }
}
</script>

<style scoped="true">
.imgShowStyle {
  width:20px;
  position:absolute;
  left:300px;
  top:60px;
}
.imgHideStyle {
  width:20px;
  position:absolute;
  left:0px;
  top:60px;
}
</style>
