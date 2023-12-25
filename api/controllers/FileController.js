/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { Readable } = require('stream');
const mime = require('mime-types')
module.exports = {

    upload: async (req, res) => {
        try {
            const uploadedFile = await req.file('file')._files[0].stream;
            if (!uploadedFile) {
                return res.badRequest('No file uploaded.');
            }
            const meta = {
                filename: uploadedFile.filename,
                type: mime.lookup(uploadedFile.filename),
                size: uploadedFile.byteCount,
            };
            await FileService.upload(meta, uploadedFile);
            return res.ok();
        } catch (err) {
            console.error(err)
            if (err.message === 'ERR_FILE_ALREADY_EXIST') return res.status(422).send({ error:'ERR_FILE_ALREADY_EXIST'});
            return res.sendStatus(500);
        }
    },

    download: async (req, res) => {
        try {
            let findParams = {id: req.params.id};
            if (req.params.slug) findParams = {slug: req.params.slug};
            const file = await File.findOne(findParams);
            if (!file) throw new Error('ERR_FILE_NOT_FOUND');
            const filestream = await FileService.download(file);
            res.set('Content-Type', file.type);
            res.set('Content-Length', file.size);
            res.set('Cache-Control', 'public, max-age=31557600');

            filestream.pipe(res);
        } catch (err) {
            console.error(err)
            return res.sendStatus(404);
        }
    },

    delete : async function(req, res) {
        try {
            const file = await File.findOne({ id: req.params.id });
            if (!file) throw new Error('ERR_FILE_NOT_FOUND');
            await FileService.delete(file);
            return res.ok();
        } catch (err) {
            console.error(err)
            return res.sendStatus(404);
        }
    },

    listAdmin : async function(req, res) {
        try {
            const files = await QueryService.executePaginatedQuery('file/listAdmin', req.query.filter, req.query.page, req.query.pageSize, req.query.sort)
            return res.json(files);
        } catch (error) {
            console.error(error);
            return res.sendStatus(400);
        }
    },

    get : async function(req, res) {
        try {
            const file = await File.findOne({ id: req.params.id });
            if (!file) throw new Error('ERR_FILE_NOT_FOUND');
            return res.json(file);
        } catch (error) {
            console.error(error);
            return res.sendStatus(404);
        }
    }
}