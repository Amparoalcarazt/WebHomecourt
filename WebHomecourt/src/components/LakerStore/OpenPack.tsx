import { useState, useEffect } from 'react';
import Button from '../button.tsx';

type OpenPackProp = {
    // For pop-up function
    open: boolean;
    onClose: () => void;
    // Related to db
    userId: string, // To see who is buying it
    // Base pack info passed in
    packId: number, // To send in info
    packImg: string, // Sending in pack url
    tearImg: string, // Image w one tear
    openingImg: string, // About to open img
    packName: string, // To display as open it onClick={onClose}
    packCost: number // Show how much package costs to ensure user wants to buy
}


function OpenPack(prop: OpenPackProp) {
    if (!prop.open) return null

    // Vars that will be updated as it opens
    const [openText, setOpenText] = useState(''); // Starting text used when the pop-up opens
    const [openClickCount, setOpenClickCount] = useState(0); // User hasn't clicked the button
    const [oepnEnabled, setOpenEnabled] = useState(true); // Determines button enabled or not
    const [openTextButton, setOpenTextButton] = useState("OPEN"); // To let user complete multiple buys
    const [imageURL, setImageURL] = useState('');

    // Initial function to render the base components
    useEffect(() => {
        setOpenClickCount(0);
        setImageURL(prop.packImg);
        setOpenText('Press the pack or the open button to see what you get!');
        setOpenTextButton("OPEN");
    }, [prop.open, prop.packId]);

    // Function to handle inner clicking and switching images
    function opening() {
        // Sacado de chat pq apparently no se puede nomas usar un let y no puede nomas contar como cosa normal
        setOpenClickCount(prev => {
            let newCount = prev + 1;
            console.log(newCount)
            console.log(openTextButton)

            if (newCount === 1) {
                setOpenText("First tear! Click again to keep opening it...");
                setOpenTextButton("OPEN");
                setImageURL(prop.tearImg);
            } else if (newCount === 2) {
                setOpenText("You can almost see the cards now...");
                setImageURL(prop.openingImg);
            } 
             else if (newCount === 3) {
                setOpenText("Congrats!");
                setImageURL(""); // Hides image, here will later display the cards won as a sort of board

                // Call api function

                // Change button based on whether still has credits left over or not, and block from front-end if they can no longer buy anything
                setOpenTextButton("OPEN AGAIN!");

            } else if (newCount > 3) {
                // Reset everything for a new opening
                newCount = 1;
                setOpenText("First tear! Click again to keep opening it...");
                setOpenTextButton("OPEN");
                setImageURL(prop.tearImg);
            }
            else {
                // Idk fallback smth is wrong
                setOpenText("Press the pack or the open button to see what you get!");
                setImageURL(prop.packImg);
            }

            return newCount;
        });
        /*
        setOpenClickCount(openClickCount + 1); // Increment counter

        if (openClickCount == 0) {
            // Should never happen
            setOpenText("Press the pack or the open button to see what you get!");
        } else if (openClickCount == 1) {
            // First crach
            setOpenText("First tear! Click again to keep opening it...");
        } else if (openClickCount == 2) {
            // Second crack
            setOpenText("Second tear, keep going!");
        } else if (openClickCount == 3) {
            // Third crack
            setOpenText("I can practically see the cards now...");
        } else if (openClickCount == 4) {
            setOpenText("Congrats!");
        }*/
    }

    // Robando basic struct de pop-up de pantalla Adolfo
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-150 rounded-lg bg-white shadow-lg overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-6 bg-morado-lakers">
                    <div className="flex items-start justify-between">
                        <div className="flex-row">
                            <h2 className="text-white">Open the pack!</h2>
                            <p className="justify-start text-white mt-2 text-xl text-zinc-300">{prop.packName}</p>
                        </div>

                        {/* Robado de Adolfo */}
                        <button
                            type="button"
                            onClick={prop.onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>
                </div>
                {/* Opening pack content, I need to make it so that after the function to open the pack is done executing, I then do a fetch to get the user credits again and check whether the button to open it should work or whether I should diable from front end*/}
                <div className="flex flex-col text-center items-center mt-3">
                    <h5 className="mb-2">{openText}</h5>

                    <div className="flex flex-row w-fit justify-center items-center p-2.5 gap-3.5 mb-3 rounded-2xl outline -outline-offset-1 outline-black/25">
                        <span className="text-xl">Pack cost: </span>
                        <span className="material-symbols-outlined text-amarillo-lakers text-2xl pl-3">payments</span>
                        <span className="pl-3 text-xl">{prop.packCost}</span>
                    </div>

                    <p>Temp show user {prop.userId} and pack {prop.packId}</p>

                    {/* Opening board space */}
                    <div className="w-150 h-auto px-6">
                        <div className="flex flex-col w-full rounded-lg bg-zinc-100 items-center justify-center mb-4">
                            {imageURL ? (
                                <img src={imageURL} className="h-75 md:h-75 w-auto" />
                            ): (
                                <div className="w-150 h-75" />)
                            }
                            {/* Open manually via button */}
                            <div className="w-full px-4 md:px-4 pb-4">
                                <Button
                                    text={openTextButton}
                                    type="primary"
                                    onClick={() => opening()} // Logic to open package
                                    className="w-full"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Cancel button */}
                    <div className="w-full px-10 pb-4">
                        <Button
                            text="Cancel purchase"
                            type="reddestructive"
                            onClick={prop.onClose}
                            className="w-full"
                        />
                    </div>

                </div>


                {/* */}
            </div>
        </div>
    )
}

export default OpenPack