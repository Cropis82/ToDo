// src/components/TaskCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onMove: (id: string, direction: 'left' | 'right') => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      // Use standard browser popup if testing on web
      const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
      if (confirmed) {
        onDelete(task.id);
      }
    } else {
      // Use native mobile popup if on iOS/Android
      Alert.alert(
        "Delete Task",
        `Are you sure you want to delete "${task.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => onDelete(task.id) }
        ]
      );
    }
  };

  // --- Updated Aesthetic Logic ---
  let borderColor = task.color; // The side tag color
  let bgColor = '#fff';         // The main card background
  let cardOpacity = 1;

  if (task.status === 'listed') {
    borderColor = '#a0a0a0'; 
    cardOpacity = 0.7;
  } else if (task.status === 'completed') {
    bgColor = '#d4edda'; // A nice light green background
    // Notice we DON'T change the borderColor here, so it keeps the task's original color!
  }

  const showDeleteButton = isExpanded || task.status === 'completed';

  return (
    <View style={[
      styles.card, 
      { borderLeftColor: borderColor, backgroundColor: bgColor, opacity: cardOpacity }
    ]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onMove(task.id, 'left')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={isExpanded ? undefined : 1}>
            {task.title}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onMove(task.id, 'right')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {(isExpanded || showDeleteButton) && (
        <View style={styles.detailsContainer}>
          {isExpanded && (
            <Text style={styles.description}>{task.description}</Text>
          )}
          
          {showDeleteButton && (
            <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#fff', <-- Removed from here since we handle it dynamically now
    borderRadius: 8,
    marginVertical: 6,
    padding: 10,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)', // Made slightly more transparent to look good on green
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  }
});