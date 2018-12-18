const dict = {
    1: "recipe",
    2: "follower"
}

const getKey = (notificationType) => {
    return Object.keys(dict).find(key => dict[key] === notificationType)
}

module.exports = {
    dict,
    getKey
}