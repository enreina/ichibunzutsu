import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse<number | {error: string}>) {
    try {
        const countSentence = await prisma.sentences.count();
        res.status(200).json(countSentence);
    } catch (error) {
        const errorString: string = error as string;
        res.status(500).send({error: errorString});
    } 
}