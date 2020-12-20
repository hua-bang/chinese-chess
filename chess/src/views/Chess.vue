<template>
  <div id="canvasWrap">
      <canvas id="canvas" width="500" height="550"></canvas>
      <div id="panel">
        <ul id="ul"></ul>
      </div>
  </div>
</template>

<script>
import Chess from "../utils/Chess"
const chess = new Chess()

export default {
  name: "Chess",
  data() {
    return {

    }
  },
  methods: {
    init_chess(){
      chess.init({
        chessboardStatus: "9999299949999999249999869999999958999999519999999999999999997699"
      },"canvas");
    }
  },
  created() {

  },
  mounted() {
    this.init_chess()
  }
}
</script>

<style scoped>
#canvasWrap{
  width: 600px;
  height: 550px;
  margin: 50px auto;
}
#canvas{
  background: #EAC591;
}
</style>
