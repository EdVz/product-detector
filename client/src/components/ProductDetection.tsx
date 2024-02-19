import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, List, ListIcon, ListItem, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader';
import { MdDoubleArrow } from 'react-icons/md'
import NewObjectButtonModal from './modals/NewObjectButtonModal';
import { useNewObject } from '../context/newObjectContext';
import * as tf from '@tensorflow/tfjs';

//mobilenet model chosen expects an image of size 224 by 224 pixels in size. 
const modelInputWidth: number = 224;
const modelInputHeight: number = 224;
let examplesCount: number[] = []; //Keep track of how many examples are contained for each class

//Arrays will store gathered training data values as object button is clicked
let trainingDataInputs: tf.Tensor<tf.Rank>[] = [];
let trainingDataOutputs: number[] = [];

let isTrained: boolean = false;

const ProductDetection = () => {

	const newObject = useNewObject();
	const toast = useToast();
	const [totalObjectsToClassify, setTotalObjectsToClassify] = useState<number>(newObject?.newObjectNames.length as number);
	const totalObjectsToClassifyRef = useRef<number>(totalObjectsToClassify);

	const stopDataGather: number = -1;
	let gatherDataState: number = stopDataGather;

	let predict: boolean = false;

	const gatherDataForClass = (classNumber: number) => {
		if (!videoStream) {
			toast({
				title: "Please enable the camera first",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		gatherDataState = (gatherDataState === stopDataGather) ? classNumber : stopDataGather;
		dataGatherLoop();
	};

	const calculateFeaturesOnCurrentFrame = () => {

		try {
			return tf.tidy(() => {
				let videoFrameAsTensor = tf.browser.fromPixels(videoContainer.current as HTMLVideoElement);
				let resizedTensorFrame = tf.image.resizeBilinear(
					videoFrameAsTensor,
					[modelInputHeight, modelInputWidth],
					true
				);
				let normalizedTensorFrame = resizedTensorFrame.div(255); //to get values between 0 and 1
				const prediction = mobilenetRef.current?.predict(normalizedTensorFrame.expandDims()) as tf.Tensor
				return prediction.squeeze();
			});
		} catch (error) {
			console.error(error);
		}
	};

	const dataGatherLoop = () => {
		if (!mobilenetRef.current) {
			console.log('Not mobilenet model set');
			return;
		}

		if (videoStream && gatherDataState !== stopDataGather) {

			let imageFeatures = calculateFeaturesOnCurrentFrame() as tf.Tensor<tf.Rank>;

			trainingDataInputs.push(imageFeatures);
			// console.log(trainingDataInputs)
			trainingDataOutputs.push(gatherDataState);

			//Initialize samples count for a class number
			if (examplesCount[gatherDataState] === undefined) {
				examplesCount[gatherDataState] = 0;
			}
			examplesCount[gatherDataState]++

			//Recursively call the datagatherloop function
			window.requestAnimationFrame(dataGatherLoop);
		} else {
			setObjectsSamplesGathered([...examplesCount]);
		}
	};

	let model = tf.sequential();
	if (totalObjectsToClassify > 0) {
		model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' })); //inputs of this layer are the outputs of the mobilenetv3  
		model.add(tf.layers.dense({ units: totalObjectsToClassifyRef.current, activation: 'softmax' })); //output layer

		// model.summary();
		//Compile the model with the defined optimizer and specify a loss function to use.
		model.compile({
			optimizer: 'adam',
			loss: (totalObjectsToClassify === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
			metrics: ['accuracy']
		});
	}

	const trainAndPredict = async () => {

		predict = false;

		tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
		let outputAsTensor = tf.tensor1d(trainingDataOutputs, 'int32'); //ready to use in 1hot encoding
		let oneHotOutputs = tf.oneHot(outputAsTensor, totalObjectsToClassifyRef.current);
		let inputsAsTensor = tf.stack(trainingDataInputs); //convert array of tensors to a 2D tensor

		//train the model with the newly acquired samples
		await model.fit(inputsAsTensor, oneHotOutputs, { shuffle: true, batchSize: 5, epochs: 10, callbacks: { onEpochEnd: logProgress } });

		outputAsTensor.dispose();
		oneHotOutputs.dispose();
		inputsAsTensor.dispose();

		predict = true;
		setTrainingLoading(false);
		isTrained = true;

		predictLoop()
	};

	const logProgress = (epoch: number, logs: tf.Logs | undefined) => {
		console.log('Data for epoch ' + epoch, logs);
	};

	const predictLoop = () => {
		if (predict) {
			tf.tidy(() => {
				let videoFrameAsTensor = tf.browser.fromPixels(videoContainer.current as HTMLVideoElement).div(255);
				//@ts-ignore
				let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [modelInputHeight, modelInputWidth], true);

				let imageFeatures = mobilenetRef.current?.predict(resizedTensorFrame.expandDims()) as tf.Tensor<tf.Rank>;
				let prediction = model.predict(imageFeatures) as tf.Tensor<tf.Rank>;
				prediction = prediction.squeeze();
				let highestIndex = prediction.argMax().arraySync() as number; //find the index of the highest value in the prediction array
				let predictionArray = prediction.arraySync() as number[];

				if (predictionArray[highestIndex] > 0.8) {
					if (newObject?.newObjectNames[highestIndex] !== newObject?.predictedObjectName) {
						newObject?.setPredictedObjectName(newObject?.newObjectNames[highestIndex] as string);
					}
				}
			});
			window.requestAnimationFrame(predictLoop);
		}
	};

	const reset = () => {
		predict = false;
		examplesCount.splice(0);
		setObjectsSamplesGathered([]);
		//Go through all the current recorded training data inputs and dispose of each tensor
		for (let i = 0; i < trainingDataInputs.length; i++) {
			trainingDataInputs[i].dispose();
		}
		trainingDataInputs.splice(0);
		trainingDataOutputs.splice(0);
		console.log('Tensors in memory: ' + tf.memory().numTensors);

	};


	//---------------------------------------------------------------------------------------	
	const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
	const [objectsSamplesGathered, setObjectsSamplesGathered] = useState<number[]>([]);
	const [modelLoading, setModelLoading] = useState(false);
	const [trainingLoading, setTrainingLoading] = useState(false);

	const videoContainer = useRef<HTMLVideoElement>(null);
	const mobilenetRef = useRef<tf.GraphModel | null>(null);

	const userMediaAccess = () => {
		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
	};

	const enableCam = () => {
		if (!userMediaAccess()) {
			console.warn('User media is not supported by your broswer');
			return;
		}

		try {
			navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
				if (videoContainer.current) {
					videoContainer.current.srcObject = stream;
					videoContainer.current.addEventListener('loadeddata', () => {
						setVideoStream(stream);
					});
				};
			});
		} catch (error) {
			console.error(error);
			return toast({
				title: "Something went wrong. Please, try again",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const disableCam = () => {
		if (videoStream) {
			videoStream.getTracks().forEach(track => {
				track.stop();
			});
			setVideoStream(null);
			predict = false;
		}
	};

	const handleDeleteObject = (objectName: string) => {
		newObject?.setNewObjectNames(prevState =>
			prevState.filter((selectedObject) => selectedObject !== objectName)
		);
	};

	const objectButtonInteraction = (classNumber: number) => {
		gatherDataForClass(classNumber);
	};

	useEffect(() => {
		//load the model and warm it up
		const loadMobileNetFeatureModel = async () => {
			try {
				setModelLoading(true);
				//pre chopped-up version of the mobilenetv3
				const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';

				mobilenetRef.current = await tf.loadGraphModel(URL, { fromTFHub: true });

				//Warm up the model by passing zeros through it once.
				//This is done since with large models like this, it can take a moment to
				//set everything up. So, passing zeros prevents any waiting in the future.
				tf.tidy(() => {
					if (typeof mobilenetRef.current === 'undefined') {
						throw new Error('Model could not be loaded');
					}
					mobilenetRef.current?.predict(tf.zeros([1, modelInputHeight, modelInputWidth, 3]));
				});
				setModelLoading(false);
			} catch (error) {
				console.error(error);
				setModelLoading(false);
				return toast({
					title: "Something went wrong. Please, try again",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		};
		loadMobileNetFeatureModel();

	}, []);

	useEffect(() => {
		setTotalObjectsToClassify(newObject?.newObjectNames.length as number);
		totalObjectsToClassifyRef.current = newObject?.newObjectNames.length as number;
	}, [newObject?.newObjectNames]);

	useEffect(() => {
		console.log(isTrained)
		if (videoStream && isTrained) {
			predict = true;
			predictLoop();
		}

	}, [videoStream]);


	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			p={5}
			className='w-full space-y-4'
		>
			<video
				ref={videoContainer}
				autoPlay
				className='w-full h-[380px] bg-black'
			>
			</video>
			{newObject?.newObjectNames.length as number > 0 && (
				<Box>
					<List>
						{newObject?.newObjectNames.map((objectName, index) => (
							<ListItem key={index} className='flex items-center'>
								<ListIcon as={MdDoubleArrow} color={'green.500'} />
								<span className='font-medium text-blue-600'>
									{objectName}
								</span>
								<span className='ml-1'>
									samples captured: {objectsSamplesGathered[index] ? objectsSamplesGathered[index] : 0}
								</span>
							</ListItem>
						))}
					</List>
				</Box>

			)}

			<Box className='w-full'>
				<Text className='text-lg font-medium'>
					Controls
				</Text>
				<Box
					p={3}
					className='w-full border border-gray-400 rounded-xl space-y-2'
				>
					<Box className='flex gap-3 items-center border-b border-gray-300'>
						{videoStream ? (
							<Button
								onClick={disableCam}
								colorScheme='red'
								fontWeight={'medium'}
								size={'sm'}
								className='mb-2'
							>
								Stop Capturing
							</Button>
						) : (
							<Button
								onClick={enableCam}
								colorScheme='green'
								fontWeight={'medium'}
								size={'sm'}
								className='mb-2'
								isDisabled={modelLoading ? true : false}

							>
								Enable Webcam
							</Button>
						)}
						{modelLoading && (
							<Box className='flex items-center gap-2 mb-2'>
								<ClipLoader size={25} />
								<Text className='text-lg font-medium'>
									Loading model...
								</Text>
							</Box>
						)}
					</Box>
					<Box className='w-full border-b border-gray-300'>
						<ButtonGroup
							spacing={0}
							colorScheme='blue'
							className='mb-2 flex flex-wrap'
						>
							{newObject?.newObjectNames.map((objectName, index) => {
								const buttonText = objectName;
								return (
									<Box
										key={index}
										className='flex items-center gap-1 mr-3 mb-3'
									>
										<Button
											fontWeight={'medium'}
											onMouseDown={() => objectButtonInteraction(index)}
											onMouseUp={() => objectButtonInteraction(index)}
											onTouchEnd={() => objectButtonInteraction(index)}
										>
											{buttonText}
										</Button>
										<DeleteIcon
											cursor={'pointer'}
											onClick={() => handleDeleteObject(objectName)}
										/>
									</Box>)
							})}
							<NewObjectButtonModal>
								<Button
									colorScheme='gray'
									fontWeight={'medium'}
									rightIcon={<AddIcon />}
									className='border border-gray-300'
								>
									Add Object
								</Button>
							</NewObjectButtonModal>
						</ButtonGroup>
					</Box>
					<Box className='border-b border-gray-300'>
						<ButtonGroup spacing={6} className='mb-2'>
							<Button
								colorScheme='green'
								fontWeight={'medium'}
								onClick={trainAndPredict}
								isLoading={trainingLoading}
								isDisabled={newObject?.newObjectNames.length === 0 || modelLoading ? true : false}
							>
								Ready
							</Button>
							<div className='h-10 border border-gray-400'></div>
							<Button
								colorScheme='red'
								fontWeight={'medium'}
								onClick={reset}
							>
								Reset
							</Button>
						</ButtonGroup>
					</Box>
				</Box>
			</Box>
		</Box>
	)
};

export default ProductDetection;