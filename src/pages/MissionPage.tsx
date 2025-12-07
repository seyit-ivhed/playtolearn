import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/game.store';
import { useCombatStore } from '../stores/combat.store';

const FantasyMapPath = ({ currentNode }: { currentNode: number }) => {
    const { t } = useTranslation();

    // Vertical Layout Nodes - Shifted down by 150px to clear header
    // Added 'type' to distinguish between combat and camp nodes
    const nodes = [
        { id: 1, x: '50%', y: 250, label: t('mission.nodes.start'), type: 'combat' },
        { id: 2, x: '30%', y: 450, label: t('mission.nodes.forest'), type: 'combat' },
        { id: 3, x: '70%', y: 650, label: t('mission.nodes.camp'), type: 'camp' }, // Camp Node
        { id: 4, x: '40%', y: 850, label: t('mission.nodes.cave'), type: 'combat' },
        { id: 5, x: '50%', y: 1050, label: t('mission.nodes.boss'), type: 'combat' }
    ];

    const navigate = useNavigate();
    const { activeParty: party } = useGameStore();
    const { initializeCombat } = useCombatStore();

    const handleNodeClick = (node: typeof nodes[0]) => {
        if (node.type === 'camp') {
            navigate('/camp');
            return;
        }

        // Combat Logic
        const enemies = node.id === 5 ? ['stone_golem'] : ['goblin_scout', 'goblin_scout'];
        initializeCombat(party, enemies);
        navigate('/encounter');
    };

    return (
        <div className="relative w-full min-h-[1300px] overflow-hidden">
            {/* Integrated Header */}
            <div className="absolute top-0 left-0 right-0 pt-12 pb-6 px-6 text-center z-10 pointer-events-none">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-2" data-testid="map-title">Adventure Map</h1>
                <p className="text-xl text-[var(--color-text-secondary)] font-bold drop-shadow-md tracking-wider">Level {currentNode} - The Journey Begins</p>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 bg-[url('/bg-map-pattern.png')] bg-repeat"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Spacer for SVG layers if needed */}
            </svg>

            {/* 
                Re-implementing with a centered max-width container for reliable alignment 
                between HTML nodes and SVG path.
            */}
            <div className="absolute inset-0 flex justify-center">
                <div className="relative w-full max-w-lg h-full">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 1300" preserveAspectRatio="xMidYMin slice">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        {/* 
                            Path Logic (Shifted +150px Y):
                            Start: 250, 250
                            Forest: 150, 450
                            River: 350, 650
                            Cave: 200, 850
                            Boss: 250, 1050
                        */}
                        <path
                            d="M 250 250 
                               C 250 350, 150 350, 150 450 
                               S 350 550, 350 650 
                               S 200 750, 200 850 
                               S 250 950, 250 1050"
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray="20 30"
                            className="drop-shadow-lg"
                        />
                    </svg>

                    {nodes.map((node) => {
                        const isCompleted = node.id < currentNode;
                        const isCurrent = node.id === currentNode;
                        const isLocked = node.id > currentNode;
                        const isCamp = node.type === 'camp';

                        // Map % coordinates to our viewBox system (500 width)
                        // This logic must match the SVG path coordinates above!
                        // id 1: 50% (250), 100
                        // id 2: 30% (150), 300 
                        // id 3: 70% (350), 500
                        // id 4: 40% (200), 700
                        // id 5: 50% (250), 900
                        let leftPos = '50%';
                        if (node.id === 2) leftPos = '30%'; // 150/500 = 30%
                        if (node.id === 3) leftPos = '70%'; // 350/500 = 70%
                        if (node.id === 4) leftPos = '40%'; // 200/500 = 40%

                        let topPos = node.y; // pixels

                        // Base styles
                        let statusClass = "bg-slate-700 ring-4 ring-slate-800 cursor-not-allowed opacity-70 grayscale";
                        let labelClass = "bg-slate-900/90 border-slate-700 text-slate-300";
                        let nodeSizeClass = "w-24 h-24 rounded-full"; // Default circle

                        // Camp specific overrides
                        if (isCamp) {
                            nodeSizeClass = "w-28 h-28 rounded-3xl rotate-45 border-4 border-dashed"; // Diamond/Square shape for Camp
                        }

                        // Current node styles
                        if (isCurrent) {
                            labelClass = "bg-yellow-900/90 border-yellow-500 text-yellow-100";
                            if (isCamp) {
                                statusClass = "bg-gradient-to-br from-emerald-500 to-teal-700 ring-4 ring-emerald-300 cursor-pointer animate-pulse shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                                labelClass = "bg-emerald-900/95 border-emerald-400 text-emerald-100 text-lg tracking-widest px-8 py-3 ring-2 ring-emerald-500/50";
                            } else {
                                statusClass = "bg-[var(--color-brand-accent)] ring-4 ring-yellow-400 cursor-pointer animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.6)]";
                            }
                        }

                        // Completed node styles
                        if (isCompleted) {
                            if (isCamp) {
                                statusClass = "bg-emerald-900 ring-4 ring-emerald-800 cursor-pointer opacity-80";
                            } else {
                                statusClass = "bg-[var(--color-success)] ring-4 ring-green-800 cursor-pointer";
                            }
                        }

                        return (
                            <div
                                key={node.id}
                                className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 z-10`}
                                style={{ left: leftPos, top: topPos }}
                                onClick={() => !isLocked && handleNodeClick(node)}
                            >
                                {/* Node Shape */}
                                <div className={`${nodeSizeClass} flex items-center justify-center shadow-2xl ${statusClass}`} data-testid={`map-node-${node.id}`}>
                                    {/* Rotate icon back if container is rotated */}
                                    <span className={isCamp ? '-rotate-45 text-5xl drop-shadow-md' : 'text-4xl font-black'}>
                                        {isCompleted ? '✓' : (isCamp ? '⛺' : node.id)}
                                    </span>
                                </div>

                                {/* Label */}
                                <div className={`mt-6 px-6 py-2 rounded-full font-bold shadow-lg border-2 backdrop-blur-md uppercase ${labelClass}`}>
                                    {isCamp && <span className="mr-2">✨</span>}
                                    {node.label}
                                    {isCamp && <span className="ml-2">✨</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MapPage = () => {
    const { currentMapNode } = useGameStore();

    return (
        <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black overflow-y-auto custom-scrollbar">

            <main className="min-h-full pb-32"> {/* pb-32 to allow scrolling past the last node */}
                <FantasyMapPath currentNode={currentMapNode} />
            </main>
        </div>
    );
};

export default MapPage;
