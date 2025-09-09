// React Native trivia app (Expo-compatible)
// Filename: App.js

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';

const QUESTIONS = [
  {
    id: 'q1',
    image: 'https://ccimasenalizaciones.ccimasenalizaciones.pe/images/joomlart/articulos_blog/senal_pare_portada_ccima.jpg',
    question: '¿Qué indica esta señal?',
    options: [
      { id: 'a', text: 'Pare', correct: true },
      { id: 'b', text: 'Ceda el paso', correct: false },
      { id: 'c', text: 'Prohibido estacionar', correct: false },
      { id: 'd', text: 'Zona escolar', correct: false },
    ],
  },
  {
    id: 'q2',
    image: 'https://www.radiokermes.com/images/stories/OCTUBRE_2015/Fotos-MGP-Giro-a-la-izquierda-en-avenidas-1.jpg',
    question: '¿Qué prohíbe esta señal?',
    options: [
      { id: 'a', text: 'Prohibido girar a la izquierda', correct: true },
      { id: 'b', text: 'Prohibido adelantar', correct: false },
      { id: 'c', text: 'Peligro por curvas', correct: false },
      { id: 'd', text: 'Prohibido paso de peatones', correct: false },
    ],
  },
  {
    id: 'q3',
    image: 'https://media.istockphoto.com/id/2159529652/es/vector/colecci%C3%B3n-de-letreros-de-cruce-de-zona-escolar.jpg?s=612x612&w=is&k=20&c=g3Uoldj7_guP0h4T7kQVzbGKpBoplvoM74F2id2L55k=',
    question: '¿Qué indica esta señal?',
    options: [
      { id: 'a', text: 'Cruce peatonal', correct: true },
      { id: 'b', text: 'Estación de buses', correct: false },
      { id: 'c', text: 'Zona de obras', correct: false },
      { id: 'd', text: 'Restricción de altura', correct: false },
    ],
  },
  {
    id: 'q4',
    image: 'https://previews.123rf.com/images/voddol/voddol1202/voddol120200011/12442242-give-way-warning-traffic-sign-at-the-road-side.jpg',
    question: '¿Qué indica esta señal?',
    options: [
      { id: 'a', text: 'Ceda el paso', correct: true },
      { id: 'b', text: 'Pare', correct: false },
      { id: 'c', text: 'No girar a la derecha', correct: false },
      { id: 'd', text: 'Velocidad máxima', correct: false },
    ],
  },
  {
    id: 'q5',
    image: 'https://ccimasenalizaciones.ccimasenalizaciones.pe/images/joomlart/articulos_blog/senal_proximidad_semaforo.jpg',
    question: '¿Qué advierte esta señal?',
    options: [
      { id: 'a', text: 'Cruce ferroviario', correct: false },
      { id: 'b', text: 'Próximo semáforo', correct: true },
      { id: 'c', text: 'Peatones en la vía', correct: false },
      { id: 'd', text: 'Curva peligrosa', correct: false },
    ],
  },
  {
    id: 'q6',
    image: 'https://radiotemuco.com/home/wp-content/uploads/2018/07/6.jpg',
    question: '¿Qué indica esta señal?',
    options: [
      { id: 'a', text: 'Velocidad máxima permitida', correct: true },
      { id: 'b', text: 'Velocidad mínima', correct: false },
      { id: 'c', text: 'Fin de restricción de velocidad', correct: false },
      { id: 'd', text: 'Zona escolar', correct: false },
    ],
  },
];

const TIMER_SECONDS = 15;

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef(null);

  const currentQuestion = QUESTIONS[currentIndex];

  useEffect(() => {
    if (!showResults) {
      const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [currentIndex, showResults]);

  useEffect(() => {
    if (!showResults) {
      resetTimer();
      return () => clearInterval(timerRef.current);
    }
  }, [currentIndex, showResults]);

  useEffect(() => {
    if (timeLeft === 0 && !showAnswer && !showResults) {
      setShowAnswer(true);
      setSelectedOption(null);
    }
  }, [timeLeft, showAnswer, showResults]);

  function resetTimer() {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const handleSelectOption = (option) => {
    if (showAnswer) return;
    setSelectedOption(option.id);
    setShowAnswer(true);
    if (option.correct) {
      setScore((s) => s + 1);
    }
    clearInterval(timerRef.current);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowAnswer(false);
      setTimeLeft(TIMER_SECONDS);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setTimeLeft(TIMER_SECONDS);
    setScore(0);
    setShowResults(false);
  };

  const renderOption = ({ item }) => {
    const isSelected = selectedOption === item.id;
    const isCorrect = item.correct === true;
    let optionStyle = styles.option;
    if (showAnswer) {
      if (isSelected && isCorrect) {
        optionStyle = [styles.option, styles.optionCorrect];
      } else if (isSelected && !isCorrect) {
        optionStyle = [styles.option, styles.optionIncorrect];
      } else if (!isSelected && isCorrect) {
        optionStyle = [styles.option, styles.optionCorrectDim];
      }
    }
    return (
      <TouchableOpacity style={optionStyle} onPress={() => handleSelectOption(item)} disabled={showAnswer}>
        <Text style={styles.optionText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Resultados</Text>
          <Text style={styles.score}>Aciertos: {score} de {QUESTIONS.length}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleRestart}>
            <Text style={styles.nextButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trivia: Señales de Tránsito (Colombia)</Text>
        <Text style={styles.score}>Puntaje: {score} / {QUESTIONS.length}</Text>
      </View>

      <View style={styles.timerRow}>
        <Text style={styles.timerLabel}>Tiempo:</Text>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: currentQuestion.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.question}>{currentQuestion.question}</Text>
        <FlatList data={shuffledOptions} renderItem={renderOption} keyExtractor={(item) => item.id} style={styles.optionsList} />
        <View style={styles.controls}>
          <Text style={styles.progress}>Pregunta {currentIndex + 1} de {QUESTIONS.length}</Text>
          <TouchableOpacity style={[styles.nextButton, showAnswer ? {} : styles.nextButtonDisabled]} onPress={handleNext} disabled={!showAnswer}>
            <Text style={styles.nextButtonText}>{currentIndex + 1 < QUESTIONS.length ? 'Siguiente' : 'Finalizar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fb',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: isWeb ? 24 : 0,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  score: {
    marginTop: 6,
    fontSize: 16,
    color: '#333',
  },
  timerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerLabel: {
    marginRight: 6,
    fontSize: 14,
  },
  timerBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e6ef',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: Math.min(300, width * 0.5),
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  optionsList: {
    marginBottom: 12,
    width: '100%',
  },
  option: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e6ef',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 16,
  },
  optionCorrect: {
    backgroundColor: '#d4f7dc',
    borderColor: '#a6e9b5',
  },
  optionIncorrect: {
    backgroundColor: '#ffd6d6',
    borderColor: '#ffb3b3',
  },
  optionCorrectDim: {
    backgroundColor: '#e9f7ee',
    borderColor: '#cfeeda',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  progress: {
    fontSize: 14,
  },
  nextButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0077cc',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
