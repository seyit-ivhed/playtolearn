import { useState, useRef, useEffect } from 'react';
import type { EncounterUnit } from '../../../types/encounter.types';

export const useUnitCardAnimations = (unit: EncounterUnit, isMonster: boolean) => {
    const [animationClass, setAnimationClass] = useState('');
    const [shieldAnimClass, setShieldAnimClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; type: 'damage' | 'heal' }[]>([]);

    // Track previous values in refs for effect-based change detection
    const prevHealthRef = useRef(unit.currentHealth);
    const prevHasActedRef = useRef(unit.hasActed);
    const textIdCounter = useRef(0);

    // Handle health and shield changes
    useEffect(() => {
        // Health changes
        if (unit.currentHealth !== prevHealthRef.current) {
            const healthDiff = unit.currentHealth - prevHealthRef.current;
            prevHealthRef.current = unit.currentHealth;

            setTimeout(() => {
                if (healthDiff < 0) {
                    setAnimationClass('anim-shake-damage');

                    // Trigger shield animation if active
                    const hasShield = unit.statusEffects?.some(e => e.type === 'SHIELD');
                    if (hasShield) {
                        setShieldAnimClass('shield-absorb-anim');
                    }
                }

                // Add Floating Text
                const id = textIdCounter.current++;
                const text = healthDiff > 0 ? `+${healthDiff}` : `${healthDiff}`;
                const type = healthDiff > 0 ? 'heal' : 'damage';

                setFloatingTexts(prev => [...prev, { id, text, type }]);
            }, 0);
        }

        // Monster attack lunge
        if (isMonster && unit.hasActed !== prevHasActedRef.current) {
            prevHasActedRef.current = unit.hasActed;
            if (unit.hasActed && !unit.isDead) {
                setTimeout(() => {
                    setAnimationClass('anim-lunge-left');
                }, 0);
            }
        }
    }, [unit.currentHealth, unit.hasActed, unit.isDead, isMonster, unit.statusEffects]);

    // Effect for cleanup and timeouts only
    useEffect(() => {
        // Cleanup shake
        if (animationClass === 'anim-shake-damage') {
            const timer = setTimeout(() => setAnimationClass(''), 500);
            return () => clearTimeout(timer);
        }
        // Cleanup lunge
        if (animationClass === 'anim-lunge-left') {
            const timer = setTimeout(() => setAnimationClass(''), 300);
            return () => clearTimeout(timer);
        }
    }, [animationClass]);

    useEffect(() => {
        // Cleanup shield anim
        if (shieldAnimClass === 'shield-absorb-anim') {
            const timer = setTimeout(() => setShieldAnimClass(''), 500);
            return () => clearTimeout(timer);
        }
    }, [shieldAnimClass]);

    useEffect(() => {
        // Cleanup floating texts
        if (floatingTexts.length > 0) {
            const timers = floatingTexts.map(ft => {
                return setTimeout(() => {
                    setFloatingTexts(prev => prev.filter(item => item.id !== ft.id));
                }, 1500);
            });
            return () => timers.forEach(t => clearTimeout(t));
        }
    }, [floatingTexts]); // Now correctly dependent on floatingTexts

    return {
        animationClass,
        setAnimationClass,
        shieldAnimClass,
        floatingTexts
    };
};
