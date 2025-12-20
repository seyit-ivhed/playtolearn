import { useState, useRef, useEffect } from 'react';
import type { EncounterUnit } from '../../../types/encounter.types';

export const useUnitCardAnimations = (unit: EncounterUnit, isMonster: boolean) => {
    const [animationClass, setAnimationClass] = useState('');
    const [shieldAnimClass, setShieldAnimClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; type: 'damage' | 'heal' | 'shield-damage' }[]>([]);

    // Use refs to track previous values for diffing
    const prevHealth = useRef(unit.currentHealth);
    const prevShield = useRef(unit.currentShield);
    const textIdCounter = useRef(0);

    // Watch for health and shield changes to trigger damage/heal effects
    useEffect(() => {
        // Health Changes
        const healthDiff = unit.currentHealth - prevHealth.current;
        if (healthDiff !== 0) {
            // Trigger Shake if damage
            if (healthDiff < 0) {
                setAnimationClass('anim-shake-damage');
            }

            // Add Floating Text
            const id = textIdCounter.current++;
            const text = healthDiff > 0 ? `+${healthDiff}` : `${healthDiff}`;
            const type = healthDiff > 0 ? 'heal' : 'damage';

            setFloatingTexts(prev => [...prev, { id, text, type }]);

            // Cleanup floating text after animation (1.5s in CSS)
            setTimeout(() => {
                setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
            }, 1500);

            // Cleanup shake class
            if (healthDiff < 0) {
                setTimeout(() => setAnimationClass(''), 500);
            }
        }
        prevHealth.current = unit.currentHealth;

        // Shield Changes
        const shieldDiff = unit.currentShield - prevShield.current;
        if (shieldDiff !== 0) {
            // Only show if damage (negative diff) - unless we want to show shield gain too?
            // Request said "if a monster damages the shield"
            if (shieldDiff < 0) {
                const id = textIdCounter.current++;
                const text = `${shieldDiff}`;
                const type = 'shield-damage';

                setFloatingTexts(prev => [...prev, { id, text, type }]);

                // Trigger Shield Absorb Animation
                setShieldAnimClass('shield-absorb-anim');
                setTimeout(() => setShieldAnimClass(''), 500);

                setTimeout(() => {
                    setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
                }, 1000);
            }
        }
        prevShield.current = unit.currentShield;
    }, [unit.currentHealth, unit.currentShield]);

    // Watch for action to trigger attack animation (Monsters)
    useEffect(() => {
        if (isMonster && unit.hasActed && !unit.isDead) {
            setAnimationClass('anim-lunge-left');
            setTimeout(() => setAnimationClass(''), 300);
        }
    }, [unit.hasActed, isMonster, unit.isDead]);

    return {
        animationClass,
        setAnimationClass,
        shieldAnimClass,
        floatingTexts
    };
};
