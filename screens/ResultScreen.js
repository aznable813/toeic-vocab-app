// screens/ResultScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultScreen = ({ route, navigation }) => {
  const { correctCount, totalCount, wrongAnswers } = route.params;
  const percentage = Math.round((correctCount / totalCount) * 100);

  // 🔽 履歴保存関数
  const saveHistory = async () => {
  try {
    const historyItem = {
      date: new Date().toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour12: false,
      }),
      correctCount,
      totalCount,
      percentage,
    };

    
  

    const existingData = await AsyncStorage.getItem('quizHistory');
    const parsed = existingData ? JSON.parse(existingData) : [];

    parsed.push(historyItem);

    await AsyncStorage.setItem('quizHistory', JSON.stringify(parsed));
  } catch (error) {
    console.error('履歴保存エラー:', error);
  }};


  // 🔽 初回のみ保存
  useEffect(() => {
    saveHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>クイズ結果</Text>
      <Text style={styles.score}>
        {correctCount} / {totalCount} 正解
      </Text>
      <Text style={styles.percentage}>正答率：{percentage}%</Text>

      <View style={styles.button}>
        <Button title="もう一度挑戦" onPress={() => navigation.replace('Quiz')} />
      </View>
      <View style={styles.button}>
        <Button title="トップに戻る" onPress={() => navigation.popToTop()} />
      </View>

      {wrongAnswers.length > 0 && (
        <View style={styles.button}>
          <Button
            title="間違えた単語を復習"
            onPress={() => navigation.navigate('Review', { questions: wrongAnswers })}
          />
        </View>
      )}
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 24, marginBottom: 10 },
  percentage: { fontSize: 20, marginBottom: 30 },
  button: { marginVertical: 10, width: '80%' },
});
