import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function SubtemasScreen({ route, navigation }) {
  const { materiaId, id, temaNombre } = route.params;
  const temaId = id;
  const [subtemas, setSubtemas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSubtemas();
  }, []);

  const cargarSubtemas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get(`/materias/subtemas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubtemas(res.data.subtemas || []);
    } catch (error) {
      console.log("Error cargando subtemas:", error.response?.data || error);
    }
    setLoading(false);
  };

  const renderSubtema = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colores[index % colores.length] }]}
      onPress={() =>
        navigation.navigate("SubtemaDetalleScreen", {
          materiaId,
          temaId,
          id: item._id,
          temaNombre,
        })
      }
    >
      <Text style={styles.cardTitle}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subtemas de {temaNombre}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a8917" />
      ) : (
        <FlatList
          data={subtemas}
          keyExtractor={(item) => item._id}
          renderItem={renderSubtema}
          ListEmptyComponent={
            <Text style={styles.noData}>No hay subtemas registrados</Text>
          }
        />
      )}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeButtonText}>Regresar a Inicio</Text>
      </TouchableOpacity>

    </View>
  );
}

const colores = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFF9C4", "#D1C4E9"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F7E6", // verde claro tipo duolingo
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 60,
    textAlign: "center",
    color: "#1a8917",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#777",
    fontWeight: "600",
  },
  homeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1a8917",
    borderRadius: 25,
    marginBottom:45,
    alignItems: "center",
    elevation: 3,
  },
  homeButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

});