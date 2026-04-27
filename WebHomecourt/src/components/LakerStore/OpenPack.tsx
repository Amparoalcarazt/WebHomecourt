import {useState} from 'react'; 
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
    packName: string, // To display as open it onClick={onClose}
    packCost: number // Show how much package costs to ensure user wants to buy
}


function OpenPack(prop: OpenPackProp) {
    if (!prop.open) return null

    // Vars that will be updated as it opens
    const [openText, setOpenText] = useState('Press the pack or the open button to see what you get!'); // Starting text used when the pop-up opens
    const [openClickCount, setOpenClickCount] = useState(0); // User hasn't clicked the button

    // Function to handle inner clicking and switching images

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
                    
                    <div className ="flex flex-row w-fit justify-center items-center p-2.5 gap-3.5 mb-3 rounded-2xl outline -outline-offset-1 outline-black/25">
                        <span className="text-xl">Pack cost: </span>
                        <span className="material-symbols-outlined text-amarillo-lakers text-2xl pl-3">payments</span>
                        <span className="pl-3 text-xl">{prop.packCost}</span>
                    </div>
                    
                    <p>Temp show user {prop.userId} and pack {prop.packId}</p> 

                    {/* Opening board space */}
                    <div className="w-full px-6">
                        <div className="flex flex-col w-full rounded-lg bg-zinc-100 items-center justify-center mb-4">
                        <img src={prop.packImg} className="w-30 md:w-42 h-auto"></img>
                        {/* Open manually via button */}
                        <div className="w-full px-4 pb-4">
                            <Button
                                text="Open"
                                type="primary"
                                onClick={() => {} } // Logic to open package
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