// app/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import TaskCard from '../src/components/TaskCard';
import { Task, ColumnStatus } from '../src/types';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3 - 25; 

const COLUMNS: ColumnStatus[] = ['listed', 'active', 'completed'];

const generateColorGrid = () => {
  const grid = [];
  const grays = [];
  for (let i = 0; i < 11; i++) {
    grays.push(`hsl(0, 0%, ${90 - i * 8}%)`); 
  }
  grid.push(grays);

  for (let row = 0; row < 10; row++) {
    const colorRow = [];
    const lightness = 85 - row * 6.5; 
    for (let col = 0; col < 11; col++) {
      const hue = Math.floor((col * 360) / 11); 
      colorRow.push(`hsl(${hue}, 80%, ${lightness}%)`);
    }
    grid.push(colorRow);
  }
  return grid;
};

const COLOR_GRID = generateColorGrid();
const DEFAULT_COLOR = COLOR_GRID[4][0]; 

export default function AppBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskColor, setNewTaskColor] = useState(DEFAULT_COLOR);
  
  // NEW: Track if we are editing an existing task
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Helper to completely reset and close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskColor(DEFAULT_COLOR);
  };

  // Pre-fill the modal with the task's current data
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
    setNewTaskColor(task.color);
    setIsModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!newTaskTitle.trim()) {
      if (Platform.OS === 'web') alert("Your task needs a title!");
      else Alert.alert("Hold up", "Your task needs a title!");
      return;
    }

    if (editingTaskId) {
      // UPDATE EXISTING TASK
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === editingTaskId 
          ? { ...task, title: newTaskTitle, description: newTaskDesc, color: newTaskColor } 
          : task
      ));
    } else {
      // CREATE NEW TASK
      const newTask: Task = {
        id: Math.random().toString(),
        title: newTaskTitle,
        description: newTaskDesc,
        color: newTaskColor,
        status: 'listed' 
      };
      setTasks([...tasks, newTask]);
    }
    
    closeModal();
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
            <TaskCard 
              key={task.id} 
              task={task} 
              onMove={handleMoveTask} 
              onDelete={handleDeleteTask} 
              onEdit={handleEditTask} // Passed down here!
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.createButtonText}>+ Create New Task</Text>
      </TouchableOpacity>

      <View style={styles.board}>
        {renderColumn('listed', 'Listed')}
        {renderColumn('active', 'Active')}
        {renderColumn('completed', 'Done')}
      </View>

      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Dynamic Title based on context */}
            <Text style={styles.modalTitle}>{editingTaskId ? "Edit Task" : "New Task"}</Text>
            
            <TextInput style={styles.input} placeholder="Task Title" value={newTaskTitle} onChangeText={setNewTaskTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={newTaskDesc} onChangeText={setNewTaskDesc} multiline />
            
            <Text style={styles.colorLabel}>Select Color:</Text>
            <View style={styles.colorBoard}>
              {COLOR_GRID.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.colorRow}>
                  {row.map((color, colIndex) => (
                    <TouchableOpacity 
                      key={`color-${rowIndex}-${colIndex}`} 
                      style={[
                        styles.colorCell, 
                        { backgroundColor: color, borderColor: newTaskColor === color ? '#000' : 'transparent' }
                      ]} 
                      onPress={() => setNewTaskColor(color)}
                    />
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                {/* Dynamic Button Text */}
                <Text style={styles.saveText}>{editingTaskId ? "Save Changes" : "Save Task"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  createButton: { backgroundColor: '#2f3640', margin: 10, padding: 15, borderRadius: 8, alignItems: 'center' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  board: { flex: 1, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5 },
  column: { width: COLUMN_WIDTH, marginHorizontal: 5, backgroundColor: '#eef1f5', borderRadius: 12, padding: 5 },
  columnTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  taskList: { flex: 1 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 500, maxWidth: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  colorLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  colorBoard: { marginBottom: 20, gap: 6 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCell: { width: 26, height: 26, borderRadius: 4, borderWidth: 2 },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 10, alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: 'bold' },
  saveButton: { flex: 1, padding: 15, backgroundColor: '#2ecc71', borderRadius: 8, marginLeft: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold' },
});