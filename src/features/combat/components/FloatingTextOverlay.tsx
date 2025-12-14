interface FloatingText {
    id: number;
    text: string;
    type: 'damage' | 'heal' | 'shield-damage';
}

interface FloatingTextOverlayProps {
    floatingTexts: FloatingText[];
}

export const FloatingTextOverlay = ({ floatingTexts }: FloatingTextOverlayProps) => {
    return (
        <div className="floating-text-container">
            {floatingTexts.map(ft => (
                <div
                    key={ft.id}
                    className={`floating-number ${ft.type}`}
                >
                    {ft.text}
                </div>
            ))}
        </div>
    );
};
