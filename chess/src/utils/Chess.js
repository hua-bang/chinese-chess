import chessBus from "../bus/chessBus"
import { chess_arr_black, chess_arr_red , get_chess_arr_black, get_chess_arr_red } from "./ChessConfig"
import { group } from "./stringUtil"
import {generatorChess, generatorStatusByChess} from "@/utils/ChessGenerator";

class Chess {

    constructor() {
        this.reset_chess()
    }

    /**
     * 初始化操作
     * @param args 传入的参数
     * @param canvasId 挂载canvas的html对象的id
     */
    init(args, canvasId) {
        // 得到画布
        this.canvasId = canvasId
        this.canvas = document.getElementById(canvasId);
        // 得到一个用于在画布上绘图的环境 2d
        this.ctx = this.canvas.getContext("2d");
        this.radius = 23;   // 棋子半径
        this.chunk = 50;    // 格子长度
        this.CandidateCircleR = 5;
        this.steps = [];
        this.chessboardStatus = args.chessboardStatus || null
        this.currActive = "red"
        this.init_background()
        this.init_chess()
        this.bind_event();
        let chessboardStatusChange = generatorStatusByChess(this.chess_arr_all);
        console.log(chessboardStatusChange)
    }

    /**
     * 画棋盘
     */
    init_background () {
        this.draw_row_line()
        this.draw_col_line();
        this.clear_boundary_rect();
        this.draw_sharp_s();
        this.draw_x()
        this.draw_text()
    }

    /**
     * 画棋子
     */
    init_chess(){
        if(this.chessboardStatus)
            this.init_chess_by_chessboard_status(this.chessboardStatus)
        else
            this.init_complete_chess()
    }

    /**
     * 根据棋局状态生成棋局
     */
    init_chess_by_chessboard_status(status) {
        let chess_arr = generatorChess(status)
        this.chess_arr_black = chess_arr.filter((v)=>{
            return v.type=="black" && v.x < 10;
        })
        this.chess_arr_red = chess_arr.filter((v)=>{
            return v.type=="red" && v.x < 10;
        })
        this.chess_arr_all = this.chess_arr_black.concat(this.chess_arr_red)
        this.draw_chess()
    }

    draw_chess(){
        const that = this
        this.chess_arr_black.map((v) => {
            v.color = "#000";
            v.bgcolor = "#fff";
            v.bgColor_b = "#000";
            v.type = "black";
            that.draw_piece(v);
            that.draw_chess_text(v);
        })
        this.chess_arr_red.map((v) => {
            v.color = "#f00";
            v.bgcolor = "#fff";
            v.bgColor_b = "#f00";
            v.type = "red";
            that.draw_piece(v);
            that.draw_chess_text(v);
        })
    }

    /**
     * 完整棋局
     */
    init_complete_chess() {
        const that = this
        //所有棋子
        this.chess_arr_all = this.chess_arr_black.concat(this.chess_arr_red)
        that.draw_chess()
    }

