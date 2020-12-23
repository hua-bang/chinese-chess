<template>
  <div id="canvasWrap">
      <h2>到<b :class="currentRole=='red'?'red':''">{{currentRole=='red'?"红方":"黑方"}}</b>下棋</h2>
      <canvas id="canvas" width="500" height="550"></canvas>
      <div id="panel">
        <ul id="ul"></ul>
      </div>
  </div>
</template>

<script>
import Chess from "../utils/Chess"
import {getSuggest} from "@/api/chessApi";
import chessBus from "@/bus/chessBus";
import {generatorStatusByMove} from "@/utils/ChessGenerator";

const chess = new Chess()

export default {
  name: "Chess",
  data() {
    return {
      currentRole: "red"
    }
  },
  methods: {
    init_chess(){
      chess.init({
        chessboardStatus: ""
      },"canvas");
    },
    init_chess_by_status(status) {
      chess.update_chess_by_status(status)
    },
    getSuggest(status){
      getSuggest(status).then(res => {
        let chess_arr = res.data.data
        if(chess_arr.length>0){
          let initStatus = chess_arr[0].init;
          let move = chess_arr[0].moveInit
          let status = generatorStatusByMove(initStatus,move)
          this.init_chess_by_status(status)
          chess.currActive = "red"
          this.currentRole = "red"
        }else{
          this.$message.info("no data or game is over")
        }
      })
    }
  },
  created() {

  },
  mounted() {
    this.init_chess()
    chessBus.$on('currentPlayerChange', role => this.currentRole = role)
    chessBus.$on('chessboardStatusChange', status => {
      console.log(status)
      this.getSuggest(status)
    })
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
.red{
  color: red;
}
</style>
