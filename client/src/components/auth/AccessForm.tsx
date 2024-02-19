import { Box, Button, Container, FormControl, FormLabel, Input, Text, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';

interface AccessFormProps {
    isLoginForm?: boolean;
};

interface userDataTypes {
    email: string;
    password: string;
}

const AccessForm = ({ isLoginForm = false }: AccessFormProps) => {

    const startingUserData = {
        email: '',
        password: '',
    }

    const user = useUser();

    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<userDataTypes>(startingUserData);

    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const name = ev.target.name;
        const value = ev.target.value;

        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    };

    const handleSignUp = async () => {

        if (!userData.email || !userData.password) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            if (isLoginForm) {
                await axios.post('/api/user/login', userData, config)
            } else {
                await axios.post('/api/user/signup', userData, config)
            }
            setLoading(false);
            navigate('/');
            user?.refreshUser();
        } catch (error) {
            console.error(error);
            toast({
                title: "Something went wrong. Please, try again",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <Container maxW='xl' centerContent>
            <Box w={'100%'} p={4} borderRadius={'lg'} className='shadow-xl border mt-32'>
                <VStack spacing='10px' color={'black'}>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        p={3}
                        w={'100%'}
                    >
                        {isLoginForm ? (
                            <Text fontSize='2xl' color='black'>
                                Login
                            </Text>
                        ) : (
                            <Text fontSize='2xl' color='black'>
                                Sign Up
                            </Text>
                        )}
                    </Box>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            name='email'
                            type='email'
                            placeholder='Enter your email'
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            name='password'
                            type='password'
                            placeholder='Enter your password'
                            onChange={handleChange}
                        />
                    </FormControl>
                    {isLoginForm ? (
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            className='space-y-3 mt-2'
                        >
                            <Button
                                colorScheme='blue'
                                onClick={handleSignUp}
                                fontWeight={'medium'}
                                isLoading={loading}
                            >
                                Login
                            </Button>
                            <Text className='flex gap-1 text-sm'>
                                Don&apos;t have an account yet?
                                <Link to='/signup' className='text-red-600'>
                                    Sign up
                                </Link>
                            </Text>
                        </Box>
                    ) : (
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            className='space-y-3 mt-2'
                        >
                            <Button
                                colorScheme='red'
                                onClick={handleSignUp}
                                fontWeight={'medium'}
                                isLoading={loading}
                            >
                                Sign Up
                            </Button>
                            <Text className='flex gap-1 text-sm'>
                                Already have an account?
                                <Link to='/login' className='text-blue-600'>
                                    Log in
                                </Link>
                            </Text>
                        </Box>
                    )}
                </VStack>
            </Box>
        </Container>
    )
}

export default AccessForm;