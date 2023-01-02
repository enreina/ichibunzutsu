import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import path from 'path';

// Temporary workaround for: Error: ENOENT: no such file or directory
// When calling initializing KuroMoji Analyzer
// See: https://github.com/vercel/next.js/issues/8251#issuecomment-960792582
export const config = {
  unstable_includeFiles: ['dict'],
};

let kuroshiroInstance: any;

const getKuroshiroInstance = async () => {
  if (!kuroshiroInstance) {
    kuroshiroInstance = new Kuroshiro();
    const dictPath = path.join(process.cwd(), 'dict');
    await kuroshiroInstance.init(new KuromojiAnalyzer({ dictPath }));
  }
  return kuroshiroInstance;
};

export const convertToFuriganaHTML = async (sentence: string) => {
  let result;
  try {
    const kuroshiro = await getKuroshiroInstance();
    result = await kuroshiro.convert(sentence, {
      mode: 'furigana',
      to: 'hiragana',
    });
  } catch (error) {
    console.error(`Fail to add furigana: ${error}`);
  }
  return result;
};
