const mongodb = require('mongodb');
module.exports = {
    upload : async function (meta, stream){
        const file = await File.create(meta).fetch();
        const bucket = new mongodb.GridFSBucket(sails.tenant_db_con[sails.config.tenant.id],  { bucketName: 'fileData' });
        let writestream = bucket.openUploadStream(file.id,{
            chunkSizeBytes: 1024,
            metadata : {
                fileId : file.id
            }
        });
        return new Promise((resolve, reject)=>{
            stream.pipe(writestream);
            writestream.on('close',async () => {
                await File.updateOne({id : file.id}, {fileData : writestream.id.toString()});
                resolve()
            })
        })
    },

    download : async function (file){
        const bucket = new mongodb.GridFSBucket(sails.tenant_db_con[sails.config.tenant.id],  { bucketName: 'fileData' });
        return bucket.openDownloadStreamByName(file.id);
    },

    delete : async function (file){
        const bucket = new mongodb.GridFSBucket(sails.tenant_db_con[sails.config.tenant.id],  { bucketName: 'fileData' });
        await bucket.delete(new mongodb.ObjectId(file.fileData));
        return await File.destroyOne({id : file.id});
    }
}