# hangul-trie
다양한 문자열을 효율적으로 저장하고 검색할 수 있는 Compressed Trie 자료구조입니다.

특히 한글의 경우 초성, 중성, 종성 단위로 분해하여 저장하므로 한글 환경에서 더욱 세밀한 검색과 자동완성을 지원합니다.

본 라이브러리는 [es-hangul](https://github.com/toss/es-hangul)의 한글 처리 기능을 바탕으로 제작되었습니다.

## install
```bash
npm i hangul-trie
```

## Usage
Trie 자료구조 인스턴스를 생성하여 사용합니다.

```typescript
import { Trie } from "hangul-trie";

const trie = new Trie();
```

문자열을 삽입하거나 제거할 수 있습니다.

```typescript
trie.insert('오리');
console.log(trie.has('오리')); // true

trie.remove('오리');
console.log(trie.has('오리')); // false
```

현재 Trie에 삽입되어 있는 문자열 정보를 확인할 수 있습니다.

```typescript
trie.insert('duck');
trie.insert('오리');

console.log(trie.size); // 2
console.log(trie.getAll()); // ['duck', '오리'];
```

특정 문자열로부터 완성될 수 있는 문자열들을 확인할 수 있습니다.

```typescript
trie.insert('오리');
trie.insert('올리브');
trie.insert('옳은');

console.log(trie.autocomplete('올')); // ['오리', '올리브', '옳은']
```

## License
MIT License

Copyright (c) 2026 Donghyeon Lee
