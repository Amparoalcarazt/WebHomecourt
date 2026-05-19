import { useState } from 'react';
import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';
import LockedCardFront from './LockedCardFront.tsx';

type CardProp = {
    card: CollectionCard;
}

function CollectionCardRender({ card }: CardProp) {
    const [cardFront, setCardFront] = useState(true);

    if (card.user_owned) {
        return (
            <div onClick={() => setCardFront((prev) => !prev)}>
                {cardFront ? (
                    <div>
                        <h3>{card.player_name}</h3>
                        <p>Unlocked: {card.times_unlocked} times</p>
                    </div>
                ) : (
                    <div>
                        <h3>Back stats</h3>
                    </div>
                )}
            </div>
        )
    }
    // Doesn't own it, will show the back or also useful if smth were to fail 
    else {
        return <LockedCardFront card={card} />;
    }
}

export default CollectionCardRender