// import * as tf from '@tensorflow/tfjs';
// import { getNewObjectNames } from '../context/newObjectContext';

// interface dataGatherLoopType {
//     videoPlaying: boolean;
//     videoElement: HTMLVideoElement;
//     objectsToDetect: number;
// }

// interface gatherDataForClassType extends dataGatherLoopType {
//     classNumber: number;
// }

// const newObjectNames = getNewObjectNames;

// //mobilenet model chosen expects an image of size 224 by 224 pixels in size.
// const modelInputWidth: number = 224;
// const modelInputHeight: number = 224;
// const stopDataGather: number = -1;

// let totalObjectsToClassify: number | undefined = undefined;
// let mobilenet: tf.GraphModel | undefined = undefined;
// let gatherDataState: number = stopDataGather;
// //Arrays will store gathered training data values as object button is clicked
// let trainingDataInputs: tf.Tensor<tf.Rank>[] = [];
// let trainingDataOutputs: number[] = [];
// let examplesCount: number[] = []; //Keep track of how many examples are contained for each class
// let predict: boolean = false;


// //load the model and warm it up
// export const loadMobileNetFeatureModel = async () => {
//     //pre chopped-up version of the mobilenetv3
//     const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';

//     mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
//     //setModelLoading(false);

//     //Warm up the model by passing zeros through it once.
//     //This is done since with large models like this, it can take a moment to
//     //set everything up. So, passing zeros prevents any waiting in the future.
//     tf.tidy(() => {
//         if (typeof mobilenet === 'undefined') {
//             throw new Error('Model could not be loaded');
//         }
//         let answer = mobilenet.predict(tf.zeros([1, modelInputHeight, modelInputWidth, 3]));
//         console.log(answer);

//     });
// };

// export const gatherDataForClass = ({
//     classNumber,
//     videoPlaying,
//     videoElement,
//     objectsToDetect,
// }: gatherDataForClassType) => {

//     gatherDataState = (gatherDataState === stopDataGather) ? classNumber : stopDataGather;
//     dataGatherLoop({ videoPlaying, videoElement, objectsToDetect });

// };

// const dataGatherLoop = ({
//     videoPlaying,
//     videoElement,
//     objectsToDetect
// }: dataGatherLoopType) => {


//     if (videoPlaying && gatherDataState !== stopDataGather) {
//         let imageFeatures = tf.tidy(() => {
//             let videoFrameAsTensor = tf.browser.fromPixels(videoElement);
//             let resizedTensorFrame = tf.image.resizeBilinear(
//                 videoFrameAsTensor,
//                 [modelInputHeight, modelInputWidth],
//                 true
//             );
//             let normalizedTensorFrame = resizedTensorFrame.div(255); //to get values between 0 and 1
//             const prediction = mobilenet?.predict(normalizedTensorFrame.expandDims()) as tf.Tensor
//             return prediction.squeeze();
//         });

//         trainingDataInputs.push(imageFeatures);
//         trainingDataOutputs.push(gatherDataState);

//         //Initialize samples count for a class number
//         if (examplesCount[gatherDataState] === undefined) {
//             examplesCount[gatherDataState] = 0;
//         }
//         examplesCount[gatherDataState]++;

//         for (let n = 0; n < objectsToDetect; n++) {
//             console.log(examplesCount[n]);

//         }
//         //Recursively call the datagatherloop function
//         window.requestAnimationFrame(() =>
//             dataGatherLoop({
//                 videoPlaying,
//                 videoElement,
//                 objectsToDetect
//             }));
//     }
// };

// let model = tf.sequential();
// model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' })); //inputs of this layer are the outputs of the mobilenetv3
// model.add(tf.layers.dense({ units: newObjectNames?.length as number, activation: 'softmax' })); //output layer

// // model.summary();
// //Compile the model with the defined optimizer and specify a loss function to use.
// model.compile({
//     optimizer: 'adam',
//     loss: (totalObjectsToClassify === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
//     metrics: ['accuracy']
// });

// const trainAndPredict = async (totalObjectsToClassify: number) => {
//     predict = false;
//     tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
//     let outputAsTensor = tf.tensor1d(trainingDataOutputs, 'int32'); //ready to use in 1hot encoding
//     let oneHotOutputs = tf.oneHot(outputAsTensor, totalObjectsToClassify);
//     let inputsAsTensor = tf.stack(trainingDataInputs);

//     // let results = await model.fit();
// };



