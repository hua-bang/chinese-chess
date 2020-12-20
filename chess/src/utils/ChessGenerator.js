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
            y: Number(v[1]) + 1
        }
        chess_arr.push(chess_obj)
    })
    return chess_arr
}
