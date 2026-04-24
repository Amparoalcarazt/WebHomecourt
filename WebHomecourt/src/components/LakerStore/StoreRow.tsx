import { useEffect, useState } from 'react';
import type { StorePacks } from '../../pages/Store'; // Has to be a type cosa estupida

type StoreRowProps = {
    packTypeId: number;
    packs: StorePacks[];
};

function StoreRow({ packTypeId, packs }: StoreRowProps) {
    const rowPacks = packs.filter((pack) => pack.pack_type_id === packTypeId);

    if (rowPacks.length === 0) return null;

    const rowTitle = rowPacks[0].name;

    const actualPacks = rowPacks.filter((pack) => pack.pack_id !== null); //  Keeps only packs where there is an id available cause it might be null if there are none of that type

    return (
        <div className="mt-8 w-full">
            <h2 className="font-bold mb-3">{rowTitle}</h2>

            {/* Ensure there are packs matching it */}
            {actualPacks.length === 0 ? (
                <p>There are currently no {rowTitle}s available, please check back later!</p>
            ) : (
                <div className="flex flex-wrap gap-5">
                    {/* Iterates over the packs mapped to show them */}
                    {actualPacks.map((pack) => (
                        <div
                            key={pack.pack_id}
                            className="p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100"
                        >
                            <h4 className="font-bold">{pack.pack_name}</h4>
                            <p>Id: {pack.pack_id}</p>
                            <img
                                src={pack.closed_URL}
                                alt={pack.name}
                                className="w-32 h-auto mb-2"
                            />
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