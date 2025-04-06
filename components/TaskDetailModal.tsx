import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Surface, IconButton, Button } from "react-native-paper";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EditTaskModal } from "./EditTaskModal";
import { Task } from "@/lib/api";
import { getStatusIcon, getStatusColor, formatTime } from "@/utils/taskUtils";
import { supabase } from "@/lib/supabase";

type TaskDetailModalProps = {
  visible: boolean;
  task: Task;
  onDismiss: () => void;
  onDelete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
};

export const TaskDetailModal = ({
  visible,
  task,
  onDismiss,
  onDelete,
  onTaskUpdated,
}: TaskDetailModalProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    onDismiss();
    onDelete?.(task.id);
  };

  const handleEdit = () => {
    console.log("handleEdit called in TaskDetailModal");
    onTaskUpdated?.();
    setShowEditModal(false);
    onDismiss();
  };

  if (!task) return null;

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

                  {/* Action buttons */}
                  <View style={styles.actionButtons}>
                    {task.status === 1 && (
                      <>
                        <Text style={styles.sectionLabel}>Mark as:</Text>
                        <View style={styles.statusButtons}>
                          <Button
                            mode="contained"
                            onPress={() => {
                              supabase
                                .from("task")
                                .update({ status: 2 })
                                .eq("id", task.id)
                                .then(({ error }) => {
                                  if (!error) {
                                    onTaskUpdated?.();
                                    onDismiss();
                                  }
                                });
                            }}
                            style={[styles.actionButton, styles.completeButton]}
                            buttonColor="#4CAF50"
                            icon="check-circle"
                            labelStyle={styles.statusButtonLabel}
                            contentStyle={styles.statusButtonContent}
                          >
                            Done
                          </Button>
                          <Button
                            mode="contained"
                            onPress={() => {
                              supabase
                                .from("task")
                                .update({ status: 3 })
                                .eq("id", task.id)
                                .then(({ error }) => {
                                  if (!error) {
                                    onTaskUpdated?.();
                                    onDismiss();
                                  }
                                });
                            }}
                            style={[styles.actionButton, styles.cancelButton]}
                            buttonColor="#E53935"
                            icon="close-circle"
                            labelStyle={styles.statusButtonLabel}
                            contentStyle={styles.statusButtonContent}
                          >
                            Cancelled
                          </Button>
                        </View>
                        <View style={styles.separator} />
                      </>
                    )}
                    <View style={styles.editButtons}>
                      <Button
                        mode="contained"
                        onPress={() => setShowEditModal(true)}
                        style={[styles.actionButton, styles.editButton]}
                        buttonColor="#007AFF"
                        icon="pencil"
                      >
                        Edit Task
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => setShowDeleteConfirmation(true)}
                        style={[styles.actionButton, styles.deleteButton]}
                        buttonColor="#D32F2F"
                        icon="delete"
                      >
                        Delete Task
                      </Button>
                    </View>
                  </View>
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

      <EditTaskModal
        visible={showEditModal}
        task={task}
        onDismiss={() => setShowEditModal(false)}
        onTaskUpdate={handleEdit}
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
  actionButtons: {
    marginTop: 10,
    gap: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 6,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 0,
  },
  editButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E53935",
  },
  sectionLabel: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
    marginBottom: -2,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  statusButtonLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  statusButtonContent: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },
});
