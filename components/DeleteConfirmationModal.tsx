import React from "react";
import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";
import { Surface, Text, Button } from "react-native-paper";

type DeleteConfirmationModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export const DeleteConfirmationModal = ({
  visible,
  onDismiss,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
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
            <View style={styles.container}>
              <Text variant="headlineSmall" style={styles.title}>
                Delete Task
              </Text>
              <Text variant="bodyLarge" style={styles.message}>
                Are you sure you want to delete this task?
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onDismiss}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={onConfirm}
                  style={styles.button}
                  buttonColor="#FF5252"
                >
                  Delete
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </Surface>
      </TouchableOpacity>
    </Modal>
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
    backgroundColor: "white",
    borderRadius: 16,
    width: "85%",
    maxWidth: 400,
  },
  container: {
    padding: 24,
  },
  title: {
    marginBottom: 16,
    color: "#FF5252",
    fontWeight: "600",
  },
  message: {
    marginBottom: 24,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
});
