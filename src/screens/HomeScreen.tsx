import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../types';
import { scheduleTaskNotification } from '../notifications';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: -10, y: 0 });
  const [shoot, setShoot] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string } | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasksToSave));
    } catch (e) {
      console.error(e);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    fetch('https://zenquotes.io/api/today')
      .then(res => res.json())
      .then(data => {
        const q = data[0];
        setDailyQuote({ text: q.q, author: q.a });
      })
      .catch(console.error)
      .finally(() => setLoadingQuote(false));
  }, []);

  const addTask = (text: string, reminderTime?: Date) => {
    const newTask: Task = { id: Date.now().toString(), text, completed: false, reminderTime: reminderTime || null };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
    if (reminderTime) scheduleTaskNotification(newTask.id, newTask.text, reminderTime);
  };

  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(task => (task.id === id ? { ...task, completed: true } : task));
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    const randomOrigin = { x: Math.random() * width, y: 0 };
    setConfettiOrigin(randomOrigin);
    setShoot(false);
    setTimeout(() => setShoot(true), 50);
    setTimeout(() => {
      const filtered = updatedTasks.filter(task => task.id !== id);
      setTasks(filtered);
      saveTasks(filtered);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#fff8f0', '#ffe8d6']} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Tickly</Text>
          </View>
          <View style={styles.quoteContainer}>
            {loadingQuote ? (
              <ActivityIndicator size="small" color="#ff6f61" />
            ) : dailyQuote ? (
              <>
                <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
                <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
              </>
            ) : (
              <Text style={styles.quoteError}>⚠️ Nessuna massima disponibile</Text>
            )}
          </View>
          <TaskInput onAdd={addTask} />
          <TaskList tasks={tasks} onComplete={completeTask} />
          {shoot && (
            <ConfettiCannon
              count={50}
              origin={confettiOrigin}
              fadeOut
              autoStart
              explosionSpeed={350}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerContainer: { marginBottom: 20, alignItems: 'center' },
  header: { fontSize: 36, fontWeight: 'bold', color: '#ff6f61', textAlign: 'center' },
  quoteContainer: {
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: { fontSize: 18, fontStyle: 'italic', color: '#1a1a1a', textAlign: 'center', marginBottom: 6 },
  quoteAuthor: { fontSize: 16, color: '#555', textAlign: 'center' },
  quoteError: { fontSize: 14, color: 'red', textAlign: 'center' },
});
