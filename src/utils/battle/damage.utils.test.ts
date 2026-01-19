import { describe, it, expect } from 'vitest';
import { applyDamage, type DamageableUnit } from './damage.utils';

describe('damage.utils', () => {
    describe('applyDamage', () => {
        it('should apply damage to health', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                isDead: false
            };

            const result = applyDamage(unit, 30);

            expect(result.unit.currentHealth).toBe(70);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(30);
        });

        it('should mark unit as dead when health reaches 0', () => {
            const unit: DamageableUnit = {
                currentHealth: 30,
                isDead: false
            };

            const result = applyDamage(unit, 30);

            expect(result.unit.currentHealth).toBe(0);
            expect(result.unit.isDead).toBe(true);
            expect(result.damageDealt).toBe(30);
        });

        it('should mark unit as dead when damage exceeds health', () => {
            const unit: DamageableUnit = {
                currentHealth: 20,
                isDead: false
            };

            const result = applyDamage(unit, 50);

            expect(result.unit.currentHealth).toBe(0);
            expect(result.unit.isDead).toBe(true);
            expect(result.damageDealt).toBe(20);
        });

        it('should handle zero damage', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                isDead: false
            };

            const result = applyDamage(unit, 0);

            expect(result.unit.currentHealth).toBe(100);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(0);
        });

        it('should not mutate original unit', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                isDead: false
            };

            const originalHealth = unit.currentHealth;

            applyDamage(unit, 30);

            expect(unit.currentHealth).toBe(originalHealth);
        });
    });
});
