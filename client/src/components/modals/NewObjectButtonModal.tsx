import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import { ChangeEvent, ReactNode, useState } from 'react';
import { useNewObject } from '../../context/newObjectContext';
import { useUser } from '../../context/userContext';
import axios from 'axios';
import { WarningIcon } from '@chakra-ui/icons';

interface ObjectData {
    name: string;
    price: number | null;
    brand: string;
    weight: number | null;
};


const NewObjectButtonModal = ({ children }: { children: ReactNode }) => {

    const initialObjectData = {
        name: '',
        price: null,
        brand: '',
        weight: null,
    };

    const userData = useUser();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const newObject = useNewObject();

    const [objectData, setObjectData] = useState<ObjectData>(initialObjectData);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setObjectData(prevState =>
        ({
            ...prevState,
            [name]: value,
        })
        );
    };

    const handleAddNewObject = async () => {

        objectData.weight = parseFloat(objectData.weight as any);
        objectData.price = parseFloat(objectData.price as any);

        if (!objectData.name) {
            toast({
                title: "Please enter the object's name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        if (typeof objectData.weight !== 'number') {
            toast({
                title: "Please, only enter numbers in the weight field",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        if (userData?.user?.email) {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                await axios.post('/api/products/newProduct', objectData, config)

                newObject?.setNewObjectNames([...newObject.newObjectNames, objectData.name]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                toast({
                    title: "Something went wrong, please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } else {
            newObject?.setNewObjectNames([...newObject.newObjectNames, objectData.name]);
        }

        onClose();
        setObjectData(initialObjectData);
    };

    return (
        <>
            <span onClick={onOpen} >{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {userData?.user?.email ? `Object Details` : 'New Object Name'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <FormControl isRequired>
                                {userData?.user?.email ? <FormLabel>Object Name</FormLabel> : null}
                                <Input
                                    name='name'
                                    placeholder='Object Name'
                                    value={objectData.name}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            {userData?.user?.email ? (
                                <Box w='100%' className='space-y-3'>
                                    <FormControl>
                                        <FormLabel>Price</FormLabel>
                                        <Input
                                            name='price'
                                            type='number'
                                            placeholder='Price'
                                            value={objectData.price || ''}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Brand</FormLabel>
                                        <Input
                                            name='brand'
                                            placeholder='Brand'
                                            value={objectData.brand}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Weight (g)</FormLabel>
                                        <Input
                                            name='weight'
                                            type='number'
                                            placeholder='Weight'
                                            value={objectData.weight || ''}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Box>
                            ) : (
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    color={'yellow.500'}
                                    className='mt-2 gap-2'
                                >
                                    <WarningIcon />
                                    <Text>
                                        Sign in to enter object details and register it
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={handleAddNewObject}
                            isLoading={loading}
                        >
                            Add New Object
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};


export default NewObjectButtonModal;