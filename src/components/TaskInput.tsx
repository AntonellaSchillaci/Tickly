/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  onAdd: (text: string, reminderTime?: Date) => void;
};

export default function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text, reminderTime || undefined);
    setText('');
    setReminderTime(null);
    setShowPicker(false);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); 
    if (selectedDate) setReminderTime(selectedDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nuovo task..."
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateButtonText}>
          {reminderTime ? reminderTime.toLocaleString() : 'Scegli data/ora'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={{ marginBottom: 10 }}> 
        <DateTimePicker
          value={reminderTime || new Date()}
          mode="datetime"
          display="default"
          onChange={onChange}
        />
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Aggiungi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#ffd8c2',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 14, color: '#333', },
  addButton: {
    backgroundColor: '#ff6f61',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
