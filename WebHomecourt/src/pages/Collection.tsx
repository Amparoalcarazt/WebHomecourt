import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { useStoreUser } from '../hooks/useStoreUser.ts'; // Hook for store user, just to get sesh info
import Nav from '../components/Nav/Nav.tsx';
import Button from '../components/button.tsx';
// Specific to this screen
import CategorySummary from '../components/Collection/CategorySummary.tsx';
import CollectionCardRender from '../components/Collection/CollectionCardRender.tsx';
import type { CardSummary, CollectionCard } from '../hooks/Collection/collectionTypes.tsx';

// Handle API call
async function getCollectionSummary(userId: string | null) {
    const { data, error } = await supabase.rpc("collection_summary", {
        p_user_id: userId,
    });

    // Smth died
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get packs")
    }

    console.log("raw rpc data:", data);
    console.log("is array?", Array.isArray(data));

    // Data is not formatted as array, entcs hace un array vacío and sends that will show no user colls
    if (!Array.isArray(data)) return []

    console.log("raw data:", JSON.stringify(data, null, 2)) // A ver como se ve lo q fue fetched

    // Takes results del data and turns into the CollectedCard obj
    /*const summary: CardSummary[] = data.map(row => {
        // Creates the game items 
        return {
            unlocked_common: row.unlocked_common,
            total_common: row.total_common,
            unlocked_rare: row.unlocked_rare,
            total_rare: row.total_rare,
            unlocked_legendary: row.unlocked_legendary,
            total_legendary: row.total_legendary,
            unlocked_limited: row.unlocked_limited,
            total_limited: row.total_limited
        }
    });

    return summary;
    */
    return data;
}

// Get list of all cards and which ones the user owns 
async function getCollectionCards(userId: string | null) {
    // Call supabase funct
    const { data, error } = await supabase.rpc("card_collection", {
        p_user_id: userId,
    });

    // Smth died
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get collection cards")
    }

    console.log("raw rpc data:", data);
    console.log("is array?", Array.isArray(data));

    // Data is not formatted as array, entcs hace un array vacío and sends that will show no user colls
    if (!Array.isArray(data)) return []

    console.log("raw data:", JSON.stringify(data, null, 2)) // A ver como se ve lo q fue fetched

    // Takes results del data and turns into the CollectedCard obj
    const cards: CollectionCard[] = data.map(row => {
        // Creates the game items 
        return {
            card_id: row.card_id,
            player_name: row.player_name,
            web_url: row.web_url,
            attack: row.attack,
            defense: row.defense,
            velocity: row.velocity,
            rarity_id: row.rarity_id,
            rarity_label: row.rarity_label,
            // These can all be emtpy or 0 btw
            times_unlocked: row.times_unlocked,
            first_unlock: row.first_unlock,
            pack_name: row.pack_name,
            user_owned: row.user_owned,
            added_deck: row.added_deck
        }
    });

    return cards;
}

function Collection() {
    const navigate = useNavigate(); // Switch to diff screen
    const { storeUser } = useStoreUser(); // Use hook to get basic session and login info
    const [summary, setSummary] = useState<CardSummary | null>(null); // Says how many the user has unlocked
    const [cardCollection, setCardCollection] = useState<CollectionCard[]>([]); // List of cards in the collection
    const [page, setPage] = useState(0); // The state for pages

    // Get user session info 
    useEffect(() => {
        if (!storeUser.signedIn) {
            console.log("User not signed in");
        } else {
            console.log(`User ${storeUser.user_id} has ${storeUser.credits} credits`);
        }
    }, [storeUser]);

    // Obtain the collection summary 
    useEffect(() => {
        async function loadSummary() {
            try {
                const result = await getCollectionSummary(storeUser.user_id);
                setSummary(result?.[0] || null);
            } catch (err) {
                console.error(err);
                setSummary(null);
            }
        }

        loadSummary();
    }, [storeUser.user_id]);

    // Obtain card collection itself
    useEffect(() => {
        async function loadCards() {
            try {
                const result = await getCollectionCards(storeUser.user_id);
                setCardCollection(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadCards();
    }, [storeUser.user_id]);

    // Logic to paginate the colllection itself
    const PAGE_SIZE = 16; // Will be using 4x4 grid
    const totalPages = Math.ceil(cardCollection.length / PAGE_SIZE); // How many pages will be needed rounded up 
    const paginated = cardCollection.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE); // Divide by pages

    return (
        <div>
            <Nav current="Store" />
            <div className="px-4 py-5 md:px-14 md:py-5 bg-Background w-full">
                {/* Title comp */}
                <div className="w-full px-3 py-4 md:px-5 md:py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-left items-left overflow-hidden">
                    <h1 className="justify-start text-white title1">Laker Card Collection</h1>
                    <p className="justify-start text-white mt-2 text-xl text-zinc-300">Collect virtual cards to show off your favorite team and power up your Dunk Royale gameplay</p>
                </div>

                {/* View store vs colection */}
                <div className="flex flex-row justify-left mt-10 mb-8">
                    <Button
                        text="STORE"
                        type="secondary"
                        onClick={() => navigate('/store')}
                        className="text-2xl font-semibold px-10 mr-8"
                    />

                    <Button
                        text="COLLECTION"
                        type="primary"
                        onClick={() => { }}
                        className="text-2xl font-semibold px-10"
                    />
                </div>

                {/* How many cards the user has unlocked per category*/}
                <div className="grid grid-cols-2 justify-between items-center md:flex md:flex-row gap-4 md:justify-left">
                    <CategorySummary
                        category='Common'
                        unlocked={summary?.unlocked_common ?? 0}
                        total={summary?.total_common ?? 0} outline='outline-4 outline-royal-blue'>
                    </CategorySummary>

                    <CategorySummary
                        category='Rare'
                        unlocked={summary?.unlocked_rare ?? 0}
                        total={summary?.total_rare ?? 0} outline='outline-4 outline-morado-lakers'>
                    </CategorySummary>

                    <CategorySummary
                        category='Legendary'
                        unlocked={summary?.unlocked_legendary ?? 0}
                        total={summary?.total_legendary ?? 0} outline='outline-4 outline-amarillo-lakers'>
                    </CategorySummary>

                    <CategorySummary
                        category='Limited'
                        unlocked={summary?.unlocked_limited ?? 0}
                        total={summary?.total_limited ?? 0} outline='outline-4 outline-light-blue'>
                    </CategorySummary>
                </div>

                {/* Card filters */}

                {/* Card collection */}
                {/* Arrows for different collection pages */}
                <div className="flex flex-row justify-end mt-5">
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="text-black disabled:opacity-30 hover:opacity-75 transition text-6xl px-4"
                        >
                            ‹
                        </button>
                        <span className="text-black text-xl">
                            {page + 1} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="text-black disabled:opacity-30 hover:opacity-75 transition text-6xl px-4"
                        >
                            ›
                        </button>
                    </div>
                </div>
                {/* Collectioin itself */}

                {cardCollection.length === 0 ? (
                    <p className="w-fit p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100">Loading collection...</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mx-2">
                        {paginated.map((card) => (
                            <CollectionCardRender key={card.card_id} card={card}/>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Collection