import { Box } from '@chakra-ui/react';
import ProductDetection from '../components/ProductDetection';
import DetailsDisplay from '../components/DetailsDisplay';

const Home = () => {


    return (
        <Box p={5} className='flex flex-col lg:flex-row'>
            <Box className='w-full lg:w-1/2 border border-gray-400 rounded-xl'>
                <ProductDetection />
            </Box>
            <Box className='w-full lg:w-1/2'>
                <DetailsDisplay />
            </Box>
        </Box>
    )
}

export default Home