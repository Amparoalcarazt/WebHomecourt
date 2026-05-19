// Prop for rarity circle
interface RarityProp {
    type: 'common' | 'rare' | 'legendary' | 'limited' | 'locked' ; 
    labelText: string; // What is shown in frontend
}

// Record sirve para poder alt el style and kinda "inject it" depending on the var recieved
const typeStyles: Record<string, string> = {
    common: "bg-royal-blue", 
    locked: "bg-Gris-Oscuro"
};

function RarityLabelCircle({
    type = 'common',
    labelText,
}: RarityProp) {
    return (
        <div className={`w-32 py-1.5 text-center rounded-full ${typeStyles[type]} text-lg text-white`}>
            {labelText}
        </div>
    )
}

export default RarityLabelCircle;