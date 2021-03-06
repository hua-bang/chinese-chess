import { group } from "@/utils/stringUtil";

// 棋盘对应索引
const CHESS_NAME_ARR = [
    "車","馬","相","仕","帅","仕","相","馬","車","炮","炮","兵","兵","兵","兵","兵",
    "車","馬","象","士","将","士","象","馬","車","炮","炮","卒","卒","卒","卒","卒"
]

export function generatorChess(status) {
    console.log(`根据${status}生成棋盘`)
    let chess_status_arr = group(status,2);
    let chess_arr = [];
    let chess_obj = {
        bgColor_b: "#f00",
        bgcolor: "#fff",
        color: "#f00",
        text: "馬",
        type: "red",
        x: 2,
        y: 10
    }
    chess_status_arr.map((v,k)=> {
        chess_obj = {
            bgColor_b: k<=15?"#f00":"#000",
            bgcolor: "#fff",
            color: k<=15?"#f00":"#000",
            text: CHESS_NAME_ARR[k],
            type: k<=15?"red":"black",
            x: Number(v[0]) + 1,
            y: Number(v[1]) + 1,
            index: k
        }
        chess_arr.push(chess_obj)
    })
    return chess_arr
}

export function generatorStatusByChess(chess) {
    let str = ""
    for (let i = 0; i < 32; i++ ){
        str += "99"
    }
    let str_arr = group(str,1)
    for(let i = 0; i < chess.length; i++ ){
        if(chess[i].x <= 9){
            str_arr[chess[i].index*2] = chess[i].x - 1;
            str_arr[chess[i].index*2+1] = chess[i].y - 1;
        }
    }
    let newStr = ""
    for (let i = 0; i < str_arr.length; i++ ){
        newStr += str_arr[i]
    }
    return newStr
}

/**
 * 根据初始状态根据move动作进行操作生成状态
 * @param initStatus
 * @param move
 */
export function generatorStatusByMove(initStatus,move){
    let str_position_arr = group(initStatus,2);
    let move_chess_position = group(move,2)
    let move_chess_begin_position = move_chess_position[0]
    let move_chess_end_position = move_chess_position[1]
    let index = str_position_arr.findIndex((v)=>{
        return v == move_chess_begin_position
    })
    let need_replace_index = str_position_arr.findIndex((v)=>{
        return v == move_chess_end_position
    })
    if(need_replace_index!=-1){
        str_position_arr[need_replace_index] = 99;
    }
    str_position_arr[index] = move_chess_end_position;
    let newStr = ""
    for (let i = 0; i < str_position_arr.length; i++ ){
        newStr += str_position_arr[i]
    }
    return newStr;
}
