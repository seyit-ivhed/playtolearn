import { useState, useRef, useEffect } from 'react';
import type { EncounterUnit } from '../../../types/encounter.types';

export const useUnitCardAnimations = (unit: EncounterUnit, isMonster: boolean) => {
    const [animationClass, setAnimationClass] = useState('');
    const [shieldAnimClass, setShieldAnimClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; type: 'damage' | 'heal' | 'shield-damage' }[]>([]);

    // Adjust state during render based on props to avoid cascading renders in useEffect
    const [prevHealth, setPrevHealth] = useState(unit.currentHealth);
    const [prevShield, setPrevShield] = useState(unit.currentShield);
    const textIdCounter = useRef(0);

    if (unit.currentHealth !== prevHealth) {
        const healthDiff = unit.currentHealth - prevHealth;
        setPrevHealth(unit.currentHealth);

        if (healthDiff < 0) {
            setAnimationClass('anim-shake-damage');
        }

        // Add Floating Text
        const id = textIdCounter.current++;
        const text = healthDiff > 0 ? `+${healthDiff}` : `${healthDiff}`;
        const type = healthDiff > 0 ? 'heal' : 'damage';

        setFloatingTexts(prev => [...prev, { id, text, type }]);
    }

    if (unit.currentShield !== prevShield) {
        const shieldDiff = unit.currentShield - prevShield;
        setPrevShield(unit.currentShield);

        if (shieldDiff < 0) {
            const id = textIdCounter.current++;
            const text = `${shieldDiff}`;
            const type = 'shield-damage';

            setFloatingTexts(prev => [...prev, { id, text, type }]);
            setShieldAnimClass('shield-absorb-anim');
        }
    }

    // Handle monster attack lunge (adjust during render)
    const [prevHasActed, setPrevHasActed] = useState(unit.hasActed);
    if (isMonster && unit.hasActed !== prevHasActed) {
        setPrevHasActed(unit.hasActed);
        if (unit.hasActed && !unit.isDead) {
            setAnimationClass('anim-lunge-left');
        }
    }

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
                const delay = ft.type === 'shield-damage' ? 1000 : 1500;
                return setTimeout(() => {
                    setFloatingTexts(prev => prev.filter(item => item.id !== ft.id));
                }, delay);
            });
            return () => timers.forEach(t => clearTimeout(t));
        }
    }, [floatingTexts.length]); // Track length to avoid too many effect runs

    return {
        animationClass,
        setAnimationClass,
        shieldAnimClass,
        floatingTexts
    };
};
