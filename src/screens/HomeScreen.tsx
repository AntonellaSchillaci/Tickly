import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Task } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [confettiOrigin, setConfettiOrigin] = useState({ x: -10, y: 0 });
  const [shoot, setShoot] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async (tasksToSave: Task[]) => {
    await AsyncStorage.setItem('@tasks', JSON.stringify(tasksToSave));
  };

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('@tasks');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved).map(
        (t: Task & { reminderTime?: string | null }) => ({
          ...t,
          reminderTime: t.reminderTime ? new Date(t.reminderTime) : null,
        })
      );
      setTasks(parsed);
    }
  };

  const addTask = (text: string, reminderTime?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      reminderTime: reminderTime || null,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    const randomOrigin = { x: Math.random() * width, y: 0 };
    setConfettiOrigin(randomOrigin);
    setShoot(false);
    setTimeout(() => setShoot(true), 50);
  };

  const deleteTask = (id: string) => {
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
    saveTasks(filtered);
  };

  const filteredTasks = tasks.filter(task =>
    filter === 'active' ? !task.completed : task.completed
  );

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#fff8f0', '#ffe8d6']} style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.header}>Tickly</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => setFilter('active')} style={styles.toggleButton}>
              <Text style={[styles.toggleText, filter === 'active' && styles.toggleActive]}>
                In corso
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter('completed')} style={styles.toggleButton}>
              <Text style={[styles.toggleText, filter === 'completed' && styles.toggleActive]}>
                Completate
              </Text>
            </TouchableOpacity>
          </View>

          <TaskInput onAdd={addTask} />
          <TaskList
            tasks={filteredTasks}
            onComplete={completeTask}
            onDelete={deleteTask}
            isCompletedView={filter === 'completed'}
          />

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
  header: { fontSize: 36, fontWeight: 'bold', color: '#ff6f61', textAlign: 'center', marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  toggleButton: { marginHorizontal: 10 },
  toggleText: { fontSize: 16, color: '#555' },
  toggleActive: { color: '#ff6f61', fontWeight: 'bold' },
});
