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
        let arr = res.data
        let max = 0;
        let maxKey = 0;
        if(arr){
          for (let key in arr) {
            if(arr[key][0]>max){
              max = arr[key][0]
              maxKey = key
            }
          }
          console.log(maxKey)
          this.init_chess_by_status(maxKey)
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
