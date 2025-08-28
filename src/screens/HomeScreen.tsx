import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Task } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: -10, y: 0 });
  const [shoot, setShoot] = useState(false);

  const addTask = (text: string, reminderTime?: Date) => {
    setTasks([
      ...tasks,
      { 
        id: Date.now().toString(), 
        text, 
        completed: false, 
        reminderTime: reminderTime || null 
      }
    ]);
  };
  
  const completeTask = (id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: true } : task));

    const randomOrigin = { x: Math.random() * width, y: 0 };
    setConfettiOrigin(randomOrigin);
    setShoot(false);
    setTimeout(() => setShoot(true), 50);

    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== id));
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#fff8f0', '#ffe8d6']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Tickly</Text>
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
});
