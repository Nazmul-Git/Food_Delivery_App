'use client'

const YesNoModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isOpen}
        >
            <div
                className="bg-white rounded-lg shadow-lg transform transition-transform duration-300 scale-100 w-full max-w-md p-4 sm:p-6 mx-4"
                role="dialog"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <h2
                    id="modal-title"
                    className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center"
                >
                    Confirm Action
                </h2>
                <p
                    id="modal-description"
                    className="text-gray-600 mb-6 text-center"
                >
                    Are you sure you want to proceed?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default YesNoModal;
