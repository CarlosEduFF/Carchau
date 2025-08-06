import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

interface Props {
    generatedCode: string;
    verificationCode: string;
    timer: number;
    handleNumberPress: (num: string) => void;
    handleDelete: () => void;
}

const VerificationCodeInput: React.FC<Props> = ({
    generatedCode,
    verificationCode,
    timer,
    handleNumberPress,
    handleDelete,
}) => {
    return (
        <>
            <View style={styles.iconContainer}>
                <SimpleLineIcons name="envelope-letter" style={styles.icon} size={50} />
            </View>

            <Text style={styles.instructionText}>
                Coloque o código de verificação do locador aqui e forneça o seu código para ele:
                <Text style={styles.codeText}> {generatedCode}</Text>
            </Text>

            <View style={styles.codeDisplayContainer}>
                {Array(4).fill('').map((_, index) => (
                    <View key={index} style={styles.codeCircle}>
                        <Text style={styles.codeDigit}>{verificationCode[index] || ''}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.timerText}>
                {Math.floor(timer / 60).toString().padStart(2, '0')}:
                {(timer % 60).toString().padStart(2, '0')}
            </Text>

            <View style={styles.numberPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.numberButton}
                        onPress={() => handleNumberPress(num.toString())}
                    >
                        <Text style={styles.numberText}>{num}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.numberButton}>
                    {/* Botão vazio para alinhamento */}
                </TouchableOpacity>

                <TouchableOpacity style={styles.numberButton} onPress={() => handleNumberPress('0')}>
                    <Text style={styles.numberText}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.numberButton} onPress={handleDelete}>
                    <Text style={styles.numberText}>⌫</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: '#2b4354',
        borderRadius: 80,
        padding: 20,
        marginBottom: 20,
        marginTop: 90
    },
    icon: {
        color: '#f2a51a',
    },
    instructionText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'justify',
        marginBottom: 20,
        display: 'flex'
    },
    codeText: {
        fontWeight: 'bold',
        color: '#f2a51a',
        fontSize: 18,
    },
    codeDisplayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    codeCircle: {
        borderWidth: 2,
        borderColor: '#92acdf',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    codeDigit: {
        fontSize: 24,
        color: '#fff',
    },
    timerText: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '80%',
    },
    numberButton: {
        width: '30%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#022036',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
});



export default VerificationCodeInput;
