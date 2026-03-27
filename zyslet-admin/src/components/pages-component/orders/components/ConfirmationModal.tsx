import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FiAlertTriangle, FiInfo, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

interface ConfirmationModalProps {
    dialogOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    setDialogOpen: (open: boolean) => void;
    dialogAction: {
        title: string;
        description: string;
        type?: 'delete' | 'default';
    } | null;
    handleConfirmAction: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    dialogOpen,
    setDialogOpen,
    dialogAction,
    handleConfirmAction,
}) => {
    const isDeleteAction = dialogAction?.type === 'delete';

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                isDeleteAction ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                            {isDeleteAction ? (
                                <FiAlertTriangle className="w-6 h-6 text-red-600" />
                            ) : (
                                <FiInfo className="w-6 h-6 text-blue-600" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold text-gray-900">{dialogAction?.title}</DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-gray-600 leading-relaxed">
                        {dialogAction?.description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => setDialogOpen(false)}>
                        <FiX className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        className={`flex items-center gap-2 font-medium ${
                            isDeleteAction
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}>
                        {isDeleteAction ? (
                            <>
                                <FiTrash2 className="w-4 h-4" />
                                Delete
                            </>
                        ) : (
                            <>
                                <FiCheck className="w-4 h-4" />
                                Confirm
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
