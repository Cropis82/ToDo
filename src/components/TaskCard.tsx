// src/components/TaskCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onMove: (id: string, direction: 'left' | 'right') => void;
}

export default function TaskCard({ task, onMove }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.card, { borderLeftColor: task.color }]}>
      <View style={styles.header}>
        {/* Left Arrow */}
        <TouchableOpacity onPress={() => onMove(task.id, 'left')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        {/* Title (Click to Expand) */}
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={isExpanded ? undefined : 1}>
            {task.title}
          </Text>
        </TouchableOpacity>

        {/* Right Arrow */}
        <TouchableOpacity onPress={() => onMove(task.id, 'right')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Description (Only shows if expanded) */}
      {isExpanded && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    padding: 12,
    borderLeftWidth: 6, // Shows the task's main color
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});