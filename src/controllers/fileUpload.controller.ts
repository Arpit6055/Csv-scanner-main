import File from "../models/file";
import Csv from "../models/csv";
import {Response } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/book";
import csvParser from "../services/csvParser";

export const uploadFile = async (req: any, res: Response) => {
    try {
        let { isBook } = req.body

        var fileExt = await req.file.filename.split(".").reverse()[0];
        if (!req.file) {
            return res.json({ error: "All fields are required" });
        } else if (fileExt != "csv") {
            fs.unlinkSync(req.file.path);
            return res.json({ file: `Please upload a ".csv" file` });
        }
        if (fileExt == "csv") {
            let uid=uuidv4();
            csvParser(req.file.path)
                .then(async (JSONdata:Array<any>) => {
                    if(isBook){
                        let bookArr:Array<any> = [];
                        JSONdata.forEach((e:any)=>{
                            if(e.title && e.isbn){
                                let obj = {
                                    userOwnerId: req.user._id,
                                    path: req.file.path,
                                    uuid: uid,
                                    title: e.title || "",
                                    isbn: e.isbn,
                                    authors: e.authors || "",
                                    description: e.description || ""
                                }
                                bookArr.push(obj);
                            }
                        });
                       if(bookArr.length>0)Book.insertMany(bookArr);
                    }
                    const csv = new Csv({
                        filename: req.file.filename,
                        data: JSONdata,
                    });
                    //saving csv file data into JSON format
                    csv.save();
                    const file = new File({
                        userOwnerId: req.user._id,
                        userOwnerName: req.user.name,
                        filename: req.file.filename,
                        path: req.file.path,
                        size: req.file.size,
                        uuid:uid ,
                    });
                    const response: any = await file.save();
                    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
                });
        }
    } catch (error: any) {
        console.log({ error });
        return res.send(error);
    }
};
