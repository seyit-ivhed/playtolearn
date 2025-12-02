---
trigger: always_on
---

- Do not use `enum`. Use `const` objects with `as const` and derived types instead, to avoid errors with `erasableSyntaxOnly` / `verbatimModuleSyntax`.
  Example:
  ```typescript
  // BAD
  export enum MyEnum {
    A = 'A',
    B = 'B'
  }
  // GOOD
  export const MyEnum = {
    A: 'A',
    B: 'B'
  } as const;
  export type MyEnum = typeof MyEnum[keyof typeof MyEnum];