import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(_: NextApiRequest, res: NextApiResponse<string>) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "json");
  console.log(jsonDirectory);
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
  //Return the content of the data file in json format
  res.status(200).json(fileContents);
}