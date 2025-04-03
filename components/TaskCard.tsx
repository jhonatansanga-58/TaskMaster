import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { TaskDetailModal } from "./TaskDetailModal";

type Task = {
  id: number;
  title: string;
  summary: string;
  description: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
};

type TaskCardProps = {
  task: Task;
  onDelete: (taskId: number) => void;
};

export const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return "check-circle";
      case "pending":
        return "clock";
      case "cancelled":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FFA000";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

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
                icon={getStatusIcon()}
                size={35}
                iconColor={getStatusColor()}
                style={styles.statusIcon}
              />
              <Text variant="labelSmall" style={styles.time}>
                {task.time}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      <TaskDetailModal
        visible={modalVisible}
        task={task}
        onDismiss={() => setModalVisible(false)}
        onDelete={onDelete}
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
  time: {
    color: "#666666",
    marginTop: 4,
  },
});
