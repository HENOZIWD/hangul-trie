import { commonPrefixLength, integratedAssemble, integratedDisassemble } from "@/utils/index.js";

class TrieNode {
  prefix: string;
  isEndofStr: boolean;
  children: Record<string, TrieNode>;

  constructor(prefix = '') {
    this.prefix = prefix;
    this.isEndofStr = false;
    this.children = {};
  }
}

export class Trie {
  private root: TrieNode;
  size: number;

  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }

  private static _dfs(curNode: TrieNode, prefix: string, collectArray: string[]) {
    const concatenatedPrefix = prefix + curNode.prefix;
    if (curNode.isEndofStr) {
      collectArray.push(integratedAssemble(concatenatedPrefix));
    }

    for (const childNode of Object.values(curNode.children)) {
      Trie._dfs(childNode, concatenatedPrefix, collectArray);
    }
  }

  /**
   * Trie 자료구조에 문자열을 삽입합니다.
   */
  insert(str: string) {
    // 이미 존재하는 문자열이면 중단
    if (this.has(str)) return;

    // 한글 분해
    str = integratedDisassemble(str);

    let node = this.root;
    let i = 0;

    while (i < str.length) {
      const key = str[i];
      const isChildExists = key in node.children;

      // 현재 글자를 key로 가지는 자식 노드가 없다면 새로 생성
      if (!isChildExists) {
        const newNode = new TrieNode(str.slice(i));
        newNode.isEndofStr = true;
        node.children[key] = newNode;
        break;
      }

      // 현재 글자를 key로 가지는 자식 노드로 이동
      node = node.children[key];
      // 공통 prefix 길이 계산
      const prefixLen = commonPrefixLength(node.prefix, str.slice(i));

      i += prefixLen;
      // 공통 prefixLen이 현재 노드의 prefix보다 작은 경우
      // 현재 노드의 prefix를 prefixLen 기준으로 노드 두 개로 쪼개기
      if (prefixLen < node.prefix.length) {
        const newNode = new TrieNode(node.prefix.slice(prefixLen));
        newNode.isEndofStr = node.isEndofStr;
        newNode.children = node.children;
        node.prefix = node.prefix.slice(0, prefixLen);
        node.children = { [newNode.prefix[0]]: newNode };
        // 공통 prefix가 삽입한 문자열의 끝부분인경우 현재 노드가 end 노드가 됨
        node.isEndofStr = i === str.length;
      }
    }

    this.size += 1;
  }

  /**
   * 해당 문자열이 Trie에 존재하는지 검색합니다.
   */
  has(str: string) {
    // 한글 분해
    str = integratedDisassemble(str);

    let node = this.root;
    let i = 0;

    while (i < str.length) {
      const key = str[i];
      // 현재 글자와 일치하는 경로가 없다면 검색 실패
      if (!(key in node.children)) return false;

      node = node.children[key];
      const prefixLen = commonPrefixLength(str.slice(i), node.prefix);
      // 공통 prefix 길이가 현재 node prefix 길이와 일치하지 않다면
      // 검색하려는 문자열보다 현재 노드의 prefix가 더 긴 경우이므로 검색 실패
      if (prefixLen !== node.prefix.length) return false;

      i += prefixLen;

      // 공통 prefix가 검색하려는 문자열의 끝부분이라면
      // 현재 노드가 EndofStr인지 여부에 따라 검색 성공 실패 여부 결정
      if (i === str.length) return node.isEndofStr;
    }
    return false;
  }

  /**
   * 해당 문자열을 Trie 자료구조에서 제거합니다.
   */
  remove(str: string) {
    // 한글 분해
    str = integratedDisassemble(str);

    let parentNode = null;
    let node = this.root;
    let i = 0;

    while (i < str.length) {
      const key = str[i];
      if (!(key in node.children)) return;

      parentNode = node;
      node = node.children[key];
      const prefixLen = commonPrefixLength(str.slice(i), node.prefix);
      if (prefixLen !== node.prefix.length) return;

      i += prefixLen;

      // 제거하려는 문자열과 일치하는 노드 검색 성공 시
      if (i === str.length && node.isEndofStr) {
        // 더 이상 EndofStr이 아니게 수정(문자열 제거)
        node.isEndofStr = false;
        this.size -= 1;

        const childrenKeys = Object.keys(node.children);
        const childrenCount = childrenKeys.length;

        // leaf 노드인 경우 해당 노드로 가는 key 제거
        if (childrenCount === 0) {
          delete parentNode.children[node.prefix[0]];

          const parentNodeChildrenKeys = Object.keys(parentNode.children);
          const parentNodeChildrenCount = parentNodeChildrenKeys.length;
          // 부모 노드가 EndofStr이 아니고 제거 후 부모 노드의 자식 노드가 하나뿐이라면 병합
          if (!parentNode.isEndofStr && parentNodeChildrenCount === 1) {
            const childNode = parentNode.children[parentNodeChildrenKeys[0]];
            parentNode.prefix += childNode.prefix;
            parentNode.isEndofStr = childNode.isEndofStr;
            parentNode.children = childNode.children;
          }
        }
        // 자식 노드가 1개인 중간 노드인 경우 자식 노드와 병합
        else if (childrenCount === 1) {
          const childNode = node.children[childrenKeys[0]];
          node.prefix += childNode.prefix;
          node.isEndofStr = childNode.isEndofStr;
          node.children = childNode.children;
        }

        // 그 이외는 별도의 추가 작업 필요 없이 작업 종료
        return;
      }
    }
  }

  /**
   * 현재 Trie 자료구조에 삽입된 모든 문자열을 반환합니다.
   */
  getAll() {
    const result: string[] = [];
    Trie._dfs(this.root, '', result);

    return result;
  }

  /**
   * 현재 문자열로부터 완성될 수 있는 문자열들을 반환합니다.
   */
  autoComplete(str: string) {
    const result: string[] = [];

    str = integratedDisassemble(str);

    let node = this.root;
    let i = 0;

    // 현재 문자열이 포함된 prefix를 가진 노드를 찾습니다.
    while (i < str.length) {
      const key = str[i];
      if (!(key in node.children)) return [];

      node = node.children[key];
      const remainStr = str.slice(i);
      const prefixLen = commonPrefixLength(remainStr, node.prefix);

      // 현재 노드의 prefix가 공통 prefix인 경우
      if (prefixLen === remainStr.length) break;
      // 현재 문자열의 prefix가 공통 prefix인 경우
      else if (prefixLen === node.prefix.length) i += prefixLen;
      // 공통 prefix가 현재 노드의 prefix, 현재 문자열의 prefix 중 어느와도 일치하지 않는 경우
      else return [];
    }

    Trie._dfs(node, str.slice(0, i), result);

    return result;
  }
}
