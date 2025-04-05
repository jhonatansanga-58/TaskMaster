import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { TaskDetailModal } from "./TaskDetailModal";
import { Task } from "@/lib/api";
import { getStatusIcon, getStatusColor, formatTime } from "@/utils/taskUtils";

type TaskCardProps = {
  task: Task;
  onDelete: (taskId: number) => void;
  onTaskUpdated: () => void;
};

export const TaskCard = ({ task, onDelete, onTaskUpdated }: TaskCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={styles.taskCard}>
          <View style={styles.contentContainer}>
            <View style={styles.mainContent}>
              <View style={styles.textContent}>
                <Text variant="titleMedium" style={styles.title}>
                  {task.title}
                </Text>
                <View style={styles.separator} />
                <View style={styles.descriptionRow}>
                  <Text variant="bodyMedium" style={styles.description}>
                    {task.summary}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.rightContent}>
              <IconButton
                icon={getStatusIcon(task.status)}
                size={35}
                iconColor={getStatusColor(task.status)}
                style={styles.statusIcon}
              />
              <View style={styles.timeContainer}>
                <IconButton
                  icon="clock-outline"
                  size={16}
                  iconColor="#007AFF"
                  style={styles.timeIcon}
                />
                <Text style={styles.timeText}>{formatTime(task.time)}</Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      <TaskDetailModal
        visible={modalVisible}
        task={task}
        onDismiss={() => setModalVisible(false)}
        onDelete={onDelete}
        onTaskUpdated={onTaskUpdated}
      />
    </>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    margin: 10,
    padding: 8,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainContent: {
    flex: 1,
    marginRight: 8,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontWeight: "500",
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  description: {
    flex: 1,
    color: "#666666",
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 8,
  },
  statusIcon: {
    margin: 0,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    marginRight: 0,
  },
  timeText: {
    color: "#666666",
  },
});
