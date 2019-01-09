const dict = {
    Diet: {
        0: "Healthy",
        4: "Vegetarian",
    },
    Type: {
        6: "Breakfast",
        7: "Dinner",
        11: "Lunch",
        5: "Dessert"
    },
    Occasion: {
        8: "Date Night",
    },
    Other: {
        1: "Cheap",
        2: "Easy",
        3: "Fast",
        9: "Kids Friendly",
        10: "Takes Time"
    }
}

const flatten = (source, parentPath = '', target = {}) => {

    for(const key in source){
      // Construct the necessary pieces of metadata
      const value = source[key]
      const path = parentPath ? `${key}` : key
      
      // Either append or dive another level
      if (typeof value === 'object'){
        flatten(value, path, target)
      } else {    
        target[path] = source[key]
      }
    }
  
    return target
  }

const getKey = (label) => {
    var flatDict = flatten(dict)
    return Object.keys(flatDict).find(key => flatDict[key] === label)
}

const getValue = (key) => {
    var flatDict = flatten(dict)
    return flatDict[key]
}

module.exports = {
    dict,
    getKey,
    getValue
}