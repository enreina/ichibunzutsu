import { FuriganaTokenType } from "../lib/kuroshiro";

export type Sentence = {
  en: string;
  ja: string;
  furiganaHTML?: string;
  furiganaTokens?: FuriganaTokenType[],
};
