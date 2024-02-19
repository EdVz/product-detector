import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/userContext';

const Navbar = () => {

    const userData = useUser();
    const toast = useToast();

    const handleSignOut = async (): Promise<void> => {
        try {
            await axios.post('/api/user/logout');
            userData?.refreshUser();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast({
                title: "Something went wrong. Please, try again",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            w={'100%'}
            className='h-[75px] p-5 bg-gradient-to-r from-cyan-500 to-blue-500 border border-gray-300 shadow-sm'
        >
            <Box
                display={'flex'}
                alignItems={'center'}
                className='gap-6 lg:gap-24'
            >
                <Link
                    to={'/'}
                    className='text-xs lg:text-xl text-white font-medium lg:border-2 border-blue-600 p-2 rounded-tl-xl rounded-br-xl'
                >
                    Product-Detector
                </Link>
                <Link to={'/products'} className='text-xs lg:text-base text-white hover:opacity-75'>
                    Registered Products
                </Link>
            </Box>
            <Box>
                {userData && userData?.user ? (
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} className=''>
                            <Avatar
                                size={'sm'}
                                cursor={'pointer'}
                                name={userData.user.email[0]}
                            />
                        </MenuButton>
                        <MenuList>
                            <MenuItem color={'gray'}>
                                {userData?.user.email}
                            </MenuItem>
                            <MenuItem color={'red.500'} onClick={handleSignOut}>
                                Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <Menu>
                        <Box className='flex gap-6 items-center'>
                            <Link to='/login'>
                                <button className='text-white font-light'>
                                    Login
                                </button>
                            </Link>
                            <Link to='/signup'>
                                <Button
                                    colorScheme='red'
                                    fontWeight={'medium'}
                                    size='sm'
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </Box>
                    </Menu>
                )}
            </Box>
        </Box>
    )
}

export default Navbar;