import React,  {  use, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import questionData from '../../assets/data/questions.json';

const {width, height} = Dimensions.get("window");

const MiniGame = () => {
    const [isCounting, setIsCounting] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [showQuestion, setShowQuestion] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [questionText, setQuestionText] = useState({question : "What is the capital of France?", answer:["Paris", "London", "Berlin", "Madrid"], correct: 0, url_image: ""});
    const [countNumber, setCountNumber] = useState(1);
    const handleStartGame = useCallback(() => {
        let count = 0;
        const interval = setInterval(() => {
            if (count > 0) {
                setCountNumber(count);
                count--;
            } else {
                setIsCounting(false);
                setCountNumber(1);
                setShowQuestion(true);
                clearInterval(interval);
            }
        }, 1000);
    }, []);

    const randomQuestion = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * questionData.length);
        setQuestionText(questionData[randomIndex]);
    }, []);
    const nextQuestion = useCallback(() => {
        setIsAnswered(false);
        setShowQuestion(false); 
        setQuestionNumber(prev => prev + 1);
        randomQuestion();
    }, [randomQuestion]);

    const getResultOption = useCallback((option : string) => {
        if(questionText.answer[questionText.correct] === option) return true;
        return false;
    }, [questionText]);




    const handleAnswer = useCallback((option : string) => {
        setIsAnswered(true);
        if(questionText.answer[questionText.correct] === option){
            alert("Correct");
        }else{
            alert("An cut");
        }
    }, [questionText]);
    useEffect(() => {
        randomQuestion();
    }, [randomQuestion]);
    return(
        <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7F0' }}>
            <View style={{position: 'absolute', top: width*0.50, left: 20, right: 20, alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {}} style={styles.startButton}>
                    <Text style={styles.startButtonText}>Exit game</Text>
                </TouchableOpacity>
                {isCounting &&
                <Modal visible={true} onDismiss={() => {}} transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{countNumber}</Text>
                    </View>
                </Modal>}
                <Text style={styles.welcomeText}>Mini Game</Text>
                {!isCounting && !showQuestion && (
                <TouchableOpacity onPress={() => { setIsCounting(true); handleStartGame(); }} style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Game</Text>
                </TouchableOpacity>
                )}
                {showQuestion && (
                    <View style={styles.container}>
                        <Text style={styles.questionText}>{questionText.question}</Text>
                        {questionText.answer.map((option, index) => (
                            <TouchableOpacity style={getResultOption(option) && isAnswered ? styles.answer_card_correct : styles.answer_card} key={index} onPress={() => handleAnswer(option)} disabled={isAnswered}>
                                <Text>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {isAnswered && (
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { setIsCounting(true); handleStartGame(); nextQuestion(); }} style={styles.nextButton}>
                            <Text style={styles.startButtonText}>Next Question</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

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
        fontSize: 20,
        fontFamily: "genshin_font",
        color: '#333333',
        marginBottom: 20,
    },
    startButton: {
        position:'absolute',
        marginTop: 200,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
    },
    startButtonText: {
        fontSize: 16,
        fontFamily: "genshin_font",
        color: 'white',
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

});

export default MiniGame;