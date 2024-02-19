import { Box, List, ListIcon, ListItem, OrderedList, Text, useToast } from '@chakra-ui/react';
import { useNewObject } from '../context/newObjectContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import { useUser } from '../context/userContext';
import { WarningIcon } from '@chakra-ui/icons';
import Instructions from './infoDisplay/Instructions';

export interface ObjectData {
    name: string;
    price: number | null;
    brand: string;
    weight: number | null;
};

const DetailsDisplay = () => {

    const newObject = useNewObject();
    const userData = useUser();
    const toast = useToast();

    const [objectData, setObjectData] = useState<ObjectData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProductDetails = async () => {
            if (userData?.user?.email) {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/api/products/${newObject?.predictedObjectName}`)
                    setObjectData(data);
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
            };
        }
        fetchProductDetails();

    }, [newObject?.predictedObjectName]);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            p={5}
            className='space-y-6'
        >
            {newObject?.predictedObjectName ? (
                <>
                    <Text className='text-2xl text-blue-500 font-medium'>
                        {newObject?.predictedObjectName ? `${newObject.predictedObjectName}` : ''}
                    </Text>
                    {userData?.user?.email ? (
                        loading ? (
                            <Box display={'flex'} justifyContent={'center'}>
                                <PulseLoader color={'#2d8fe0'} size={13} />
                            </Box>
                        ) : (
                            objectData ? (
                                <Box className='space-y-2 text-lg'>
                                    <Text
                                        variant={'h3'}
                                        className='text-lg font-semibold'
                                    >
                                        Object Details
                                    </Text>
                                    <Box
                                        className='space-y-3 border border-gray-400 rounded-xl p-3'
                                    >
                                        {objectData?.price && (
                                            <Box
                                                display={'flex'}
                                                justifyContent={'space-between'}
                                                className='border-b-2'
                                            >
                                                <Text className='font-medium'>
                                                    Price
                                                </Text>
                                                <Text>
                                                    {objectData.price}
                                                </Text>
                                            </Box>
                                        )}
                                        {objectData?.brand && (
                                            <Box
                                                display={'flex'}
                                                justifyContent={'space-between'}
                                                className='border-b-2'
                                            >
                                                <Text className='font-medium'>
                                                    Brand
                                                </Text>
                                                <Text>
                                                    {objectData.brand}
                                                </Text>
                                            </Box>
                                        )}
                                        {objectData?.weight && (
                                            <Box
                                                display={'flex'}
                                                justifyContent={'space-between'}
                                            >
                                                <Text className='font-medium'>
                                                    Weight
                                                </Text>
                                                <Text>
                                                    {objectData.weight}g
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ) : null
                        )
                    ) : (
                        newObject?.predictedObjectName && (
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                color={'yellow.500'}
                                className='gap-2'
                            >
                                <WarningIcon />
                                <Text>
                                    Sign in to see object details.
                                </Text>
                            </Box>
                        )
                    )}
                </>
            ) : (
                <Instructions />
            )}
        </Box>
    )
}

export default DetailsDisplay;