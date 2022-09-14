import { Request, Response } from 'express';
import File from '../models/file';

export const downloadFile = async (req:Request, res:Response) => {
    try {
        // Extract link and get file from storage send download stream 
        const file = await File.findOne({ uuid: req.params.uuid });
     
        // Link expired
        if(!file) {
             return res.render('download', { error: 'Link has been expired.'});
        } 
        const filePath = `${__dirname}/../${file.path}`;
        return res.download(filePath);
    } catch (error:any) {
        return res.json({ error });
    }
 }