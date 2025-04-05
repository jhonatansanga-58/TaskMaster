import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Surface, IconButton, Button } from "react-native-paper";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { Task } from "@/lib/api";
import { getStatusIcon, getStatusColor, formatTime } from "@/utils/taskUtils";

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
                    <View style={styles.timeContainer}>
                      <IconButton
                        icon="clock-outline"
                        size={20}
                        iconColor="#007AFF"
                        style={styles.timeIcon}
                      />
                      <Text style={styles.timeText}>
                        {formatTime(task.time)}
                      </Text>
                    </View>
                    <IconButton
                      icon={getStatusIcon(task.status)}
                      size={35}
                      iconColor={getStatusColor(task.status)}
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    marginRight: 0,
  },
  timeText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 19,
  },
  deleteButton: {
    marginTop: 8,
  },
});