    /**
     * 画直线
     * @param x0 出发点横坐标
     * @param y0 出发点纵坐标
     * @param x1 终点横坐标
     * @param y1 终点纵坐标
     * @param lw 边框宽度
     */
    draw_line(x0, y0, x1, y1, lw) {
        x0 = x0 * this.chunk;
        y0 = y0 * this.chunk;
        x1 = x1 * this.chunk;
        y1 = y1 * this.chunk;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = lw ? lw : 1;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * 画横线
     */
    draw_row_line() {
        for (let i = 1; i <= 10; i++) {
            this.draw_line(1, i, 9, i);
        }
    }

    /**
     * 画竖线
     */
    draw_col_line() {
        for (let i = 1; i <= 9; i++) {
            this.draw_line(i, 1, i, 10);
        }
    }

    /**
     * 去除边界的方格
     */
    clear_boundary_rect() {
        this.ctx.clearRect(this.chunk + 1, this.chunk * 5 + 1, this.chunk * 8 - 2, this.chunk - 2);
    }

    /**
     * 画象棋的聚焦点 即兵/卒/炮
     */
    draw_sharp_s () {
        this.draw_round(2, 3);
        this.draw_round(8, 3);
        this.draw_round(1, 4);
        this.draw_round(3, 4);
        this.draw_round(5, 4);
        this.draw_round(7, 4);
        this.draw_round(9, 4);
        this.draw_round(2, 8);
        this.draw_round(8, 8);
        this.draw_round(1, 7);
        this.draw_round(3, 7);
        this.draw_round(5, 7);
        this.draw_round(7, 7);
        this.draw_round(9, 7);
    }

    /**
     * 某个棋盘位子的聚焦点，一般只有
     * @param x0
     * @param y0
     */
    draw_round (x0, y0) {
        x0 = x0 * this.chunk;
        y0 = y0 * this.chunk;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 1;
        if (x0 != this.chunk) {
            // 左上
            this.ctx.moveTo(x0 - 5, y0 - 10);
            this.ctx.lineTo(x0 - 5, y0 - 5);
            this.ctx.lineTo(x0 - 10, y0 - 5);
            // 左下
            this.ctx.moveTo(x0 - 5, y0 + 10);
            this.ctx.lineTo(x0 - 5, y0 + 5);
            this.ctx.lineTo(x0 - 10, y0 + 5);
        }
        if (x0 != this.chunk * 9) {
            // 右上
            this.ctx.moveTo(x0 + 5, y0 - 10);
            this.ctx.lineTo(x0 + 5, y0 - 5);
            this.ctx.lineTo(x0 + 10, y0 - 5);
            // 右下
            this.ctx.moveTo(x0 + 5, y0 + 10);
            this.ctx.lineTo(x0 + 5, y0 + 5);
            this.ctx.lineTo(x0 + 10, y0 + 5);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * 即帅/将的9字格
     */
    draw_x () {
        this.draw_line(4, 1, 6, 3, 0.5);
        this.draw_line(4, 3, 6, 1, 0.5);
        this.draw_line(4, 8, 6, 10, 0.5);
        this.draw_line(4, 10, 6, 8, 0.5);
    }

    /**
     * 画楚河/漢界
     */
    draw_text () {
        this.ctx.font = "bold 30px Courier New";
        this.ctx.fillStyle = "#000";
        this.ctx.fillText("楚 河", this.chunk * 2, this.chunk * 5 + this.chunk / 2 + 10);
        this.ctx.fillText("漢 界", this.chunk * 6, this.chunk * 5 + this.chunk / 2 + 10);
        this.ctx.font = "12px Courier New";
        this.text_arr = ["九", "八", "七", "六", "五", "四", "三", "二", "一"];
        for (let i = 0; i < 9; i++) {
            this.ctx.fillText((i).toString(), this.chunk * (i + 1) - 5, 20);
            this.ctx.fillText(this.text_arr[i], this.chunk * (i + 1) - 5, this.chunk * 10 + 30 + 10);
        }
    }

    /**
     * 画棋子
     * 旗子参数
     * @param e
     */
    draw_piece (e) {
        this.ctx.beginPath();
        this.ctx.fillStyle = e.bgcolor;
        this.ctx.strokeStyle = e.bgColor_b;
        this.ctx.lineWidth = 2;
        this.ctx.arc(e.x * this.chunk, e.y * this.chunk, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * 画棋子文字
     * @param e 棋子
     */
    draw_chess_text (e) {
        this.ctx.font = "bold 30px Courier New";
        this.ctx.fillStyle = e.color;
        let offset = this.ctx.measureText(e.text).width / 2;
        this.ctx.fillText(e.text, e.x * this.chunk - offset, e.y * this.chunk + 10);
    }

    /**
     * 绑定事件
     */
    bind_event() {
        const that = this;
        this.checked = false;
        this.canvas.onmousedown = (e) => {
            for(let j = 1; j <= 10; j++) {
                for (let i = 1; i <= 9; i++) {
                    let temp_i = i * that.chunk;
                    let temp_j = j * that.chunk;
                    // 计算每个棋子的距离
                    let distance = Math.sqrt(Math.pow(temp_i - e.offsetX, 2) + Math.pow(temp_j - e.offsetY, 2));
                    if(distance<=that.radius){
                        let over_chess = false;
                        for (let all_i = 0; all_i < this.chess_arr_all.length; all_i++ ){
                            if(this.chess_arr_all[all_i].x == i &&  this.chess_arr_all[all_i].y == j){
                                over_chess = true;
                                let p = { x: this.chess_arr_all[all_i].x, y: this.chess_arr_all[all_i].y }
                                if (that.currActive != that.chess_arr_all[all_i].type && !that.checked) {
                                    console.log("不是下棋方")
                                    break;
                                }
                                if(!that.checked) {
                                    that.draw_checked(p)
                                    that.pre_chess = this.chess_arr_all[all_i];
                                    that.draw_candidate();
                                    that.checked = true;
                                } else if (that.pre_chess.x == that.chess_arr_all[all_i].x && that.pre_chess.y == that.chess_arr_all[all_i].y){
                                    that.update_chess();
                                    that.checked = false;
                                } else if (that.pre_chess.type == that.chess_arr_all[all_i].type) {
                                    that.update_chess();
                                    that.draw_checked(p)
                                    that.pre_chess = this.chess_arr_all[all_i];
                                    that.draw_candidate();
                                } else {
                                    if (that.eat_rule(i,j)) {
                                        that.eat(all_i,this.chess_arr_all[all_i],i,j)
                                    } else if (that.pre_chess.text == "帅") {
                                        if(that.pre_chess.x == i) {
                                            let canEat = true;
                                            for (let ii = 0; ii < that.chess_arr_all.length; ii++) {
                                                if(that.chess_arr_all[ii].x = that.pre_chess.x && that.chess_arr_all[ii].y == j){
                                                    if (that.chess_arr_all[ii].text == "将") {
                                                        for (let t = that.pre_chess.y - 1; t > j; t--) {
                                                            if (that.inArray(that.pre_chess.x, t)) {
                                                                canEat = false;
                                                                break;
                                                            }
                                                        }
                                                    } else {
                                                        canEat = false;
                                                    }
                                                    break;
                                                }
                                            }
                                            if(canEat)
                                                that.eat(all_i,this.chess_arr_all[all_i],i,j)
                                        }
                                    }else if (that.pre_chess.text == "将") {
                                        if (that.pre_chess.x == i) {
                                            let canEat = true;
                                            for (let ii = 0; ii < that.chess_arr_all.length; ii++) {
                                                if(that.chess_arr_all[ii].x = that.pre_chess.x && that.chess_arr_all[ii].y == j){
                                                    if (that.chess_arr_all[ii].text == "帅") {
                                                        for (let t = that.pre_chess.y + 1; t > j; t--) {
                                                            if (that.inArray(that.pre_chess.x, t)) {
                                                                canEat = false;
                                                                break;
                                                            }
                                                        }
                                                    } else {
                                                        canEat = false;
                                                    }
                                                    break;
                                                }
                                            }
                                            if (canEat) {
                                                that.eat(all_i,this.chess_arr_all[all_i],i,j)
                                            }
                                        }
                                    }
                                }
                                return false;
                            }
                        }
                        if(over_chess) {

                        }else {
                            console.log(that.checked , that.move_rule(i,j))
                            if (that.checked && that.move_rule(i, j)) {
                                console.log("移动棋子")
                                that.move(i, j);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 画选中棋子状态
     * @param p
     */
    draw_checked (p) {
        console.log("here")
        let temp_x = p.x * this.chunk;
        let temp_y = p.y * this.chunk;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#00f";
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(temp_x - this.radius, temp_y - this.radius + 10);
        this.ctx.lineTo(temp_x - this.radius, temp_y - this.radius);
        this.ctx.lineTo(temp_x - this.radius + 10, temp_y - this.radius);
        this.ctx.moveTo(temp_x - this.radius, temp_y + this.radius - 10);
        this.ctx.lineTo(temp_x - this.radius, temp_y + this.radius);
        this.ctx.lineTo(temp_x - this.radius + 10, temp_y + this.radius);
        this.ctx.moveTo(temp_x + this.radius, temp_y - this.radius + 10);
        this.ctx.lineTo(temp_x + this.radius, temp_y - this.radius);
        this.ctx.lineTo(temp_x + this.radius - 10, temp_y - this.radius);
        this.ctx.moveTo(temp_x + this.radius, temp_y + this.radius - 10);
        this.ctx.lineTo(temp_x + this.radius, temp_y + this.radius);
        this.ctx.lineTo(temp_x + this.radius - 10, temp_y + this.radius);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    draw_candidate_circle (x, y) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#eee";
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 2;
        this.ctx.arc(x * this.chunk, y * this.chunk, this.CandidateCircleR, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    draw_candidate() {
        switch (this.pre_chess.text) {
            case "車":
                var temp_y = this.pre_chess.y;
                while (!this.inArray(this.pre_chess.x, ++temp_y) && temp_y <= 10) {
                    console.log(this.pre_chess.x, temp_y)
                    this.draw_candidate_circle(this.pre_chess.x, temp_y);
                }
                var temp_y = this.pre_chess.y;
                while (!this.inArray(this.pre_chess.x, --temp_y) && temp_y > 0) {
                    console.log(this.pre_chess.x, temp_y)
                    this.draw_candidate_circle(this.pre_chess.x, temp_y);
                }
                var temp_x = this.pre_chess.x;
                while (!this.inArray(++temp_x, this.pre_chess.y) && temp_x < 10) {
                    this.draw_candidate_circle(temp_x, this.pre_chess.y);
                }
                var temp_x = this.pre_chess.x;
                while (!this.inArray(--temp_x, this.pre_chess.y) && temp_x > 0) {
                    this.draw_candidate_circle(temp_x, this.pre_chess.y);
                }
                break;
            case "馬":
                if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 1)
                    && this.pre_chess.x - 2 >= 1 && this.pre_chess.y - 1 >= 1
                    && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y)) {
                    this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 1);
                }
                if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 2)
                    && this.pre_chess.x - 1 >= 1 && this.pre_chess.y - 2 >= 1
                    && !this.inArray(this.pre_chess.x, this.pre_chess.y - 1)) {
                    this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y - 2);
                }
                if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 2)
                    && this.pre_chess.x + 1 <= 9 && this.pre_chess.y - 2 >= 1
                    && !this.inArray(this.pre_chess.x, this.pre_chess.y - 1)) {
                    this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y - 2);
                }
                if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 1)
                    && this.pre_chess.x + 2 <= 9 && this.pre_chess.y - 1 >= 1
                    && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y)) {
                    this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 1);
                }
                if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 1)
                    && this.pre_chess.x + 2 <= 9 && this.pre_chess.y + 1 <= 10
                    && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y)) {
                    this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 1);
                }
                if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 2)
                    && this.pre_chess.x + 1 <= 9 && this.pre_chess.y + 2 <= 10
                    && !this.inArray(this.pre_chess.x, this.pre_chess.y + 1)) {
                    this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y + 2);
                }
                if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 2)
                    && this.pre_chess.x - 1 >= 1 && this.pre_chess.y + 2 <= 10
                    && !this.inArray(this.pre_chess.x, this.pre_chess.y + 1)) {
                    this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y + 2);
                }
                if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 1)
                    && this.pre_chess.x - 2 >= 1 && this.pre_chess.y + 1 <= 10
                    && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y)) {
                    this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 1);
                }
                break;
            case "相":
                if (this.pre_chess.y == 10) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                } else if (this.pre_chess.y == 6) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                } else if (this.pre_chess.x == 1) {
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                } else if (this.pre_chess.x == 9) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                } else {
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                }
                break;
            case "象":
                if (this.pre_chess.y == 1) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                } else if (this.pre_chess.y == 5) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                } else if (this.pre_chess.x == 1) {
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                } else if (this.pre_chess.x == 9) {
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                } else {
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x + 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 2, this.pre_chess.y + 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y - 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y - 2);
                    }
                    if (!this.inArray(this.pre_chess.x - 2, this.pre_chess.y + 2)
                        && !this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 2, this.pre_chess.y + 2);
                    }
                }
                break;
            case "仕":
                if (this.pre_chess.x == 5 && this.pre_chess.y == 9) {
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y - 1);
                    }
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y + 1);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y - 1);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y + 1);
                    }
                } else {
                    this.draw_candidate_circle(5, 9);
                }
                break;
            case "士":
                if (this.pre_chess.x == 5 && this.pre_chess.y == 2) {
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y - 1);
                    }
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y + 1);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y - 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y - 1);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y + 1)) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y + 1);
                    }
                } else {
                    this.draw_candidate_circle(5, 2);
                }
                break;
            case "帅":
                if (!this.inArray(this.pre_chess.x, this.pre_chess.y - 1) && this.pre_chess.y > 8) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y - 1);
                }
                if (!this.inArray(this.pre_chess.x, this.pre_chess.y + 1) && this.pre_chess.y < 10) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y + 1);
                }
                if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y) && this.pre_chess.x > 4) {
                    this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y);
                }
                if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y) && this.pre_chess.x < 6) {
                    this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y);
                }
                break;
            case "将":
                if (!this.inArray(this.pre_chess.x, this.pre_chess.y - 1) && this.pre_chess.y > 1) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y - 1);
                }
                if (!this.inArray(this.pre_chess.x, this.pre_chess.y + 1) && this.pre_chess.y < 3) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y + 1);
                }
                if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y) && this.pre_chess.x > 4) {
                    this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y);
                }
                if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y) && this.pre_chess.x < 6) {
                    this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y);
                }
                break;
            case "兵":
                if (this.pre_chess.y > 5 && !this.inArray(this.pre_chess.x, this.pre_chess.y - 1)) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y - 1);
                } else if (this.pre_chess.y <= 5) {
                    if (!this.inArray(this.pre_chess.x, this.pre_chess.y - 1) && this.pre_chess.y > 1) {
                        this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y - 1);
                    }
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y) && this.pre_chess.x > 1) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y) && this.pre_chess.x < 9) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y);
                    }
                }
                break;
            case "卒":
                if (this.pre_chess.y <= 5 && !this.inArray(this.pre_chess.x, this.pre_chess.y + 1)) {
                    this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y + 1);
                } else if (this.pre_chess.y > 5) {
                    if (!this.inArray(this.pre_chess.x, this.pre_chess.y + 1) && this.pre_chess.y < 10) {
                        this.draw_candidate_circle(this.pre_chess.x, this.pre_chess.y + 1);
                    }
                    if (!this.inArray(this.pre_chess.x - 1, this.pre_chess.y) && this.pre_chess.x > 1) {
                        this.draw_candidate_circle(this.pre_chess.x - 1, this.pre_chess.y);
                    }
                    if (!this.inArray(this.pre_chess.x + 1, this.pre_chess.y) && this.pre_chess.x < 9) {
                        this.draw_candidate_circle(this.pre_chess.x + 1, this.pre_chess.y);
                    }
                }
                break;
            case "炮":
                var temp_y, temp_x
                temp_y = this.pre_chess.y;
                while (!this.inArray(this.pre_chess.x, ++temp_y) && temp_y <= 10) {
                    this.draw_candidate_circle(this.pre_chess.x, temp_y);
                }
                temp_y = this.pre_chess.y;
                while (!this.inArray(this.pre_chess.x, --temp_y) && temp_y > 0) {
                    this.draw_candidate_circle(this.pre_chess.x, temp_y);
                }
                temp_x = this.pre_chess.x;
                while (!this.inArray(++temp_x, this.pre_chess.y) && temp_x < 10) {
                    this.draw_candidate_circle(temp_x, this.pre_chess.y);
                }
                temp_x = this.pre_chess.x;
                while (!this.inArray(--temp_x, this.pre_chess.y) && temp_x > 0) {
                    this.draw_candidate_circle(temp_x, this.pre_chess.y);
                }
                break;
        }

    }

    rule_car(i,j) {
        if(this.pre_chess.x == i || this.pre_chess.y == j) {
            if(this.pre_chess.x == i) {
                if(this.pre_chess.y < j) {
                    let hasObstacle = false;
                    for (let p = this.pre_chess.y + 1; p < j; p++) {
                        if (this.inArray(i, p)) {
                            hasObstacle = true;
                            break;
                        }
                    }
                    if (hasObstacle) {
                        return false;
                    }
                }
                if(this.pre_chess.y > j) {
                    let hasObstacle = false;
                    for (let p = this.pre_chess.y - 1; p < j; p--) {
                        if (this.inArray(i, p)) {
                            hasObstacle = true;
                            break;
                        }
                    }
                    if (hasObstacle) {
                        return false;
                    }
                }
            }
            if(this.pre_chess.y == j){
                if (this.pre_chess.x < i) {
                    let hasObstacle = false;
                    for (let p = this.pre_chess.x + 1; p < i; p++) {
                        if (this.inArray(p, j)) {
                            hasObstacle = true;
                            break;
                        }
                    }
                    if (hasObstacle) {
                        return false;
                    }
                }
                if (this.pre_chess.x > i) {
                    let hasObstacle = false;
                    for (let p = this.pre_chess.x - 1; p > i; p--) {
                        if (this.inArray(p, j)) {
                            hasObstacle = true;
                            break;
                        }
                    }
                    if (hasObstacle) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    rule_horse (i,j) {
        let hasObstacle = false;
        let that = this;
        if ((Math.abs(this.pre_chess.x - i) == 1 && Math.abs(this.pre_chess.y - j) == 2) || (Math.abs(this.pre_chess.x - i) == 2 && Math.abs(this.pre_chess.y - j) == 1)){
            if(that.pre_chess.x - i == 2){
                for (let i = 0; i < that.chess_arr_all.length; i++) {
                    let ee = that.chess_arr_all[i]
                    if (ee.x == that.pre_chess.x - 1 && ee.y == that.pre_chess.y) {
                        hasObstacle = true;
                        break;
                    }
                }
                if(hasObstacle)
                    return false
            }else if (i - that.pre_chess.x == 2) {
                for (let i = 0; i < that.chess_arr_all.length; i++) {
                    let ee = that.chess_arr_all[i]
                    if (ee.x == that.pre_chess.x + 1 && ee.y == that.pre_chess.y) {
                        hasObstacle = true;
                        break;
                    }
                }
                if(hasObstacle)
                    return false
            }else if(that.pre_chess.y - j == 2){
                for (let i = 0; i < that.chess_arr_all.length; i++) {
                    let ee = that.chess_arr_all[i]
                    if (ee.x == that.pre_chess.x && ee.y == that.pre_chess.y - 1) {
                        hasObstacle = true;
                        break;
                    }
                }
                if(hasObstacle)
                    return false
            }else if(j - that.pre_chess.y == 2) {
                for (let i = 0; i < that.chess_arr_all.length; i++) {
                    let ee = that.chess_arr_all[i]
                    if (ee.x == that.pre_chess.x && ee.y == that.pre_chess.y + 1) {
                        hasObstacle = true;
                        break;
                    }
                }
                if(hasObstacle)
                    return false
            }
            return true;
        }
        return false;
    }

    rule_elephant_red(i,j) {
        let hasObstacle = false;
        let that = this;
        if ((Math.abs(that.pre_chess.x - i) == 2 && Math.abs(that.pre_chess.y - j) == 2) && j >= 6) {
            let vgaX = (that.pre_chess.x + i) / 2;
            let vgaY = (that.pre_chess.y + j) / 2;
            for (let i = 0; i < this.chess_arr_all.length; i++){
                let ee = that.chess_arr_all[i]
                if (ee.x == vgaX && ee.y == vgaY) {
                    hasObstacle = true;
                    break;
                }
            }
            if (hasObstacle) {
                return false;
            }
            return true;
        }
        return false;
    }

    rule_elephant_black (i, j) {
        let hasObstacle = false;
        let that = this;
        if ((Math.abs(that.pre_chess.x - i) == 2 && Math.abs(that.pre_chess.y - j) == 2) && j < 6) {
            let vgaX = (that.pre_chess.x + i) / 2;
            let vgaY = (that.pre_chess.y + j) / 2;
            for (let i = 0; i < this.chess_arr_all.length; i++){
                let ee = that.chess_arr_all[i]
                if (ee.x == vgaX && ee.y == vgaY) {
                    hasObstacle = true;
                    break;
                }
            }
            if (hasObstacle) {
                return false;
            }
            return true;
        }
        return false;
    }

    rule_scholar_red (i, j){
        if (this.pre_chess.x == 5 && this.pre_chess.y == 9) {
            if (Math.abs(this.pre_chess.x - i) == 1 && Math.abs(this.pre_chess.y - j) == 1) {
                return true;
            }
        } else if (i == 5 && j == 9) {
            return true;
        }
        return false;
    }

    rule_scholar_black (i, j){
        if (this.pre_chess.x == 5 && this.pre_chess.y == 2) {
            if (Math.abs(this.pre_chess.x - i) == 1 && Math.abs(this.pre_chess.y - j) == 1) {
                return true;
            }
        } else if (i == 5 && j == 2) {
            return true;
        }
        return false;
    }

    rule_boss_red(i, j) {
        if ((Math.abs(this.pre_chess.x - i) == 1 && this.pre_chess.y == j)
            || (this.pre_chess.x == i && Math.abs(this.pre_chess.y - j) == 1)) {
            if (i >= 4 && i <= 6 && j >= 8 && j <= 10) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    rule_boss_black(i, j) {
        if ((Math.abs(this.pre_chess.x - i) == 1 && this.pre_chess.y == j)
            || (this.pre_chess.x == i && Math.abs(this.pre_chess.y - j) == 1)) {
            if (i >= 4 && i <= 6 && j >= 1 && j <= 3) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    rule_soldier_red (i, j) {
        if (this.pre_chess.y <= 5) {
            if ((this.pre_chess.x == i && this.pre_chess.y - 1 == j) || (this.pre_chess.x - 1 == i && this.pre_chess.y == j) || (this.pre_chess.x + 1 == i && this.pre_chess.y == j)) {
                return true;
            }
        } else {
            if (this.pre_chess.x == i && this.pre_chess.y - 1 == j) {
                return true;
            }
        }
        return false;
    }

    rule_soldier_black (i,j) {
        if (this.pre_chess.y > 5) {
            if ((this.pre_chess.x == i && this.pre_chess.y + 1 == j) || (this.pre_chess.x - 1 == i && this.pre_chess.y == j) || (this.pre_chess.x + 1 == i && this.pre_chess.y == j)) {
                return true;
            }
        } else {
            if (this.pre_chess.x == i && this.pre_chess.y + 1 == j) {
                return true;
            }
        }
        return false;
    }

    rule_cannon(i, j) {
        let that = this;
        if (this.pre_chess.x == i || this.pre_chess.y == j) {
            let t = 0;
            if (this.pre_chess.x == i) {
                let temp = this.pre_chess.y;
                if (temp < j) {
                    while (++temp != j) {
                        for(let i = 0; i < that.chess_arr_all.length; i++){
                            let ee = that.chess_arr_all[i]
                            if(ee.x == that.pre_chess.x && ee.y == temp ){
                                t++;
                                break;
                            }
                        }
                    }
                    return t;
                } else {
                    while (--temp != j) {
                        for(let i = 0; i < that.chess_arr_all.length; i++){
                            let ee = that.chess_arr_all[i]
                            if(ee.x == that.pre_chess.x && ee.y == temp ){
                                t++;
                                break;
                            }
                        }
                    }
                    return t;
                }
            } else {
                let temp = this.pre_chess.x;
                if (temp < i) {
                    while (++temp != i) {
                        for(let i = 0; i < that.chess_arr_all.length; i++){
                            let ee = that.chess_arr_all[i]
                            if(ee.x == temp && ee.y == that.pre_chess.y ){
                                t++;
                                break;
                            }
                        }
                    }
                    return t;
                } else {
                    while (--temp != i) {
                        for(let i = 0; i < that.chess_arr_all.length; i++){
                            let ee = that.chess_arr_all[i]
                            if(ee.x == temp && ee.y == that.pre_chess.y ){
                                t++;
                                break;
                            }
                        }
                    }
                    return t;
                }
            }
        }
        return 2;
    }

    inArray(x, y) {
        let hasObstacle = false;
        for (let i = 0; i < this.chess_arr_all.length; i++) {
            if(this.chess_arr_all[i].x == x && this.chess_arr_all[i].y == y) {
                hasObstacle = true;
                break;
            }
        }
        return hasObstacle;
    }

    move_rule = function (i, j) {
        switch (this.pre_chess.text) {
            case "車":
                return this.rule_car(i, j);
            case "馬":
                return this.rule_horse(i, j);
            case "相":
                return this.rule_elephant_red(i, j);
            case "象":
                return this.rule_elephant_black(i, j);
            case "仕":
                return this.rule_scholar_red(i, j);
            case "士":
                return this.rule_scholar_black(i, j);
            case "帅":
                return this.rule_boss_red(i, j);
            case "将":
                return this.rule_boss_black(i, j);
            case "兵":
                return this.rule_soldier_red(i, j);
            case "卒":
                return this.rule_soldier_black(i, j);
            case "炮":
                if (this.rule_cannon(i, j) == 0) {
                    return true;
                }
                return false;
        }
    }

    eat_rule(i,j) {
        switch (this.pre_chess.text) {
            case "車":
                return this.rule_car(i, j);
            case "馬":
                return this.rule_horse(i, j);
            case "相":
                return this.rule_elephant_red(i, j);
            case "象":
                return this.rule_elephant_black(i, j);
            case "仕":
                return this.rule_scholar_red(i, j);
            case "士":
                return this.rule_scholar_black(i, j);
            case "帅":
                return this.rule_boss_red(i, j);
            case "将":
                return this.rule_boss_black(i, j);
            case "兵":
                return this.rule_soldier_red(i, j);
            case "卒":
                return this.rule_soldier_black(i, j);
            case "炮":
                if (this.rule_cannon(i, j) == 1) {
                    return true;
                }
                return false;
        }
    }

    note(ee, i, j) {
        let distance = Math.abs(ee.y - j);
        let step;
        if (ee.type == "red") {
            let oldP = this.text_arr[ee.x - 1];
            let newP = this.text_arr[i - 1];
            let num = this.text_arr[9 - distance];
            if (j < ee.y) {
                if (ee.x == i) {
                    console.log(ee.text + oldP + "进" + num);
                    step = ee.text + oldP + "进" + num;
                } else {
                    console.log(ee.text + oldP + "进" + newP);
                    step = ee.text + oldP + "进" + newP;
                }
            } else if (j > ee.y) {
                if (ee.x == i) {
                    console.log(ee.text + oldP + "退" + num);
                    step = ee.text + oldP + "退" + num;
                } else {
                    console.log(ee.text + oldP + "退" + newP);
                    step = ee.text + oldP + "退" + newP;
                }
            } else {
                console.log(ee.text + oldP + "平" + newP);
                step = ee.text + oldP + "平" + newP;
            }
        } else {
            if (j > ee.y) {
                if (ee.x == i) {
                    console.log(ee.text + ee.x + "进" + distance);
                    step = ee.text + ee.x + "进" + distance
                } else {
                    console.log(ee.text + ee.x + "进" + i);
                    step = ee.text + ee.x + "进" + i;
                }
            } else if (j < ee.y) {
                if (ee.x == i) {
                    console.log(ee.text + ee.x + "退" + distance);
                    step = ee.text + ee.x + "退" + distance;
                } else {
                    console.log(ee.text + ee.x + "退" + i);
                    step = ee.text + ee.x + "退" + i;
                }
            } else {
                console.log(ee.text + ee.x + "平" + i);
                step = ee.text + ee.x + "平" + i;
            }
        }
        this.steps.push(step);
    }

    move(x,y) {
        let that = this;
        // console.log("移动棋子")
        for (let i = 0; i < this.chess_arr_all.length ; i++) {
            let e = that.chess_arr_all[i];
            if (e.x == that.pre_chess.x && e.y == that.pre_chess.y) {
                that.note(e,x,y)
                e.x = x;
                e.y = y;
                that.currActive = e.type == "red" ? "black" : "red";
                chessBus.$emit("currentPlayerChange", that.currActive)
                break;
            }
        }
        that.update_chess();
        if(that.currActive=="black"){
            let chessboardStatusChange = generatorStatusByChess(this.chess_arr_all);
            chessBus.$emit("chessboardStatusChange",chessboardStatusChange)
        }
        that.checked = false;
    }

    update_chess() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.init_background();
        let that = this;
        this.chess_arr_all.map((v, k) => {
            that.draw_piece(v);
            that.draw_chess_text(v);
        })
    }

    update_chess_by_status(status) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.init_background();
        this.init_chess_by_chessboard_status(status)
    }

    eat(ii,ee,i,j) {
        this.chess_arr_all.splice(ii,1);
        this.move(i,j);
        if(this.is_over(ee)) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);;
            this.init({ chessboardStatus:null },this.canvasId);
            return false;
        }
    }

    reset_chess() {
        let black = get_chess_arr_black();
        let red = get_chess_arr_red();
        this.chess_arr_black = [];
        this.chess_arr_red = [];
        for (let i = 0; i < black.length; i++) {
            this.chess_arr_black.push(black[i])
        }
        for (let i = 0; i < red.length; i++) {
            this.chess_arr_red.push(red[i])
        }
    }

    is_over(ee) {
        if (ee.text == "将") {
            this.over=true;
            alert("you win");
            return true;
        } else if (ee.text == "帅") {
            this.over=true;
            alert("you lose");
            return true;
        } else {
            return false;
        }
    }
}

export default Chess
