import { useState } from 'react';
import type { CollectionCard } from '../../hooks/Collection/collectionTypes.tsx';
import { supabase } from "../../lib/supabase"
import LockedCardFront from './LockedCardFront.tsx';
import CardFront from './CardFront.tsx';
import CardBack from './CardBack.tsx';
import IconButton from '../IconButton.tsx';

type CardProp = {
    card: CollectionCard;
    userId?: string | null; // To update whether card is added to deck; might be null if is not signed in
}

// API call to update the value of added_deck when the button clicked
async function updateCardWishlist(user_card_id: number, user_id: string, added: boolean) {
    const { data, error } = await supabase.rpc("update_added_deck_checks", {
        p_user_card_id: user_card_id, 
        p_user_id: user_id, 
        p_added: added
    });

    if (error) throw error; 
    const result = data?.[0]; 

    return result; 
}

function CollectionCardRender({ card, userId }: CardProp) {
    const [cardFront, setCardFront] = useState(true);
    const [dunkRoyale, setDunkRoyale] = useState(card.added_deck); // Stores default if it's a part of dunk royale to update otherwise from here front end

    async function handleClick() {
        // Front-end update 
        const newValue = !dunkRoyale; // Temporary antes de hacer los checks
        console.log(`Clicked now ${dunkRoyale}`);

        // Backend call
        try {
            console.log("Call API");
            const result = await updateCardWishlist(card.user_card_id, userId ?? 'a', newValue); // The user w id a doesn't exist, button shouldn't even appear to them but just in case

            // Uses query added_deck status to update front-end button
            if (result.success) {
                setDunkRoyale(result.added_deck); 
            } 

            console.log(result.message); // Just to see what was recieved in message 
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