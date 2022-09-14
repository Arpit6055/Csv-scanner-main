// var fs = require("fs");
// var path = require("path");
import * as fs from 'fs';

type csvPartitionStyle =  ";" | "," ;
// Read CSV

const csvParser = (seperator:csvPartitionStyle, csvData:string):Array<any>=> {
  // Split on row
  let f:any = csvData.split("\n");
  // Get first row for column headers
  let headers = f.shift().split(seperator);
  for (var i = 0; i < headers.length; i++) {
    headers[i] = headers[i].replace(/(\r\n|\n|\r)/gm, "");
  }
  var json:Array<any> = [];
  f.forEach(function (d:any) {
    // Loop through each row
    let tmp:any = {};
    let row = d.split(seperator);
    for (var i = 0; i < headers.length; i++) {
      tmp[headers[i]] =row[i]?row[i].replace(/(\r\n|\n|\r)/gm, ""):"";
    }
    json.push(tmp);
  });
  return json;
};

export default async function csv2json(filePath:string):Promise<Array<any>>{
  try {
    let csvData = await fs.readFileSync(filePath, { encoding: "utf-8" });
    for (let i = 0; i < csvData.length; i++) {
      if(csvData[i]==','){
        return await csvParser(",", csvData);
      }else if(csvData[i]==';'){
        return await csvParser(";",csvData);
      }else continue;
    }
    return [];
  } catch (error) {
    throw error
  }
};