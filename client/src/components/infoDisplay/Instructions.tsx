import { Box, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { Bs1CircleFill, Bs2CircleFill, Bs3CircleFill, Bs4CircleFill, Bs5CircleFill, Bs6CircleFill } from 'react-icons/bs';

const Instructions = () => {
    return (
        <Box className='flex flex-col space-y-3'>
            <Text className='text-2xl font-medium'>Instructions</Text>
            <List spacing={3}>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs1CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        Click <span className='text-green-600'>&apos;Enable Webcam&apos;</span> to start streaming your camera (grant any permissions if needed).
                    </Text>
                </ListItem>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs2CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        Click the <span className='text-gray-600'>&apos;Add Object&apos;</span> button (you can add as many objects as you want to be recognized) and enter the object&apos;s name (If signed in, you can enter more details about the object).
                    </Text>
                </ListItem>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs3CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        Place the object in front of the camera, then, click and hold the respective object&apos;s button to capture samples of that object while moving it around the camera and showing different angles of the object. Make sure to capture around the same number of samples (shows below camera stream) for each object added.
                    </Text>
                </ListItem>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs4CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        If you gathered many more samples of one object than the others, or you did not like the angles you captured of an object, you can click the <span className='text-red-600'>&apos;Reset&apos;</span> button, to reset the samples captured for all objects and start over.
                    </Text>
                </ListItem>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs5CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        Once you&apos;re done capturing samples for every object. Click the <span className='text-green-600'>&apos;Ready&apos;</span> button and wait a bit.
                    </Text>
                </ListItem>
                <ListItem display={'flex'} alignItems={'flex-start'}>
                    <ListIcon as={Bs6CircleFill} color={'blue.500'} className='mt-1' />
                    <Text>
                        Once the <span className='text-green-600'>&apos;Ready&apos;</span> button is no longer loading, that means you can start placing objects in front of the camera for them to be recognized. All the object&apos;s information will be displayed on the right.
                    </Text>
                </ListItem>
            </List>
        </Box>
    )
}

export default Instructions