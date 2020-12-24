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
import {getSuggest,learn} from "@/api/chessApi";
import chessBus from "@/bus/chessBus";
import {generatorStatusByChess, generatorStatusByMove} from "@/utils/ChessGenerator";
import {group} from "@/utils/stringUtil";
import {get_chess_arr_red, get_chess_arr_black, chess_arr_red, chess_arr_black} from "@/utils/ChessConfig";

let chess = new Chess()

export default {
  name: "Chess",
  data() {
    return {
      currentRole: "red",
      currentStatus: ""
    }
  },
  methods: {
    init_chess(){
      chess.init({
        chessboardStatus: ""
      },"canvas");
      this.currentStatus = generatorStatusByChess(chess.chess_arr_all)
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
          let str_arr = group(status,2);
          if(str_arr[4] == 99)
            this.$message.warning("你输了")
          this.init_chess_by_status(status)
          chess.currActive = "red"
          this.currentRole = "red"
        }else{
          this.$message.info("no data or game is over")
        }
      })
    },
    learn(status,move) {
      learn(status,move).then(res => {
        this.$message.success(res.data.message)
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
      this.currentStatus = status
      this.getSuggest(status)
    })
    chessBus.$on('needLearn',move => {
      console.log("learn" + move + ",currentStatus="+this.currentStatus)
      this.learn(this.currentStatus,move)
    })
    chessBus.$on("over",() => {
      this.init_chess_by_status("8979695949392919097717866646260600102030405060708012720323436383")
      chess.currActive = "red"
      this.currentRole = "red"
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
