import { useState, useContext } from 'react';
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

// For arrows
const RightArrow = () => {
  const { scrollNext } = useContext(VisibilityContext);
  return (
    <div
      className="absolute right-0 top-1/2 rounded-lg -translate-y-1/2 cursor-pointer p-2 hover:bg-gray-200"
      onClick={() => scrollNext()} // Used chat to see how to make the scroll next based on documentaiton
    >
      <img src="/arrow_forward_ios.svg" alt="Scroll right" className="w-26 h-16" />
    </div>
  );
};

const LeftArrow = () => {
  const { scrollPrev } = useContext(VisibilityContext);
  return (
    <div
      className="absolute left-0 top-1/2 rounded-lg -translate-y-1/2 cursor-pointer p-2 hover:bg-gray-200 rotate-180 z-20"
      onClick={() => scrollPrev()} // Used chat to see how to make the scroll next based on documentaiton
    >
      <img src="/arrow_forward_ios.svg" alt="Scroll left" className="w-26 h-16" />
    </div>
  );
};

// Pass the pack type and the user info itself
function StoreRow({ packTypeId, packs, storeUser }: StoreRowProps) {
    // Pop-up info
    const [openPack, setOpenPack] = useState<null | { packId: number, packImg: string, tearImg: string, openingImg: string, packName: string, packCost: number }>(null); // To open and close pop-up
    const userId = storeUser.user_id ?? ''; // Pass directly to pop-up

    // Open the pop-up
    function openPop(pack: StorePacks) {
        if (!pack.pack_id) return;
        setOpenPack({
            packId: pack.pack_id,
            packImg: pack.closed_URL,
            tearImg: pack.tear_URL,
            openingImg: pack.opening_URL,
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
                    tearImg={openPack.tearImg} // Image w one tear
                    openingImg={openPack.openingImg}
                    packName={openPack.packName}
                    packCost={openPack.packCost}
                />
            )}

            <h2 className="font-bold mb-2">{rowTitle}</h2>

            {/* Ensure there are packs matching it */}
            {actualPacks.length === 0 ? (
                <p className="w-fit p-4 mb-4 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-100">There are currently no {rowTitle}s available, please check back later!</p>
            ) : (
                // Need relative to make it scroll from side to side 
                <div className="relative">
                    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                        {actualPacks.map((pack) => (
                            <PackCard
                                itemId={String(pack.pack_id!)} // Doesn't work without ! to ensure not null
                                pack={pack} // Should be like the id tracking I guess?
                                rowTitle={rowTitle}
                                cardDesc={cardDesc ?? ""}
                                storeUser={storeUser}
                                openPop={openPop}
                            />
                        ))}
                    </ScrollMenu>
                </div>
            )}
        </div>
    );
}

export default StoreRow