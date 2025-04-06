import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import {
  Text,
  Surface,
  TextInput,
  Button,
  Portal,
  PaperProvider,
  MD3LightTheme,
} from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { supabase } from "@/lib/supabase";
import { formatTime } from "@/utils/taskUtils";
import { Task } from "@/lib/api";

type EditTaskModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onTaskUpdate: () => void;
  task: Task;
};

export const EditTaskModal = ({
  visible,
  onDismiss,
  onTaskUpdate,
  task,
}: EditTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSummary(task.summary);
      setDescription(task.description);
      setTime(task.time);
      setError("");
    }
  }, [task, visible]);

  const onDismissTimePicker = () => {
    setShowTimePicker(false);
  };

  const onConfirmTimePicker = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    setShowTimePicker(false);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setTime(formattedTime);
  };

  const handleSubmit = async () => {
    if (!task) return;

    // Reset error
    setError("");

    // Validate inputs
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!summary.trim()) {
      setError("Summary is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!time.trim()) {
      setError("Time is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("task")
        .update({
          title: title.trim(),
          summary: summary.trim(),
          description: description.trim(),
          time: time.trim(),
        })
        .eq("id", task.id);

      if (error) throw error;

      console.log("Task updated successfully, calling onTaskUpdated");
      onTaskUpdate();
      console.log("Closing edit modal");
      onDismiss();
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Portal>
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
                    Edit Task
                  </Text>
                </View>

                {/* Form section */}
                <View style={styles.content}>
                  <TextInput
                    label="Title"
                    defaultValue={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    mode="outlined"
                    error={!!error && error.includes("Title")}
                  />

                  <TextInput
                    label="Summary"
                    defaultValue={summary}
                    onChangeText={setSummary}
                    style={styles.input}
                    mode="outlined"
                    error={!!error && error.includes("Summary")}
                  />

                  <TextInput
                    label="Description"
                    defaultValue={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.descriptionInput]}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    error={!!error && error.includes("Description")}
                  />

                  <Button
                    mode="outlined"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timeButton}
                    icon="clock"
                    textColor="#007AFF"
                  >
                    {time ? formatTime(time) : "Select Time"}
                  </Button>

                  {error && (
                    <Text style={styles.errorText} variant="bodySmall">
                      {error}
                    </Text>
                  )}

                  {/* Submit button */}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    loading={loading}
                    disabled={loading}
                    buttonColor="#007AFF"
                    textColor="white"
                  >
                    Update Task
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </Surface>
        </TouchableOpacity>
      </Modal>

      <PaperProvider
        theme={{
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: "#007AFF",
            onPrimary: "white",
            onSurface: "#007AFF",
            surface: "white",
            surfaceVariant: "#F3F3F3",
            onSurfaceVariant: "#007AFF",
            secondary: "#007AFF",
            onSecondary: "white",
            secondaryContainer: "#007AFF",
            onSecondaryContainer: "white",
            tertiary: "#F3F3F3",
            onTertiary: "#007AFF",
            tertiaryContainer: "#F3F3F3",
            onTertiaryContainer: "#007AFF",
          },
        }}
      >
        <TimePickerModal
          visible={showTimePicker}
          onDismiss={onDismissTimePicker}
          onConfirm={onConfirmTimePicker}
          label="Select time"
          uppercase={false}
          cancelLabel="Cancel"
          confirmLabel="OK"
          animationType="slide"
          locale="en"
          hours={parseInt(time.split(":")[0])}
          minutes={parseInt(time.split(":")[1])}
        />
      </PaperProvider>
    </Portal>
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
  input: {
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
  },
  timeButton: {
    marginBottom: 16,
    borderColor: "#007AFF",
  },
  errorText: {
    color: "#B00020",
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
