module.exports = {
    order : async function(order){
        try {
            await sails.axios.post(process.env.BAR_SOCKET_URL + '/order', JSON.stringify(order), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.BAR_SOCKET_TOKEN
                }
            })
        } catch (error) {
            return console.error(error);
        }
        return
    },
}