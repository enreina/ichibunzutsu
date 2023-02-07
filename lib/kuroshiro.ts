import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import path from 'path';
import parse from 'html-dom-parser';
import { Element, Text } from 'domhandler';
import { ElementType } from 'domelementtype';

export type FuriganaTokenType = {
  kanji?: string,
  furigana: string,
};

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

export const convertToHiragana = async (sentence: string, furiganaHTMLMode: boolean) => {
  let result: string | undefined;
  try {
    const kuroshiro = await getKuroshiroInstance();
    result = await kuroshiro.convert(sentence, {
      mode: furiganaHTMLMode ? 'furigana' : 'normal',
      to: 'hiragana',
    });
  } catch (error) {
    console.error(`Fail to add furigana: ${error}`);
  }
  return result;
};

export const tokenizeFurigana = (furiganaHTMLString: string) => {
  const nodes = parse(furiganaHTMLString);
  const results: FuriganaTokenType[] = [];
  nodes.forEach((domNode) => {
    if (domNode.type === ElementType.Tag && domNode.name === 'ruby') {
      let kanji = '';
      let furigana = '';
      // find the kanji
      const kanjiNode = domNode.children.find(
        (node) => node.type === ElementType.Text
      );
      if (kanjiNode) {
        kanji = (kanjiNode as Text).data;
      }

      const furiganaWrapperNode = domNode.children.find(
        (node) => node.type === ElementType.Tag && node.name === 'rt'
      );
      if (furiganaWrapperNode) {
        const furiganaNode = (furiganaWrapperNode as Element).children.find(
          (node) => node.type === ElementType.Text
        );
        if (furiganaNode) {
          furigana = (furiganaNode as Text).data;
        }
      }
      results.push({kanji, furigana});
    } else if (domNode.type === ElementType.Text) {
      const furigana = (domNode as Text).data;
      results.push({furigana});
    }
  });
  return results;
};
