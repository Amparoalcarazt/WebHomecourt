import { useState } from 'react';
import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';
import LockedCardFront from './LockedCardFront.tsx';
import CardFront from './CardFront.tsx';
import CardBack from './CardBack.tsx';
import IconButton from '../IconButton.tsx';

type CardProp = {
    card: CollectionCard;
    userId?: string | null; // To update whether card is added to deck; might be null if is not signed in
}

// API call to update the value of added_deck when the button clicked

function CollectionCardRender({ card }: CardProp) {
    const [cardFront, setCardFront] = useState(true);
    const [dunkRoyale, setDunkRoyale] = useState(card.added_deck); // Stores default if it's a part of dunk royale to update otherwise from here front end

    async function handleClick() {
        // Front-end update 
        setDunkRoyale(!dunkRoyale); // Flips value for frontend rendering
        console.log(`Clicked now ${dunkRoyale}`);

        // Backend call
        try {
            console.log("Call API");
        } catch (e) {
            console.error(e);
        }
    }

    if (card.user_owned) {
        return (
            <div className="flex flex-col mb-4 items-center justify-center">
                {/* Card front and back switching  */}
                <div onClick={() => setCardFront((prev) => !prev)}>
                    {cardFront ? (
                        <CardFront card={card} />
                    ) : (
                        <CardBack card={card} />
                    )}
                </div>

                {/* Add to deck */}
                <IconButton
                    onClick={() => { handleClick() }}
                    leftMaterial={!dunkRoyale ? "add_circle" : "remove_circle"}
                    text={!dunkRoyale ? "Add to Dunk Royale" : "Remove from Dunk Royale"}
                    className="w-90% mt-4"
                />

            </div>

        )
    }
    // Doesn't own it, will show the back or also useful if smth were to fail 
    else {
        return (
            <div className="flex flex-col items-center">
                <LockedCardFront card={card} />
            </div>

        )

    }
}

export default CollectionCardRender