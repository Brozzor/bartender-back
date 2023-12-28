module.exports = {
    create : async function(data){
        await Log.create(data)
    },

    get : async function(){
        return await Log.find({}).limit(20).sort('createdAt DESC'); // by bar id
    }

}