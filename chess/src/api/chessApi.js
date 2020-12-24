const axios = require("axios")

let baseUrl = "http://sikic.cn:1202/bigdata"

// let baseUrl = "../bigdata"

export function getSuggest(status) {
    return new Promise((resolve,reject) => {
        axios.request({
            url: `${baseUrl}/move?init=${status}`,
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
            url: `${baseUrl}/learn?init=${status}&moveInit=${move}`,
            method: "post"
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

