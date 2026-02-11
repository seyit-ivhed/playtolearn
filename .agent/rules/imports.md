---
trigger: always_on
---

Use relative imports instead of absolute ones

This is bad: import { PuzzleType } from '@/types/adventure.types';
This is good: import { PuzzleType } from '../../../../types/adventure.types';