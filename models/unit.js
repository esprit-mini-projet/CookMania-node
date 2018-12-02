const dict = {
    0: "g",
    1: "ml",
    2: ""
}

const getKey = (unit) => {
    return Object.keys(dict).find(key => dict[key] === unit)
}

module.exports = {
    dict,
    getKey
}