import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import questionData from '../../assets/data/questions.json';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from 'react-native-reanimated'

const {width, height} = Dimensions.get("window");

const Quiz = () => {

    // const offset = useSharedValue(0);

    const [isCounting, setIsCounting] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [showQuestion, setShowQuestion] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(-1);
    const [maxQuestions, setMaxQuestions] = useState(10);
    const [questionText, setQuestionText] = useState({question : "What is the capital of France?", answer:["Paris", "London", "Berlin", "Madrid"], correct: 0, url_image: ""});
    const [countNumber, setCountNumber] = useState(1);
    const [currentScore, setCurrentScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // const animatedStyles = useAnimatedStyle(() => {
    //     return {
    //     transform: [{ translateX: offset.value }],
    //     };
    // });

    // Start game
    const handleGameStartWithoutCountdown = useCallback(() => {
        setQuestionNumber(1);
        setCurrentScore(0);
        setIsCounting(false);
        setShowQuestion(true);
    }, []);

    // const handleStartGame = useCallback(() => {
    //     let count = 0;
    //     if(questionNumber === 0){
    //         setQuestionNumber(1);
    //     }
    //     const interval = setInterval(() => {
    //         if (count > -1) {
    //             setCountNumber(count);
    //             count--;
    //         } else {
    //             setIsCounting(false);
    //             setCountNumber(1);
    //             setShowQuestion(true);
    //             clearInterval(interval);
    //         }
    //     }, 1000);
    // }, [questionNumber]);

    const randomQuestion = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * questionData.length);
        setQuestionText(questionData[randomIndex]);
    }, []);
    
    // Handle exit game
    const exitGame = useCallback(() => {
        setIsCounting(false);
        setShowQuestion(false);
        setIsAnswered(false);
        setQuestionNumber(0);
        setSelectedOption(-1);
        randomQuestion();
    }, [randomQuestion]);

    // Handle next question
    const nextQuestion = useCallback(() => {
        if(questionNumber >= maxQuestions){
            setShowResult(true);
            setShowQuestion(false);
            return;
        }
        setSelectedOption(-1);
        setIsAnswered(false);
        setShowQuestion(false);
        setQuestionNumber(prev => prev + 1);
        setShowQuestion(true);
        randomQuestion();
    }, [randomQuestion, exitGame, questionNumber, maxQuestions]);

    const closeResult = useCallback(() => {
        setShowResult(false);
        exitGame();
    }, [exitGame]);

    // Handle option select and check answer
    const getResultOption = useCallback((option : string) => {
        if(questionText.answer[questionText.correct] === option) return true;
        return false;
    }, [questionText]);

    //
    const handleOptionSelect = useCallback((option: string) => {
        setSelectedOption(questionText.answer.indexOf(option));
    }, [questionText]);

    // Handle style for options (correct/wrong)
    const isWrongOption = useCallback((option: string) => {
        if(selectedOption === -1) return false;
        if(questionText.answer[selectedOption] === option) return true;
        return false;
    }, [questionText, selectedOption]);

    const handleAnswer = useCallback((option : string) => {
        setIsAnswered(true);
        if(questionText.answer[questionText.correct] === option){
            setCurrentScore(prev => prev + 1);
            return;
        }else{
            return;
        }
    }, [questionText, selectedOption]);

    return(
        <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7F0' }}>

        {/* {isCounting &&
        <Modal visible={true} onDismiss={() => {}} transparent={true}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{countNumber}</Text>
            </View>
        </Modal>
        } */}

            {/*Container*/}

        {/* Show start button and title */}
                {(!showQuestion && !showResult) && (
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <View>
                        <Text style={styles.welcomeText}>Mini Game</Text>
                    </View>
                    <View style={{ padding: 20, borderRadius: 10}}>
                        <TouchableOpacity onPress={() => {  handleGameStartWithoutCountdown(); }} style={styles.button}>
                            <Text style={styles.buttonText}>Start Game</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}


        {/* Show question */}
                {(showQuestion) &&(
                <View style={{width:'100%'}}>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10}}>
                        <View>
                            <TouchableOpacity onPress={() => { exitGame(); }} 
                                style={{ padding: 5, borderRadius: 5,marginLeft:20}}>
                                <Text style={[styles.subHeaderText]}>{'<'} Exit game</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 5,marginRight:20}}>
                            <Text style={[styles.subHeaderText]}>Scores: {currentScore}</Text>
                        </View>
                    </View>

                    <View style={{marginBottom: 50}}>
                        <Text style={styles.welcomeText}> {questionNumber} / {maxQuestions}</Text>
                    </View>

                    <View style={styles.container}>

                        <View style={styles.question_card}>
                            <View style={styles.question_number_card}>
                                <Text style={[styles.welcomeText]}>No.{questionNumber}</Text>
                            </View>
                            <Text style={styles.questionText}>{questionText.question}</Text>
                        </View>

                            {questionText.answer.map((option, index) => (
                                <TouchableOpacity style={getResultOption(option) && isAnswered ? styles.answer_card_correct : (isWrongOption(option) ? styles.answer_card_wrong : styles.answer_card)} 
                                    key={index} 
                                    onPress={() =>{
                                        handleAnswer(option);
                                        handleOptionSelect(option);
                                    }}
                                    disabled={isAnswered}>
                                    <Text>{option}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
            {/* Show next question button */}
                    {isAnswered && !showResult && (
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            {/* setIsCounting(true); */}
                            <TouchableOpacity onPress={() => { nextQuestion(); }} style={styles.button}>
                                <Text style={styles.buttonText}>Next Question</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                )}


        {/* Show result */}
                {showResult && (
                    <View style={{alignItems: 'center',flex:1,justifyContent:"center"}}>
                        <View style={styles.result_card}>
                            <Text style={styles.welcomeText}>Result: {currentScore}/{maxQuestions}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { closeResult(); }} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
        </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F7F0',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontFamily: "genshin_font",
        color: '#333333',
        textAlign: 'center',
    },  
    question_number_text: {
        fontSize: 16,
        fontFamily: "genshin_font",
        color: '#333333',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 50,
        fontFamily: "genshin_font",
        color: '#000000ff',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        fontFamily: "genshin_font",
        color: '#333333',
        marginBottom: 20,
    },
    subHeaderText: {
        fontSize: 14,
        fontFamily: "genshin_font",
        color: 'black',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "genshin_font",
        color: 'white',
    },
    question_number_card:{
        backgroundColor: '#7BFF7C',
        position: 'absolute',
        top: -20,
        borderRadius: 200,
        padding: 5,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    question_card:{

        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginHorizontal:30,
        marginBottom: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    result_card:{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 30,
        marginBottom: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    answer_card:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: width - 50,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    answer_card_correct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'lightgreen',
        width: width - 50,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    answer_card_wrong: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'salmon',
        width: width - 50,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },

});

export default Quiz;