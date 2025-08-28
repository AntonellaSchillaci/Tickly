import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from './TaskItem';
import { Task } from '../../types';

type Props = {
  tasks: Task[];
  onComplete: (id: string) => void;
};

export default function TaskList({ tasks, onComplete }: Props) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TaskItem task={item} onComplete={onComplete} />}
    />
  );
}
