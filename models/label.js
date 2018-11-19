const dict = {
    0: "Healthy",
    1: "Cheap",
    2: "Easy",
    3: "Fast",
    4: "Vegetarian",
    5: "For Kids"
}

const getKey = (label) => {
    return Object.keys(dict).find(key => dict[key] === label)
}

module.exports = {
    dict,
    getKey
}