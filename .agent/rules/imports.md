---
trigger: always_on
---

Use absolute imports instead of relative ones:

This is good: import { PuzzleType } from '@/types/adventure.types';
This is bad: import { PuzzleType } from '../../../../types/adventure.types';