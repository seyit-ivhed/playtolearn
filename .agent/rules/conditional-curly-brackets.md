---
trigger: always_on
---

Always use curly brackets in conditional statements even if the content is one line. For example do this:

```javascript
if (companion.level >= EXPERIENCE_CONFIG.MAX_LEVEL) {
   return false;
}
```

And DONT DO THIS:

```javascript
if (companion.level >= EXPERIENCE_CONFIG.MAX_LEVEL) return false;
```