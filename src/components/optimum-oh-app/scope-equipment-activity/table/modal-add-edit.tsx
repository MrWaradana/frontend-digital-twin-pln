import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input
} from "@nextui-org/react";

interface ModalADdEditProps {
    onSubmit: any,
    initialData: {} | null
    isOpen: boolean
    onOpenChange: any
}

const ModalAddEdit = ({ onSubmit, initialData = null, isOpen, onOpenChange }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        cost: ''
    });

    // Reset form data when modal opens with initialData or empty state
    // React.useEffect(() => {
    //     if (isOpen) {
    //         setFormData(initialData || { name: '', cost: '' });
    //     }
    // }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isEditMode = Boolean(initialData);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            {isEditMode ? 'Edit Item' : 'Add New Item'}
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                label="Name"
                                placeholder="Enter name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mb-4"
                            />
                            <Input
                                label="Cost"
                                placeholder="Enter cost"
                                name="cost"
                                type="number"
                                value={formData.cost}
                                onChange={handleChange}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onOpenChange}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit">
                                {isEditMode ? 'Save Changes' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalAddEdit;