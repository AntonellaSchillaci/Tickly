import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Task } from '../../types';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
};

export default function TaskItem({ task, onComplete }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (task.completed) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [fadeAnim, scaleAnim, task.completed]);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.text, task.completed && styles.completed]}>
        {task.text}
        {task.reminderTime && (
      <Text style={styles.reminderText}> — {new Date(task.reminderTime).toLocaleString()}</Text>
        )}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onComplete(task.id)}>
        <Text style={styles.buttonText}>✔</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: { fontSize: 16, color: '#333' },
  completed: { textDecorationLine: 'line-through', color: '#b0bec5',  },
  button: {
    backgroundColor: '#ff6f61',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reminderText: { fontSize: 12, color: '#999', marginLeft: 5 },

});
