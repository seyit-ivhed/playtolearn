import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/game.store';
import { useCombatStore } from '../stores/combat.store';
import '../styles/pages/AdventurePage.css';

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
        <div className="map-container">
            {/* Integrated Header */}
            <div className="map-header">
                <h1 className="map-title" data-testid="map-title">Adventure Map</h1>
                <p className="map-subtitle">Level {currentNode} - The Journey Begins</p>
            </div>

            {/* Background decoration */}
            <div className="map-bg-pattern"></div>

            <svg className="map-svg-full">
                {/* Spacer for SVG layers if needed */}
            </svg>

            {/* 
                Re-implementing with a centered max-width container for reliable alignment 
                between HTML nodes and SVG path.
            */}
            <div className="map-center-col">
                <div className="map-col-inner">
                    <svg className="map-svg-path" viewBox="0 0 500 1300" preserveAspectRatio="xMidYMin slice">
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
                        />
                    </svg>

                    {nodes.map((node) => {
                        const isCompleted = node.id < currentNode;
                        const isCurrent = node.id === currentNode;
                        const isLocked = node.id > currentNode;
                        const isCamp = node.type === 'camp';

                        // Map % coordinates to our viewBox system (500 width)
                        let leftPos = '50%';
                        if (node.id === 2) leftPos = '30%'; // 150/500 = 30%
                        if (node.id === 3) leftPos = '70%'; // 350/500 = 70%
                        if (node.id === 4) leftPos = '40%'; // 200/500 = 40%

                        let topPos = node.y; // pixels

                        // CSS Classes Construction
                        const nodeContainerClasses = [
                            'node-container',
                            isCamp ? 'camp' : 'default',
                            isLocked ? 'locked' : '',
                            isCurrent ? 'current' : '',
                            isCompleted ? 'completed' : ''
                        ].filter(Boolean).join(' ');

                        const labelClasses = [
                            'node-label',
                            isCamp ? 'camp' : '',
                            isLocked ? 'locked' : '',
                            isCurrent ? 'current' : '',
                            isCompleted ? 'completed' : '' // Falls back to default/locked style unless specific 'completed' style added
                        ].filter(Boolean).join(' ');

                        return (
                            <div
                                key={node.id}
                                className="node-wrapper"
                                style={{ left: leftPos, top: topPos }}
                                onClick={() => !isLocked && handleNodeClick(node)}
                            >
                                {/* Node Shape */}
                                <div className={nodeContainerClasses} data-testid={`map-node-${node.id}`}>
                                    {/* Rotate icon back if container is rotated */}
                                    <span className="node-icon">
                                        {isCompleted ? '✓' : (isCamp ? '⛺' : node.id)}
                                    </span>
                                </div>

                                {/* Label */}
                                <div className={labelClasses}>
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

const AdventurePage = () => {
    const { currentMapNode } = useGameStore();

    return (
        <div className="adventure-page custom-scrollbar">
            <main className="adventure-content">
                <FantasyMapPath currentNode={currentMapNode} />
            </main>
        </div>
    );
};

export default AdventurePage;
