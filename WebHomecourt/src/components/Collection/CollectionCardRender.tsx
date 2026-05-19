import { useState } from 'react';
import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';
import LockedCardFront from './LockedCardFront.tsx';
import CardFront from './CardFront.tsx';

type CardProp = {
    card: CollectionCard;
    userId?: string | null; // To update whether card is added to deck; might be null if is not signed in
}

function CollectionCardRender({ card }: CardProp) {
    const [cardFront, setCardFront] = useState(true);

    if (card.user_owned) {
        return (
            <div onClick={() => setCardFront((prev) => !prev)}>
                {cardFront ? (
                    <CardFront card={card} />
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