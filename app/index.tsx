import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, FAB, Appbar } from "react-native-paper";
import { TaskCard } from "@/components/TaskCard";
import LoginForm from "@/components/LoginForm";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type Task = {
  id: number;
  title: string;
  summary: string;
  description: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Limpiar el piso",
      summary: "Cocina y sala",
      description:
        "Fregar la cocina para quitar la grasa acumulada. Limpiar las salpicaduras de refresco en la sala y pasar la aspiradora en todas las habitaciones.",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: 2,
      title: "Comprar víveres",
      summary: "Comprar alimentos para la semana",
      description:
        "Comprar víveres esenciales como papa, zanahoria, leche, carne de res, pan integral, frutas como manzanas y bananas.",
      time: "12:00 PM",
      status: "completed",
    },
    {
      id: 3,
      title: "Hacer ejercicio",
      summary: "Entrenamiento en gimnasio",
      description:
        "Hoy toca trabajar brazos y pecho. Hacer 4 series de press de banca, 3 series de bíceps con mancuernas y finalizar con estiramientos.",
      time: "6:00 PM",
      status: "cancelled",
    },
    {
      id: 4,
      title: "Estudiar inglés",
      summary: "Preparar para el examen",
      description:
        "Revisar vocabulario nuevo del último módulo, hacer ejercicios de gramática sobre tiempos verbales y practicar listening con un podcast en inglés.",
      time: "4:00 PM",
      status: "pending",
    },
    {
      id: 5,
      title: "Tocar teclado",
      summary: "Ensayo musical",
      description:
        "Practicar acordes mayores y menores, tocar una canción completa aprendida recientemente e improvisar melodías para desarrollar creatividad.",
      time: "5:00 PM",
      status: "pending",
    },
    {
      id: 6,
      title: "Organizar escritorio",
      summary: "Ordenar el espacio de trabajo",
      description:
        "Clasificar documentos importantes y archivar, limpiar la superficie del escritorio y colocar materiales de oficina en sus respectivos lugares.",
      time: "10:30 AM",
      status: "pending",
    },
    {
      id: 7,
      title: "Leer un libro",
      summary: "Avanzar con la lectura",
      description:
        "Seleccionar un capítulo del libro actual, tomar notas de las ideas principales y reflexionar sobre cómo aplicar lo aprendido.",
      time: "8:00 PM",
      status: "pending",
    },
  ]);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log("Agregar tarea")}
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
