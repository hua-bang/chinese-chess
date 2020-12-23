const axios = require("axios")

// export function getSuggest(status){
//     return new Promise((resolve,reject) => {
//         axios.request({
//             url: `/api/suggest/${status}/2`
//         }).then(res => {
//             resolve(res)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

export function getSuggest(status) {
    return new Promise((resolve,reject) => {
        axios.request({
            url: `http://sikic.cn:1202/bigdata/move?init=${status}`,
            method: "post"
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function learn(status,move) {
    return new Promise((resolve,reject) => {
        axios.request({
            url: `http://sikic.cn:1202/bigdata/learn?init=${status}&moveInit=${move}`,
            method: "post"
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

