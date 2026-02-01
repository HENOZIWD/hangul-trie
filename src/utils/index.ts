import { assemble, disassemble } from "es-hangul";

/**
 * disassemble 된 두 한글 문자열의 공통 prefix 길이를 반환합니다.
 */
export function commonPrefixLength(a: string, b: string) {
  let len = 0;

  while (len < a.length && len < b.length) {
    if (a[len] !== b[len]) break;
    len += 1;
  }

  return len;
}

function hasHangul(str: string) {
  return [...str].some((s) => /^[가-힣ㄱ-ㅣ]$/.test(s));
}

function onlyHangulOrSpace(str: string) {
  return [...str].every((s) => /^[가-힣ㄱ-ㅣ ]$/.test(s));
}

/**
 * 한글을 초성/중성/종성 단위로 완전히 분해합니다.
 * 한글이 아닌 문자가 포함되어 있는 경우에도 분해합니다.
 */
export function integratedDisassemble(str: string) {
  const isSomeHangul = hasHangul(str);
  const isEveryHangul = onlyHangulOrSpace(str);

  // 전부 한글
  if (isEveryHangul) return disassemble(str);

  // 일부만 한글
  if (isSomeHangul) {
    const splitted = str.split(/([가-힣ㄱ-ㅣ]+)/);

    return splitted.reduce((acc, cur) => {
      if (cur.length === 0) return acc;
      const isHangul = /^[가-힣ㄱ-ㅣ]$/.test(cur[0]);
      if (!isHangul) return acc + cur;
      return acc + disassemble(cur);
    }, '');
  }
  
  // 한글 미포함
  return str;
}

/**
 * 문자열에 포함된 한글 문장과 문자를 한글 규칙에 맞게 합성합니다.
 */
export function integratedAssemble(str: string) {
  const isSomeHangul = hasHangul(str);
  const isEveryHangul = onlyHangulOrSpace(str);

  // 전부 한글
  if (isEveryHangul) return assemble([str]);

  // 일부만 한글
  if (isSomeHangul) {
    const splitted = str.split(/([가-힣ㄱ-ㅣ]+)/);

    return splitted.reduce((acc, cur) => {
      if (cur.length === 0) return acc;
      const isHangul = /^[가-힣ㄱ-ㅣ]$/.test(cur[0]);
      if (!isHangul) return acc + cur;
      return acc + assemble([...cur]);
    }, '');
  }

  // 한글 미포함
  return str;
}
