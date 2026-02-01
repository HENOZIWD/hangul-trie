import { Trie } from "@/core/index.js";
import { commonPrefixLength, integratedAssemble, integratedDisassemble } from "@/utils/index.js";
import { assemble } from "es-hangul";
import { describe, expect, test } from "vitest";

describe('Util functions test', () => {
  test('commonPrefixLength', () => {
    expect(commonPrefixLength('ㄱㄴ', 'ㄱ')).toBe(1);
    expect(commonPrefixLength('ㄱㄴ', 'ㄱ')).toBe(commonPrefixLength('ㄱ', 'ㄱㄴ'));
    expect(commonPrefixLength('ㄴㅏ ㅂㅣ', 'ㄴㅏ ㅂㅏㅇ')).toBe(4);
  });

  test('integratedDisassemble', () => {
    expect(integratedDisassemble('ㄱㄴㄷ')).toBe('ㄱㄴㄷ');
    expect(integratedDisassemble('가방과 나방')).toBe('ㄱㅏㅂㅏㅇㄱㅗㅏ ㄴㅏㅂㅏㅇ');
    expect(integratedDisassemble('abc')).toBe('abc');
    expect(integratedDisassemble('나비는 butterfly야')).toBe('ㄴㅏㅂㅣㄴㅡㄴ butterflyㅇㅑ');
  });

  test('integratedAssemble', () => {
    expect(integratedAssemble('ㄱㅏㅁ')).toBe('감');
    expect(integratedAssemble('ㄱㅏㅁㅏ')).toBe('가마');
    expect(integratedAssemble('abc')).toBe('abc');
    expect(integratedAssemble('ㄱㅏa ㅁㅜㄹ b치')).toBe('가a 물 b치');
  });
})

describe('Trie test', () => {
  test('Insert test', () => {
    const trie = new Trie();
    const input = [
      'abc',
      'ㄱㄴㄷ',
      '개굴개굴 개구리',
      '바나나는 banana야',
    ];
    input.forEach((value) => trie.insert(value));

    expect(trie.has('abc')).toBe(true);
    expect(trie.has('ㄱㄴㄷ')).toBe(true);
    expect(trie.has('개굴개굴 개구리')).toBe(true);
    expect(trie.has('바나나는 banana야')).toBe(true);

    expect(trie.has('abd')).toBe(false);
    expect(trie.has('ㄱㄴㄹ')).toBe(false);
    expect(trie.has('개굴개굴개구리')).toBe(false);

    expect(trie.size).toBe(4);
  });

  test('Remove test', () => {
    const trie = new Trie();
    const input = [
      'ㄱㄴㄷ',
      'ㄱㄴㄷㄹ',
      '가나다',
      '가나라',
      '나방',
      '나비',
      '나비야',
    ];
    input.forEach((value) => trie.insert(value));

    // leaf 노드 제거하는 경우
    trie.remove('ㄱㄴㄷㄹ');
    // leaf 노드 제거 후 부모 노드의 자식 노드가 1개인 경우
    trie.remove('가나다');
    // 자식 노드가 1개인 중간 노드인 경우
    trie.remove('나비');

    expect(trie.has('ㄱㄴㄷㄹ')).toBe(false);
    expect(trie.has('가나다')).toBe(false);
    expect(trie.has('나비')).toBe(false);

    expect(trie.has('ㄱㄴㄷ')).toBe(true);
    expect(trie.has('가나라')).toBe(true);
    expect(trie.has('나방')).toBe(true);
    expect(trie.has('나비야')).toBe(true);

    expect(trie.size).toBe(4);
  });

  test('GetAll test', () => {
    const trie = new Trie();
    const input = [
      'abc',
      'ㄱㄴㄷ',
      '개굴개굴 개구리',
      '나비는 butterfly야',
      'ㄱㄴㄷㄹ',
      '가나다',
      '가나라',
      '나방',
      '나비',
      '나비야'
    ];
    input.forEach((value) => trie.insert(value));

    expect(trie.getAll().sort()).toStrictEqual(input.sort());
    expect(trie.size).toBe(input.length);
  });

  test('AutoComplete test', () => {
    const trie = new Trie();
    const input = [
      'apple',
      'apply',
      'application',
      'approach',
      '납부',
      '나비',
      '나방',
      '나쁜',
    ];
    input.forEach((value) => trie.insert(value));

    expect(trie.autoComplete('appll')).toStrictEqual([]);
    expect(trie.autoComplete('app').sort()).toStrictEqual([
      'apple',
      'apply',
      'application',
      'approach',
    ].sort());
    expect(trie.autoComplete('appl').sort()).toStrictEqual([
      'apple',
      'apply',
      'application',
    ].sort());

    expect(trie.autoComplete('난').sort()).toStrictEqual([]);
    expect(trie.autoComplete('나').sort()).toStrictEqual([
      '납부',
      '나비',
      '나방',
      '나쁜',
    ].sort());
    expect(trie.autoComplete('납').sort()).toStrictEqual([
      '납부',
      '나비',
      '나방',
    ].sort());
    expect(trie.autoComplete('나ㅂ').sort()).toStrictEqual([
      '납부',
      '나비',
      '나방',
    ].sort());
  });
});
