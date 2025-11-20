import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function MateriasScreen({ navigation }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMaterias = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No hay token guardado");
        return;
      }

      const res = await api.get("/materias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMaterias(res.data);
    } catch (error) {
      console.error("Error al cargar materias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a8917" />
        <Text style={styles.loadingText}>Cargando materias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Materias</Text>

      {materias.length === 0 ? (
        <Text style={styles.emptyText}>No hay materias disponibles.</Text>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Temas", {
                  materiaId: item._id,
                  materiaNombre: item.nombre,
                })
              }
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardDesc}>
                {item.descripcion || "Sin descripción"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F7E6", // verde claro tipo duolingo
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F7E6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 45,
    textAlign: "center",
    color: "#1a8917", // verde intenso
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 16,
  },
  card: {
    padding: 20,
    backgroundColor: "#FFF",
    marginBottom: 15,
    borderRadius: 20, // más redondeado
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a8917",
  },
  cardDesc: {
    color: "#555",
    marginTop: 6,
    fontSize: 15,
  },
});