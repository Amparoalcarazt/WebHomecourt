import { useState } from 'react';
import type { StorePacks } from '../../pages/Store';
import type { StoreUser } from '../../pages/Store';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'; // External to make side scrolling
import 'react-horizontal-scrolling-menu/dist/styles.css'; // External to make side scrolling
import OpenPack from './OpenPack.tsx';
//import IconButton from '../IconButton.tsx';
import PackCard from './PackCard.tsx'

type StoreRowProps = {
    packTypeId: number;
    packs: StorePacks[];
    storeUser: StoreUser;
};

// Pass the pack type and the user info itself
function StoreRow({ packTypeId, packs, storeUser }: StoreRowProps) {
    // Pop-up info
    const [openPack, setOpenPack] = useState<null | { packId: number, packImg: string, packName: string, packCost: number }>(null); // To open and close pop-up
    const userId = storeUser.user_id ?? ''; // Pass directly to pop-up

    // Robando de Regina para hacer pages de las paginas scrollable
    const [page, setPage] = useState(0)
    const PAGE_SIZE = 3
    const totalPages = Math.ceil(packs.length / PAGE_SIZE)
    const paginated = packs.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

    // Open the pop-up
    function openPop(pack: StorePacks) {
        if (!pack.pack_id) return;
        setOpenPack({
            packId: pack.pack_id,
            packImg: pack.closed_URL,
            packName: pack.pack_name ?? '',
            packCost: pack.cost ?? 0
        });
    }

    // Handler to close the pop-up
    function closePop() {
        setOpenPack(null);
    }

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
            {openPack && (
                <OpenPack
                    open={true}
                    onClose={closePop}
                    userId={userId}
                    packId={openPack.packId}
                    packImg={openPack.packImg}
                    packName={openPack.packName}
                    packCost={openPack.packCost}
                />
            )}

            <h2 className="font-bold mb-2">{rowTitle}</h2>

            {/* Ensure there are packs matching it */}
            {actualPacks.length === 0 ? (
                <p className="w-fit p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100">There are currently no {rowTitle}s available, please check back later!</p>
            ) : (
                <ScrollMenu>
                        {actualPacks.map((pack) => (
                            <PackCard
                                itemId={pack.pack_id!}
                                pack={pack} // Should be like the id tracking I guess?
                                rowTitle={rowTitle}
                                cardDesc={cardDesc ?? ""}
                                storeUser={storeUser}
                                openPop={openPop}
                            />
                        ))}
                </ScrollMenu>
            )}
        </div>
    );
}

export default StoreRow