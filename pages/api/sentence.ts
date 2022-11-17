import type { NextApiRequest, NextApiResponse } from "next";

const SHEETSON_URL: string = 'https://api.sheetson.com/v2/sheets/';

type Sentence = {
    en: string,
    ja: string,
};

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Sentence | {error: string}>) {
    const params = {
        spreadsheetId: process.env.SHEETSON_SPREADHEET_ID || "",
        apiKey: process.env.SHEETSON_API_KEY || "",
    };
    const urlSearchParams = new URLSearchParams(params);
    const sentenceCountAPIUrl = `${SHEETSON_URL}SentenceCount/2?${urlSearchParams}`;

    try {
        const data = await fetch(sentenceCountAPIUrl)
            .then(res => res.json())
            .then(data => {
                if (data?.count) {
                    const sentenceCount = Number.parseInt(data.count);
                    if (!Number.isNaN(sentenceCount)) {
                        const randomSentenceId = getRandomInt(2, sentenceCount + 1); // data starts from row 2
                        const sentenceAPIUrl = `${SHEETSON_URL}Sentences/${randomSentenceId}?${urlSearchParams}`;
                        return fetch(sentenceAPIUrl);
                    }
                }
                return Promise.reject("Error fetching sentence");
            })
            .then(res => res.json())
            .then(data => {
                if (data?.ja && data?.en) {
                    return {
                        "en": data.en,
                        "ja": data.ja,
                    };
                }

                return Promise.reject("Error fetching sentence");
            });

        res.status(200).json(data);
    } catch (error) {
        const errorString: string = error as string;
        res.status(500).send({error: errorString});
    }
}