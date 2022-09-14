import File from "../models/file";
import Csv from "../models/csv";
import { Request, Response } from "express";
import fs from "fs";
import book from "../models/book";

export const downloadFile =async (req:any, res:Response) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
      
        return res.render('download', { uuid: file.uuid, fileName: file.filename, user: req.user.name,fileSize: file.size, downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
     
    } catch(err) {
        return res.render('dashboard');
    }
};

export const deleteFile =async (req:Request, res:Response) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        const csv = await Csv.findOne({ filename: file.filename });
        fs.unlinkSync(file.path);
        await file.remove();
        await csv.remove();
        console.log(`successfully deleted ${file.filename}`);
        res.redirect('/dashboard')
     
    } catch(err) {
        return res.render('/dashboard');
    }
};

export const readFile = async (req:Request, res:Response) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        const csv = await Csv.findOne({ filename: file.filename });
        const data = JSON.stringify(csv.data, null, 10);
        return res.render('read', {data});
    } catch(err) {
        console.log(err);
        return res.render('dashboard');
    }
}

export const searchBook = async (req:Request, res:Response) => {
    try {
        let text:string = req.params.text;
        if(text.length>0){
                let bookData = await book.findOne({isbn:text});
                return res.json({data:bookData});
        }else return res.json({data:null});
    } catch (error:any) {
        console.log(error);
        return res.json({data:null, error});
    }
}
