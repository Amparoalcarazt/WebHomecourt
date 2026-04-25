import {useState} from 'react'; 

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
}

function OpenPack(prop: OpenPackProp) {
    if (!prop.open) return null

    // Robando basic struct de pop-up de pantalla Adolfo
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-6 bg-morado-lakers">
                    <div className="flex items-start justify-between mb-1">
                        <h2 className="text-2xl font-bold">Open the pack!</h2>
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
                {/* Opening pack content */}
                <p>Press the pack or the open button to see what you get!</p>
                <p>Temp show user {prop.userId} and pack {prop.packId}</p>
            </div>
        </div>
    )
}

export default OpenPack