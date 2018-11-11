module.exports = {
    ID: function(prefix){
        return prefix+"_"+((new Date).getTime() + Math.random().toString(36).substr(2, 5)).toUpperCase()
    }
}