//import { useEffect, useState } from 'react';
import type { StorePacks } from '../../pages/Store'; // Has to be a type cosa estupida
import IconButton from '../IconButton.tsx';

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
                            className="w-[18rem] md:w-[26.875rem] md:h-[15rem] p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100"
                        >
                            {/* Left side logo and team name, using h full to use full height of container and align button */}
                            <div className="flex flex-row items-stretch mt-2 mb-1">
                                <img
                                    src={pack.closed_URL}
                                    alt={pack.name}
                                    className="w-20 md:w-32 h-auto"
                                />
                                {/* Name of pack and cost */}
                                <div className="flex flex-col ml-3 mt-4 w-full">
                                    {/* Pack details */}
                                    <div>
                                        <h4 className="font-bold">{pack.pack_name}</h4>
                                        <h5 className="font-semibold mb-2">{rowTitle} #{pack.pack_id}</h5>
                                        <p className="text-Gris-Oscuro">Win up to {pack.num_cards} cards{cardDesc}</p>
                                    </div>

                                    
                                    {/* Align to bottom, decide button to use depending if user can afford it or not */}
                                    <IconButton
                                        type="yellow"
                                        leftIcon={
                                            <span className="material-symbols-outlined text-black text-2xl">payments</span>
                                        }
                                        text={`${pack.cost}`} // Converted to string cause not accepted otherwise 
                                        onClick={() => { }} // Does nada
                                        className="w-full md:w-28 mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StoreRow