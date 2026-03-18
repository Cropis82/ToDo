// app/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import TaskCard from '../src/components/TaskCard';
import { Task, ColumnStatus } from '../src/types';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3 - 15; // Adjusted margin slightly for better fit

const COLUMNS: ColumnStatus[] = ['listed', 'active', 'completed'];
const AVAILABLE_COLORS = ['#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];

export default function AppBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskColor, setNewTaskColor] = useState(AVAILABLE_COLORS[0]);

  // --- Logic ---
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Hold up", "Your task needs a title!");
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(), // Simple random ID generator
      title: newTaskTitle,
      description: newTaskDesc,
      color: newTaskColor,
      status: 'listed' // Starts in listed column
    };

    setTasks([...tasks, newTask]);
    
    // Reset and close modal
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskColor(AVAILABLE_COLORS[0]);
    setIsModalVisible(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleMoveTask = (id: string, direction: 'left' | 'right') => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const currentStatusIndex = COLUMNS.indexOf(task.status);

      if (direction === 'left') {
        if (currentStatusIndex === 0) return prevTasks.filter(t => t.id !== id);
        task.status = COLUMNS[currentStatusIndex - 1];
      } else {
        if (currentStatusIndex === COLUMNS.length - 1) return prevTasks.filter(t => t.id !== id);
        task.status = COLUMNS[currentStatusIndex + 1];
      }

      const newTasks = [...prevTasks];
      newTasks[taskIndex] = task;
      return newTasks;
    });
  };

  const renderColumn = (status: ColumnStatus, title: string) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <View style={styles.column} key={status}>
        <Text style={styles.columnTitle}>{title}</Text>
        <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
          {columnTasks.map(task => (
            <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Creation Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.createButtonText}>+ Create New Task</Text>
      </TouchableOpacity>

      {/* Board */}
      <View style={styles.board}>
        {renderColumn('listed', 'Listed')}
        {renderColumn('active', 'Active')}
        {renderColumn('completed', 'Done')}
      </View>

      {/* Creation Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            
            <TextInput style={styles.input} placeholder="Task Title" value={newTaskTitle} onChangeText={setNewTaskTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={newTaskDesc} onChangeText={setNewTaskDesc} multiline />
            
            <Text style={styles.colorLabel}>Select Color:</Text>
            <View style={styles.colorPicker}>
              {AVAILABLE_COLORS.map(color => (
                <TouchableOpacity 
                  key={color} 
                  style={[styles.colorCircle, { backgroundColor: color, borderWidth: newTaskColor === color ? 3 : 0 }]} 
                  onPress={() => setNewTaskColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateTask}>
                <Text style={styles.saveText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  createButton: {
    backgroundColor: '#2f3640',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  column: {
    width: COLUMN_WIDTH,
    marginHorizontal: 5,
    backgroundColor: '#eef1f5',
    borderRadius: 12,
    padding: 5,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  taskList: {
    flex: 1,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});