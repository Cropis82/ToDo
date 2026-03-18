// src/components/TaskCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onMove: (id: string, direction: 'left' | 'right') => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void; // New prop for editing
}

export default function TaskCard({ task, onMove, onDelete, onEdit }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
      if (confirmed) onDelete(task.id);
    } else {
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

  let borderColor = task.color; 
  let bgColor = '#fff';         
  let cardOpacity = 1;

  if (task.status === 'listed') {
    borderColor = '#a0a0a0'; 
    cardOpacity = 0.7;
  } else if (task.status === 'completed') {
    bgColor = '#d4edda'; 
  }

  const showActions = isExpanded || task.status === 'completed';
  const deleteBtnColor = task.status === 'completed' ? '#27ae60' : '#ff4757';

  return (
    <View style={[styles.card, { borderLeftColor: borderColor, backgroundColor: bgColor, opacity: cardOpacity }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onMove(task.id, 'left')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={isExpanded ? undefined : 1}>{task.title}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onMove(task.id, 'right')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {(isExpanded || showActions) && (
        <View style={styles.detailsContainer}>
          {isExpanded && (
            <Text style={styles.description}>{task.description}</Text>
          )}
          
          {showActions && (
            <View style={styles.actionButtons}>
              {/* Edit Button */}
              <TouchableOpacity 
                onPress={() => onEdit(task)} 
                style={styles.editButton}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity 
                onPress={confirmDelete} 
                style={[styles.deleteButton, { backgroundColor: deleteBtnColor }]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    borderTopColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // Adds space between the buttons
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#3498db', // A nice clean blue
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  }
});