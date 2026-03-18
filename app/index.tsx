// app/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import TaskCard from '../src/components/TaskCard';
import { Task, ColumnStatus } from '../src/types';

// Get screen width to make columns fit the device nicely
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3 - 25; // 3 columns with some margin

const COLUMNS: ColumnStatus[] = ['listed', 'active', 'completed'];

export default function AppBoard() {
  // Starting with some dummy data so you can see it work immediately
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Buy Milk', description: 'Need 2% milk for coffee.', color: '#3498db', status: 'listed' },
    { id: '2', title: 'Finish UI', description: 'Complete the React Native layout.', color: '#e74c3c', status: 'active' },
  ]);

  // The logic for moving and deleting cards
  const handleMoveTask = (id: string, direction: 'left' | 'right') => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const currentStatusIndex = COLUMNS.indexOf(task.status);

      // Moving Left
      if (direction === 'left') {
        if (currentStatusIndex === 0) {
          // It's in 'listed' and moved left -> DELETE IT
          return prevTasks.filter(t => t.id !== id);
        }
        // Otherwise, move it one column left
        task.status = COLUMNS[currentStatusIndex - 1];
      } 
      // Moving Right
      else {
        if (currentStatusIndex === COLUMNS.length - 1) {
          // It's in 'completed' and moved right -> DELETE IT (based on your prompt)
          return prevTasks.filter(t => t.id !== id);
        }
        // Otherwise, move it one column right
        task.status = COLUMNS[currentStatusIndex + 1];
      }

      // Return a new array with the updated task to trigger a re-render
      const newTasks = [...prevTasks];
      newTasks[taskIndex] = task;
      return newTasks;
    });
  };

  // Helper to render a specific column
  const renderColumn = (status: ColumnStatus, title: string) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <View style={styles.column} key={status}>
        <Text style={styles.columnTitle}>{title} ({columnTasks.length})</Text>
        <ScrollView style={styles.taskList}>
          {columnTasks.map(task => (
            <TaskCard key={task.id} task={task} onMove={handleMoveTask} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal Scroll for the columns */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.board}
      >
        {renderColumn('listed', 'Listed')}
        {renderColumn('active', 'Active')}
        {renderColumn('completed', 'Completed')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  board: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  column: {
    width: COLUMN_WIDTH,
    marginHorizontal: 10,
    backgroundColor: '#eef1f5',
    borderRadius: 12,
    padding: 10,
    height: '100%', 
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  taskList: {
    flex: 1,
  },
});