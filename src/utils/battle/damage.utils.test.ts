import { describe, it, expect } from 'vitest';
import { applyDamage, type DamageableUnit } from './damage.utils';

describe('damage.utils', () => {
    describe('applyDamage', () => {
        it('should apply damage to health when no shield', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                currentShield: 0,
                isDead: false
            };

            const result = applyDamage(unit, 30);

            expect(result.unit.currentHealth).toBe(70);
            expect(result.unit.currentShield).toBe(0);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(30);
            expect(result.shieldDamage).toBe(0);
            expect(result.healthDamage).toBe(30);
        });

        it('should absorb damage with shield when shield is sufficient', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                currentShield: 50,
                isDead: false
            };

            const result = applyDamage(unit, 30);

            expect(result.unit.currentHealth).toBe(100);
            expect(result.unit.currentShield).toBe(20);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(30);
            expect(result.shieldDamage).toBe(30);
            expect(result.healthDamage).toBe(0);
        });

        it('should apply remaining damage to health when shield is insufficient', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                currentShield: 20,
                isDead: false
            };

            const result = applyDamage(unit, 50);

            expect(result.unit.currentHealth).toBe(70);
            expect(result.unit.currentShield).toBe(0);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(50);
            expect(result.shieldDamage).toBe(20);
            expect(result.healthDamage).toBe(30);
        });

        it('should mark unit as dead when health reaches 0', () => {
            const unit: DamageableUnit = {
                currentHealth: 30,
                currentShield: 0,
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
                currentShield: 0,
                isDead: false
            };

            const result = applyDamage(unit, 50);

            expect(result.unit.currentHealth).toBe(0);
            expect(result.unit.isDead).toBe(true);
            expect(result.damageDealt).toBe(20);
            expect(result.healthDamage).toBe(20);
        });

        it('should handle zero damage', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                currentShield: 50,
                isDead: false
            };

            const result = applyDamage(unit, 0);

            expect(result.unit.currentHealth).toBe(100);
            expect(result.unit.currentShield).toBe(50);
            expect(result.unit.isDead).toBe(false);
            expect(result.damageDealt).toBe(0);
        });

        it('should not mutate original unit', () => {
            const unit: DamageableUnit = {
                currentHealth: 100,
                currentShield: 50,
                isDead: false
            };

            const originalHealth = unit.currentHealth;
            const originalShield = unit.currentShield;

            applyDamage(unit, 30);

            expect(unit.currentHealth).toBe(originalHealth);
            expect(unit.currentShield).toBe(originalShield);
        });
    });
});
