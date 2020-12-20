<template>
  <div id="canvasWrap">
      <div id="currActive">红方</div>
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
      chess.init({},"canvas");
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
