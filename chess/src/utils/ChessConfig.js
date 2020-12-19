let Car_b1 = {x: 1, y: 1, text: "車"}
let Horse_b1 = {x: 2, y: 1, text: "馬"}
let Elephant_b1 = {x: 3, y: 1, text: "象"}
let Scholar_b1 = {x: 4, y: 1, text: "士"}
let Boss_b = {x: 5, y:1 , text: "将"}
let Scholar_b2 = {x: 6, y: 1, text: "士"}
let Elephant_b2 = {x: 7, y: 1, text: "象"}
let Horse_b2 = {x: 8, y: 1, text: "馬"}
let Car_b2 = {x: 9, y: 1, text: "車"}
let Cannon_b1 = {x: 2, y: 3, text: "炮"}
let Cannon_b2 = {x: 8, y: 3, text: "炮"}
let Soldier_b1 = {x: 1, y: 4, text: "卒"}
let Soldier_b2 = {x: 3, y: 4, text: "卒"}
let Soldier_b3 = {x: 5, y: 4, text: "卒"}
let Soldier_b4 = {x: 7, y: 4, text: "卒"}
let Soldier_b5 = {x: 9, y: 4, text: "卒"}
let Car_r1 = {x: 1, y: 10, text: "車"}
let Horse_r1 = {x: 2, y: 10, text: "馬"}
let Elephant_r1 = {x: 3, y: 10, text: "相"}
let Scholar_r1 = {x: 4, y: 10, text: "仕"}
let Boss_r = {x: 5, y: 10, text: "帅"}
let Scholar_r2 = {x: 6, y: 10, text: "仕"}
let Elephant_r2 = {x: 7, y: 10, text: "相"}
let Horse_r2 = {x: 8, y: 10, text: "馬"}
let Car_r2 = {x: 9, y: 10, text: "車"}
let Cannon_r1 = {x: 2, y: 8, text: "炮"}
let Cannon_r2 = {x: 8, y: 8, text: "炮"}
let Soldier_r1 = {x: 1, y: 7, text: "兵"}
let Soldier_r2 = {x: 3, y: 7, text: "兵"}
let Soldier_r3 = {x: 5, y: 7, text: "兵"}
let Soldier_r4 = {x: 7, y: 7, text: "兵"}
let Soldier_r5 = {x: 9, y: 7, text: "兵"}

// 黑方旗子
const chess_arr_black = [Car_b1, Horse_b1, Elephant_b1, Scholar_b1, Boss_b, Scholar_b2, Elephant_b2, Horse_b2, Car_b2,
    Cannon_b1, Cannon_b2, Soldier_b1, Soldier_b2, Soldier_b3, Soldier_b4, Soldier_b5];

// 红方旗子
const chess_arr_red = [Car_r1, Horse_r1, Elephant_r1, Scholar_r1, Boss_r, Scholar_r2, Elephant_r2, Horse_r2, Car_r2,
    Cannon_r1, Cannon_r2, Soldier_r1, Soldier_r2, Soldier_r3, Soldier_r4, Soldier_r5];

export { chess_arr_black,chess_arr_red };
