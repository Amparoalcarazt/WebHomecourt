import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';

type CardProp = {
    card: CollectionCard;
}

function CollectionCardRender ( {card}: CardProp ) {
    return (
        <div className="h-[8rem]">
            <h3>{card.player_name}</h3>
            <p>Unlocked: {card.times_unlocked} times</p>
        </div>
    )
}

export default CollectionCardRender