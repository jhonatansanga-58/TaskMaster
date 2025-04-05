import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, FAB, Appbar, Portal } from "react-native-paper";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import LoginForm from "@/components/LoginForm";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { fetchTasks, Tasks } from "@/lib/api";
//import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Tasks>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        console.log("session.user.id", session.user.id);
        fetchTasks(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchTasks(session?.user.id).then((tasks) => {
          setTasks(tasks);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase.from("task").delete().eq("id", taskId);

      if (error) throw error;

      // Update local state after successful deletion
      setTasks((prevTasks) => prevTasks?.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="TaskMaster" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard task={item} onDelete={handleDeleteTask} />
        )}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <CreateTaskModal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          onTaskCreated={() => {
            if (session?.user) {
              fetchTasks(session.user.id).then((tasks) => {
                setTasks(tasks);
              });
            }
            setShowCreateModal(false);
          }}
          userId={session.user.id}
        />
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  list: {
    padding: 5,
  },
  header: {
    backgroundColor: "#007AFF",
  },
  headerTitle: {
    color: "#FFFFFF",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
  },
});
