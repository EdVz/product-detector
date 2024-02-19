import { useEffect, useState } from 'react'
import { useUser } from '../context/userContext';
import { Link } from 'react-router-dom';
import { Box, Text, useToast } from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import axios from 'axios';
import { ObjectData } from '../components/DetailsDisplay';
import ProductCard from '../components/products/ProductCard';
import { WarningIcon } from '@chakra-ui/icons';


const Products = () => {
    const userData = useUser();
    const toast = useToast();

    const [products, setProducts] = useState<ObjectData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                toast({
                    title: 'Something went wrong, please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        };

        if (userData?.user?.email) {
            fetchAllProducts();
        }

    }, [userData?.user?.email]);

    return (
        <Box p={5}>
            {userData?.user?.email ? (
                loading ? (
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100%'}
                        className='mt-12'
                    >
                        <PulseLoader color={'#2d8fe0'} size={15} />
                    </Box>
                ) : (
                    products.length > 0 ? (
                        <Box className='flex flex-col lg:flex-row gap-6 flex-wrap'>
                            {products.map((product, index) => (
                                <ProductCard
                                    key={index}
                                    name={product.name}
                                    price={product.price}
                                    brand={product.brand}
                                    weight={product.weight}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Text>
                            No products regsitered yet
                        </Text>
                    )
                )
            ) : (
                <Box display={'flex'} alignItems={'center'} color={'yellow.500'} className='gap-2'>
                    <WarningIcon />
                    <Text>
                        You must{' '}
                        <span className='underline'>
                            <Link to={'/login'}>
                                log in
                            </Link>
                        </span>{' '}
                        to view your registered products
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default Products