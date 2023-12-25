const { ObjectId } = require("mongodb");
module.exports = {

    collection :"file",
  
    default_sort : {'createdAt' : 1},
  
    getQuery : (opts) => {
      let query = [
        {
          $project: {
            _id: true,
            filename: true,
            slug: true,
            type: true,
            size: true
          },
        },
      ]
  
      return query;
  
    }
  
  
  }