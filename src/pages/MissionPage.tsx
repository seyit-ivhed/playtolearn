import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/game.store';
import { useCombatStore } from '../stores/combat.store';

// We can put the Map SVG component here for now or separate it
const FantasyMapPath = ({ currentNode }: { currentNode: number }) => {
    const nodes = [
        { id: 1, x: 100, y: 300, label: 'Start' },
        { id: 2, x: 250, y: 150, label: 'Forest' },
        { id: 3, x: 450, y: 200, label: 'River' },
        { id: 4, x: 600, y: 100, label: 'Cave' },
        { id: 5, x: 800, y: 250, label: 'Boss' }
    ];

    const navigate = useNavigate();
    const { activeParty: party } = useGameStore();
    const { initializeCombat } = useCombatStore();

    const handleNodeClick = (nodeId: number) => {
        if (nodeId === currentNode) {
            // Start Encounter
            // Simple mock enemy selection based on node
            const enemies = nodeId === 5 ? ['stone_golem'] : ['goblin_scout', 'goblin_scout'];
            initializeCombat(party, enemies);
            navigate('/encounter');
        }
    };

    return (
        <div className="relative w-full h-[500px] bg-[var(--color-bg-secondary)] rounded-3xl shadow-inner border-4 border-[var(--color-bg-tertiary)] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 bg-[url('/bg-map-pattern.png')]"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Winding Path */}
                <path
                    d="M 100 300 C 150 200, 200 150, 250 150 S 350 250, 450 200 S 550 50, 600 100 S 700 300, 800 250"
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="10 15"
                />
            </svg>

            {nodes.map((node) => {
                const isCompleted = node.id < currentNode;
                const isCurrent = node.id === currentNode;
                const isLocked = node.id > currentNode;

                let statusClass = "bg-gray-400 cursor-not-allowed";
                if (isCurrent) statusClass = "bg-[var(--color-brand-accent)] cursor-pointer animate-bounce";
                if (isCompleted) statusClass = "bg-[var(--color-success)] cursor-pointer";

                return (
                    <div
                        key={node.id}
                        className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110`}
                        style={{ left: node.x, top: node.y }}
                        onClick={() => !isLocked && handleNodeClick(node.id)}
                    >
                        {/* Node Circle */}
                        <div className={`w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-white z-10 ${statusClass}`} data-testid={`map-node-${node.id}`}>
                            {isCompleted ? '✓' : node.id}
                        </div>

                        {/* Label */}
                        <div className="mt-2 bg-[var(--color-bg-primary)] px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-[var(--color-bg-tertiary)]">
                            {node.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MapPage = () => {
    const navigate = useNavigate();
    const { currentMapNode } = useGameStore();

    return (
        <div className="flex flex-col h-full p-4 gap-4">
            {/* Header */}
            <header className="flex justify-between items-center bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm border-b-4 border-[var(--color-bg-tertiary)]">
                <div>
                    <h1 className="text-3xl m-0" data-testid="map-title">Adventure Map</h1>
                    <p className="text-[var(--color-text-secondary)]">Level {currentMapNode} - The Journey Begins</p>
                </div>
                <button
                    onClick={() => navigate('/camp')}
                    className="flex items-center gap-2 bg-[var(--color-brand-secondary)]"
                    data-testid="nav-camp-btn"
                >
                    ⛺ Go to Camp
                </button>
            </header>

            {/* Main Map Area */}
            <main className="flex-1 flex items-center justify-center">
                <FantasyMapPath currentNode={currentMapNode} />
            </main>
        </div>
    );
};

export default MapPage;
