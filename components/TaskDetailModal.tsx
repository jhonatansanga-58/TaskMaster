import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Surface, IconButton, Button } from "react-native-paper";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

type Task = {
  id: number;
  title: string;
  summary: string;
  description: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
};

type TaskDetailModalProps = {
  visible: boolean;
  task: Task;
  onDismiss: () => void;
  onDelete?: (taskId: number) => void;
};

export const TaskDetailModal = ({
  visible,
  task,
  onDismiss,
  onDelete,
}: TaskDetailModalProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    onDismiss();
    onDelete?.(task.id);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onDismiss}
        >
          <Surface style={styles.modalContent} elevation={5}>
            <TouchableOpacity activeOpacity={1}>
              <View>
                {/* Header section */}
                <View style={styles.header}>
                  <Text variant="headlineSmall" style={styles.title}>
                    {task.title}
                  </Text>
                </View>

                {/* Content section */}
                <View style={styles.content}>
                  <Text variant="titleMedium" style={styles.summary}>
                    {task.summary}
                  </Text>

                  <Text variant="bodyLarge" style={styles.description}>
                    {task.description}
                  </Text>

                  {/* Footer section */}
                  <View style={styles.footer}>
                    <Text variant="titleMedium" style={styles.time}>
                      {task.time}
                    </Text>
                    <IconButton
                      icon={getStatusIcon()}
                      size={35}
                      iconColor={getStatusColor()}
                    />
                  </View>

                  {/* Delete button */}
                  <Button
                    mode="contained"
                    onPress={() => setShowDeleteConfirmation(true)}
                    style={styles.deleteButton}
                    buttonColor="#FF5252"
                    icon="delete"
                  >
                    Delete Task
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </Surface>
        </TouchableOpacity>
      </Modal>

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        onDismiss={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgb(243, 243, 243)",
    borderRadius: 16,
    width: "85%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    color: "white",
    fontWeight: "600",
    fontSize: 25,
  },
  content: {
    padding: 16,
  },
  summary: {
    fontSize: 19,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  time: {
    color: "#333",
    fontWeight: "600",
    fontSize: 19,
    paddingLeft: 10,
  },
  deleteButton: {
    marginTop: 8,
  },
});
