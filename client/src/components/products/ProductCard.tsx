import { Box, Text } from '@chakra-ui/react';
import React from 'react'

interface ProductCardProps {
    name: string;
    price?: number | null;
    weight?: number | null;
    brand?: string;
};

const ProductCard = ({ name, price, weight, brand }: ProductCardProps) => {
    return (
        <Box
            className='w-full lg:w-1/4 p-3 space-y-3 border border-blue-300 rounded-xl shadow-md'
        >
            <Text
                className='text-lg text-blue-500 font-medium'
            >
                {name}
            </Text>
            {price && (
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    className='border-b-2'
                >
                    <Text className='font-bold'>
                        Price
                    </Text>
                    <Text>
                        {price}
                    </Text>
                </Box>
            )}
            {brand && (
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    className='border-b-2'
                >
                    <Text className='font-bold'>
                        Brand
                    </Text>
                    <Text>
                        {brand}
                    </Text>
                </Box>
            )}
            {weight && (
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Text className='font-bold'>
                        Weight
                    </Text>
                    <Text>
                        {weight}g
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default ProductCard