import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';
import LockedCardFront from './LockedCardFront.tsx';

type CardProp = {
    card: CollectionCard;
}

function CollectionCardRender ( {card}: CardProp ) {
    if (!card.user_owned) {
       return <LockedCardFront card={card} />;
    } else {
        return (
            <div className="h-96">
                <h3>{card.player_name}</h3>
                <p>Unlocked: {card.times_unlocked} times</p>
            </div>
        )
    }
}

export default CollectionCardRender