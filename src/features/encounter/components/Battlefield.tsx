import { motion, AnimatePresence } from 'framer-motion';
import type { EncounterUnit, EncounterPhase } from '../../../types/encounter.types';
import { UnitCard } from './UnitCard';
import { useTranslation } from 'react-i18next';

interface BattlefieldProps {
    party: EncounterUnit[];
    monsters: EncounterUnit[];
    visibleMonsterIds: string[];
    phase: EncounterPhase;
    isEncounterOver: boolean;
    activeVFXType?: string;
    activeChallengeUnitId?: string | null;
    isVFXActive: boolean;
    onUnitAction: (unitId: string) => void;
}

export const Battlefield = ({
    party,
    monsters,
    visibleMonsterIds,
    phase,
    isEncounterOver,
    activeVFXType,
    activeChallengeUnitId,
    isVFXActive,
    onUnitAction
}: BattlefieldProps) => {
    const { t } = useTranslation();
    const visibleMonsters = monsters.filter(m => visibleMonsterIds.includes(m.id));

    return (
        <div className="battlefield">
            <div className="battle-layout">
                {/* Party Grid */}
                <div className="party-grid">
                    {party.map(unit => (
                        <div key={unit.id} className="card-wrapper">
                            <UnitCard
                                unit={unit}
                                phase={phase}
                                onAct={() => onUnitAction(unit.id)}
                                activeVisualEffect={activeVFXType}
                                disableInteraction={isEncounterOver || !!activeChallengeUnitId || isVFXActive}
                            />
                        </div>
                    ))}
                </div>

                {/* VS Indicator */}
                <div className="vs-indicator">
                    <div className="vs-line"></div>
                    <span className="vs-text">{t('encounter.vs', 'VS')}</span>
                    <div className="vs-line bottom"></div>
                </div>

                {/* Monsters Grid */}
                <div className="monster-grid">
                    <AnimatePresence mode="popLayout">
                        {visibleMonsters.map(unit => (
                            <motion.div
                                key={unit.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.5,
                                    filter: "blur(10px)",
                                    transition: { duration: 0.5 }
                                }}
                            >
                                <UnitCard
                                    unit={unit}
                                    phase={phase}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
