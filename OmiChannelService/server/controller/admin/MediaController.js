import {BaseController} from "../BaseController";
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";
import createError from 'http-errors';
import fs from 'fs';
import slugify from "slugify";

export default class MediaController extends BaseController {
    constructor() {
        super("/media");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
        this.getRouter().post('/upload', this.upload.bind(this));
        this.getRouter().delete('/:id', this.delete.bind(this));
    }

    async upload(req, res, next) {
        let mediaFile;
        let uploadPath;
        try {
            if (!req.files || Object.keys(req.files).length === 0 || !req.files.mediaFile) {
                throw createError(400, "No file uploaded");
            }

            mediaFile = req.files.mediaFile;
            const fileName = slugify(req.files.mediaFile.name, {trim: true});
            uploadPath = `${mediaFile.md5}_${fileName}`;

            const date = new Date();
            const dateDir = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const uploadDir = `${process.env.PUBLIC_PATH}/${process.env.UPLOAD_FOLDER}/${dateDir}`;

            //Check mimetype
            const idxMime = [
                "image/png",
                "application/pdf",
                "image/jpeg",
                'image/jpeg',
                'image/png',
                'application/pdf',
                "video/mp4",
                "audio/mp4",
                "application/mp4",
                "application/x-mpegURL",
                "video/quicktime"
            ].findIndex(item => {
                return item === mediaFile.mimetype
            });

            if (idxMime < 0) {
                throw createError(400, "File not supported");
            }

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            await mediaFile.mv(`${uploadDir}/${uploadPath}`);

            const model = db.MediaManager.build({
                mime: mediaFile.mimetype,
                name: mediaFile.name,
                path: `/${process.env.UPLOAD_FOLDER}/${dateDir}/${uploadPath}`,
                hash: mediaFile.md5
            });

            await model.save();

            return res.json({
                data: {
                    success: true,
                }
            });
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const model = await db.MediaManager.findOne({
                where: {
                    id
                }
            });

            if (!model) {
                throw createError(404, "Media not founded");
            }

            const fullPath = `${process.env.PUBLIC_PATH}${model.path}`;
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }

            await db.MediaManager.destroy({
                where: {
                    id
                }
            });

            return res.json({
                data: {
                    success: true,
                }
            });
        } catch (e) {
            next(e);
        }
    }

    async index(req, res, next) {
        try {
            const {query} = req;
            const queryObj = queryStringConverter.convert({
                query: {
                    ...query,
                },
                basedProperties: [
                    'id',
                    'name',
                    'mime',
                ]
            });
            const criteria = paginationQuery(queryObj, req);
            const models = await db.MediaManager.findAll({
                ...criteria
            });
            return res.json(paginationDataResult(models, req));
        } catch (e) {
            next(e);
        }
    }
}