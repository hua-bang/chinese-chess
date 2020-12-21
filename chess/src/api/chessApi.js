const axios = require("axios")

export function getSuggest(status){
    return new Promise((resolve,reject) => {
        axios.request({
            url: `/api/suggest/${status}/2`
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
