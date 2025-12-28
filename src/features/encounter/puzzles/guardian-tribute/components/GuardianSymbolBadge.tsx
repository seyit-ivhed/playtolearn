interface GuardianSymbolBadgeProps {
    symbol: string;
    size?: string;
    boxSize?: string;
    style?: React.CSSProperties;
}

export const GuardianSymbolBadge = ({
    symbol,
    size = '3.5rem',
    boxSize = '80px',
    style = {}
}: GuardianSymbolBadgeProps) => (
    <div style={{
        fontSize: size,
        color: '#d4af37',
        fontWeight: 'bold',
        fontFamily: 'serif',
        textShadow: '0 4px 8px rgba(0,0,0,0.9)',
        background: 'rgba(0,0,0,0.6)',
        width: boxSize,
        height: boxSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '2px solid rgba(212, 175, 55, 0.4)',
        boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.2)',
        lineHeight: '1',
        ...style
    }}>
        {symbol}
    </div>
);
