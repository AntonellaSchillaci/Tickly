import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Task } from '../../types';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isCompletedView?: boolean;
};

export default function TaskItem({ task, onComplete, onDelete, isCompletedView }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, task.completed && styles.completed]}>
          {task.text}
        </Text>
        {task.reminderTime && (
          <Text style={styles.reminderText}>
            {task.reminderTime.toLocaleString()}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => isCompletedView ? onDelete(task.id) : onComplete(task.id)}
      >
        <Text style={styles.buttonText}>{isCompletedView ? '✖' : '✔'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  reminderText: { 
    fontSize: 12,        
    color: '#999',     
    marginTop: 3,        
    fontStyle: 'italic',
  },
  completed: { textDecorationLine: 'line-through', color: '#b0bec5' },
  button: {
    backgroundColor: '#ff6f61',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
