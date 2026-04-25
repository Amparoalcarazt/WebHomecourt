import { useState } from 'react';
import type { StorePacks } from '../../pages/Store';
import type { StoreUser } from '../../pages/Store';
import OpenPack from './OpenPack.tsx'; 
import IconButton from '../IconButton.tsx';

type StoreRowProps = {
    packTypeId: number;
    packs: StorePacks[];
    storeUser: StoreUser;
};

// Pass the pack type and the user info itself
function StoreRow({ packTypeId, packs, storeUser }: StoreRowProps) {
    // Pop-up info
    const [openPack, setOpenPack] = useState<null | { packId: number, packImg: string, packName: string }>(null); // To open and close pop-up
    const userId = storeUser.user_id ?? ''; // Pass directly to pop-up

    // Open the pop-up
    function openPop(pack: StorePacks) {
        if (!pack.pack_id) return;
        setOpenPack({
            packId: pack.pack_id,
            packImg: pack.closed_URL,
            packName: pack.pack_name ?? '',
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
                />
            )}

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
                                    <div>
                                        {storeUser.credits >= (pack.cost ?? 0) ? (
                                            <IconButton
                                                type="yellow"
                                                leftIcon={
                                                    <span className="material-symbols-outlined text-black text-2xl">payments</span>
                                                }
                                                text={`${pack.cost}`} // Converted to string cause not accepted otherwise 
                                                onClick={() => openPop(pack)}//{() => { }} // Will need some business logic but pretty much render the OpenPack compoennt and pass the info it needs
                                                className="w-full md:w-28 mt-2 text-md"
                                            />
                                        ) : (
                                            // Not enough credits
                                            < IconButton
                                                type="primarydisable"
                                                leftIcon={
                                                    <span className="material-symbols-outlined text-gray-100 text-2xl">payments</span>
                                                }
                                                text={`${pack.cost}`} // Converted to string cause not accepted otherwise
                                                onClick={() => { }} // Will need pop-up logic to check if the user is poor and try to click just sends error like oh no you're poor, or reminds them to sign in if they aren't
                                                className="w-full md:w-28 mt-2 text-md"
                                            />
                                        )}
                                    </div>

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