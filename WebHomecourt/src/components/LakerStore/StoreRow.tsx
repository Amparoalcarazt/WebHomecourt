//import { useEffect, useState } from 'react';
import type { StorePacks } from '../../pages/Store'; // Has to be a type cosa estupida

type StoreRowProps = {
    packTypeId: number;
    packs: StorePacks[];
};

function StoreRow({ packTypeId, packs }: StoreRowProps) {
    const rowPacks = packs.filter((pack) => pack.pack_type_id === packTypeId);

    if (rowPacks.length === 0) return null;

    const rowTitle = rowPacks[0].name; 
    let cardDesc;

    // To show descriptions for hardcoded card types
    if (rowTitle == "Player Pack") {
        cardDesc = " featuring this player"; 
    } else if (rowTitle == "Team Pack")
        cardDesc = " featuring players from the Lakers lineup";
    else {
        cardDesc = null; // Or show nothing
    }

    const actualPacks = rowPacks.filter((pack) => pack.pack_id !== null); //  Keeps only packs where there is an id available cause it might be null if there are none of that type

    return (
        <div className="mt-8 w-full">
            <h2 className="font-bold mb-2">{rowTitle}</h2>

            {/* Ensure there are packs matching it */}
            {actualPacks.length === 0 ? (
                <p className="w-fit p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100">There are currently no {rowTitle}s available, please check back later!</p>
            ) : (
                <div className="flex flex-wrap gap-5">
                    {/* Iterates over the packs mapped to show them */}
                    {actualPacks.map((pack) => (
                        <div
                            key={pack.pack_id}
                            className="md:w-[26.875rem] md:h-[17.25rem] p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100"
                        >
                            {/* Left side logo and team name */}
                            <div className="flex flex-row flex-1 items-start mt-2 mb-1">
                                <img
                                    src={pack.closed_URL}
                                    alt={pack.name}
                                    className="w-32 h-auto"
                                />
                                {/* Name of pack and id */}
                                <div className="flex flex-col items-start ml-3">
                                    <h4 className="font-bold">{pack.pack_name}</h4>
                                    <p>{rowTitle} #{pack.pack_id}</p>
                                    <p>Win up to {pack.num_cards} cards{cardDesc}</p>
                                </div>
                            </div>

                            {/* Bottom info */}
                            <p>{pack.name}</p>
                            <p>Cost: {pack.cost}</p>
                            <p>Cards: {pack.num_cards}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StoreRow