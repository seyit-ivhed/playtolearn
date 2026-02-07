---
trigger: always_on
---

* Do not unit test .tsx files. Instead try to extract complex logic to .ts files
* Implement unit tests for .ts files
* Make sure unit tests does not do I/O operations so they are always fast