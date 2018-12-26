const dict = {
    0: "Healthy",
    1: "Cheap",
    2: "Easy",
    3: "Fast",
    4: "Vegetarian",
    6: "Breakfast",
    7: "Dinner",
    8: "Date Night",
    9: "Kids Friendly",
    10: "Takes Time",
    11: "Lunch"
}

const getKey = (label) => {
    return Object.keys(dict).find(key => dict[key] === label)
}

module.exports = {
    dict,
    getKey
}