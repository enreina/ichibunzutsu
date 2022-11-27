import type { NextApiRequest, NextApiResponse } from "next";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import path from "path";
import { promises as fs } from "fs";

const SHEETSON_URL: string = 'https://api.sheetson.com/v2/sheets/';
const WANIKANI_API_URL: string = 'https://api.wanikani.com/v2';
const WANIKANI_SUBJECT_ENDPOINT: string = `${WANIKANI_API_URL}/subjects`;
const WANIKANI_USER_ENDPOINT: string = `${WANIKANI_API_URL}/user`;

export type Sentence = {
    en: string,
    ja: string,
    furiganaHTML?: string,
};

const convertToFuriganaHTML = async (sentence: string) => {
    let result;
    try {
        const kuroshiro = new Kuroshiro();
        const dictPath = path.join(process.cwd(), process.env.KUROMOJI_DICT_DIRECTORY || "");
        console.log(`DictPath: ${dictPath}`);
        const dictionaryFiles = await fs.readdir(dictPath, "binary");
        console.log(dictionaryFiles);
        await kuroshiro.init(new KuromojiAnalyzer({dictPath}));
        result = await kuroshiro.convert(sentence, {mode:"furigana", to:"hiragana"});
    } catch(error) {
        console.error(`Fail to add furigana: ${error}`);
    }
    return result;
}


const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const fetchFromSheetson = () => {
    const params = {
        spreadsheetId: process.env.SHEETSON_SPREADHEET_ID || "",
        apiKey: process.env.SHEETSON_API_KEY || "",
    };
    const urlSearchParams = new URLSearchParams(params);
    const sentenceCountAPIUrl = `${SHEETSON_URL}SentenceCount/2?${urlSearchParams}`;

    return fetch(sentenceCountAPIUrl)
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
}

const fetchFromWaniKani = (apiKey: string | null) => {
    if (!apiKey) {
        return Promise.reject('API Key is required');
    }
    const headers = {
        'Authorization': `Bearer ${apiKey}` 
    };

    return fetch(WANIKANI_USER_ENDPOINT, {headers})
    .then(res => res.json())
    .then(data => {
        if (data?.error) {
            return Promise.reject(data.error);
        }

        const userLevel = data?.data?.level;
        if (!userLevel) {
            return Promise.reject("Error fetching WaniKani user");
        }

        const userMaxLevelGranted = data?.data?.subscription?.max_level_granted || userLevel;
        const maxSentenceLevel = Math.min(userLevel, userMaxLevelGranted);
        const randomizedLevel = getRandomInt(1, maxSentenceLevel+1);

        // Fetch subjects from WaniKani
        const params = {
            types: "vocabulary",
            levels: `${randomizedLevel}`,
        };
        const urlSearchParams = new URLSearchParams(params);
        const waniKaniSentenceURL = `${WANIKANI_SUBJECT_ENDPOINT}?${urlSearchParams}`;
        return fetch(waniKaniSentenceURL, {headers});
    })
    .then(res => res.json())
    .then(data => {
        if (data?.error) {
            return Promise.reject(data.error);
        }

        // randomized sentence
        if (data?.data && data.data.length > 0) {
            const randomVocabIndex = getRandomInt(0, data.data.length);
            const randomVocabContextSentences = data.data[randomVocabIndex].data['context_sentences'];
            if (randomVocabContextSentences.length > 0) {
                const randomSentenceIndex = getRandomInt(0, randomVocabContextSentences.length);
                return randomVocabContextSentences[randomSentenceIndex];
            }
        } else {
            return Promise.reject("Error fetching sentence");
        }
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Sentence | {error: string}>) {
    const {shouldFetchFromWaniKani: shouldFetchFromWaniKaniParam = false, waniKaniAPIKey: waniKaniAPIKeyParam = null} = req.query;
    const shouldFetchFromWaniKani = Array.isArray(shouldFetchFromWaniKaniParam) ? shouldFetchFromWaniKaniParam[0] === "true" : shouldFetchFromWaniKaniParam === "true";
    const waniKaniAPIKey = Array.isArray(waniKaniAPIKeyParam) ? waniKaniAPIKeyParam[0] : waniKaniAPIKeyParam;

    try {
        const data = await (shouldFetchFromWaniKani ? fetchFromWaniKani(waniKaniAPIKey) : fetchFromSheetson());
        if (data.ja) {
            data.furiganaHTML = await convertToFuriganaHTML(data.ja);
        }
        res.status(200).json(data);
    } catch (error) {
        const errorString: string = error as string;
        res.status(500).send({error: errorString});
    }
}