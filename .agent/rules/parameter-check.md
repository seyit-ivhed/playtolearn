---
trigger: always_on
---

Inside a function if a particular parameter or dependency is expected for the correct execution check it's existance and type. If the parameter or dependency does not have the expected values display a console.error log and return

if (!stats) {
    console.error(`Companion stats not found in levelUpCompanion for ${companionId}`);
    return;
}

if (typeof stats.level !== 'number') {
    console.error(`Invalid level for companion ${companionId}`);
    return;
}

Do not try to fill this dependency with a default value.