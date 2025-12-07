import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/game.store';
import { useCombatStore } from '../stores/combat.store';

const FantasyMapPath = ({ currentNode }: { currentNode: number }) => {
    // Vertical Layout Nodes
    const nodes = [
        { id: 1, x: '50%', y: 100, label: 'Start' },
        { id: 2, x: '30%', y: 300, label: 'Forest' },
        { id: 3, x: '70%', y: 500, label: 'River' },
        { id: 4, x: '40%', y: 700, label: 'Cave' },
        { id: 5, x: '50%', y: 900, label: 'Boss' }
    ];

    const navigate = useNavigate();
    const { activeParty: party } = useGameStore();
    const { initializeCombat } = useCombatStore();

    const handleNodeClick = (nodeId: number) => {
        if (nodeId === currentNode) {
            const enemies = nodeId === 5 ? ['stone_golem'] : ['goblin_scout', 'goblin_scout'];
            initializeCombat(party, enemies);
            navigate('/encounter');
        }
    };

    return (
        <div className="relative w-full min-h-[1100px] overflow-hidden">
            {/* Integrated Header */}
            <div className="absolute top-0 left-0 right-0 p-6 text-center z-10 pointer-events-none">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" data-testid="map-title">Adventure Map</h1>
                <p className="text-[var(--color-text-secondary)] font-bold drop-shadow-md">Level {currentNode} - The Journey Begins</p>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 bg-[url('/bg-map-pattern.png')] bg-repeat"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Winding Path - Coordinates must match the nodes roughly directly since we used % for nodes but need px for SVG path. 
                    Approximating % to pixels based on container width assumption is tricky for responsive SVG. 
                    Better to use absolute coordinates for SVG and nodes, or use 0-100 viewBox.
                    Let's use a standard width of 400px for the path definition and scale it? 
                    Actually, let's use a fixed width container for the map path to ensure alignment, centered in the screen.
                */}
            </svg>
            {/* 
                Re-implementing with a centered max-width container for reliable alignment 
                between HTML nodes and SVG path.
            */}
            <div className="absolute inset-0 flex justify-center">
                <div className="relative w-full max-w-lg h-full">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 1100" preserveAspectRatio="xMidYMin slice">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        {/* 
                            Path Logic:
                            Start: 250, 100
                            Forest: 150, 300
                            River: 350, 500
                            Cave: 200, 700
                            Boss: 250, 900
                        */}
                        <path
                            d="M 250 100 
                               C 250 200, 150 200, 150 300 
                               S 350 400, 350 500 
                               S 200 600, 200 700 
                               S 250 800, 250 900"
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

                        let statusClass = "bg-slate-700 ring-4 ring-slate-800 cursor-not-allowed opacity-70 grayscale";
                        if (isCurrent) statusClass = "bg-[var(--color-brand-accent)] ring-4 ring-yellow-400 cursor-pointer animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.6)]";
                        if (isCompleted) statusClass = "bg-[var(--color-success)] ring-4 ring-green-800 cursor-pointer";

                        return (
                            <div
                                key={node.id}
                                className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 z-10`}
                                style={{ left: leftPos, top: topPos }}
                                onClick={() => !isLocked && handleNodeClick(node.id)}
                            >
                                {/* Node Circle */}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl ${statusClass}`} data-testid={`map-node-${node.id}`}>
                                    {isCompleted ? '✓' : node.id}
                                </div>

                                {/* Label */}
                                <div className={`mt-3 px-4 py-1 rounded-full text-sm font-bold shadow-lg border-2 backdrop-blur-md uppercase tracking-wider ${isCurrent ? 'bg-yellow-900/80 border-yellow-500 text-yellow-200' : 'bg-slate-900/80 border-slate-700 text-slate-300'}`}>
                                    {node.label}
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
    const navigate = useNavigate();
    const { currentMapNode } = useGameStore();

    return (
        <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black overflow-y-auto custom-scrollbar">

            <main className="min-h-full pb-32"> {/* pb-32 to allow scrolling past the last node */}
                <FantasyMapPath currentNode={currentMapNode} />
            </main>

            {/* FAB Camp Navigation */}
            <button
                onClick={() => navigate('/camp')}
                className="fixed bottom-6 right-6 w-16 h-16 bg-[var(--color-brand-secondary)] hover:bg-[var(--color-brand-primary)] text-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-[var(--color-bg-tertiary)] flex items-center justify-center text-3xl transition-all transform hover:scale-110 hover:rotate-3 z-50 active:scale-95"
                title="Go to Camp"
                data-testid="nav-camp-btn"
            >
                ⛺
            </button>
        </div>
    );
};

export default MapPage;
