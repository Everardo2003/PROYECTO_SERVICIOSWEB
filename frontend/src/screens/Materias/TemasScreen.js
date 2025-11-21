import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function TemasScreen({ route, navigation }) {
  const { materiaId, materiaNombre } = route.params;
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTemas();
  }, []);

  const cargarTemas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get(`/materias/${materiaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTemas(res.data.temas || []);
    } catch (error) {
      console.log("Error cargando temas:", error.response?.data || error);
    }
    setCargando(false);
  };

  const generarPreguntas = async (index, cantidad = 5) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.post(
        `/generar-preguntas`,
        { materiaId, index, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        "Preguntas generadas",
        "Dirígete a tu progreso para continuar",
        [{ text: "Aceptar", onPress: () => navigation.navigate("ProgresoScreen") }]
      );
    } catch (error) {
      console.log("Error al generar preguntas:", error.response?.data || error);
      alert("Error generando preguntas");
    }
  };

  const renderTema = ({ item, index }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Subtemas", {
            materiaId,
            id: item._id,
            temaNumero: index + 1,
            temaNombre: item.nombre,
          })
        }
      >
        <Text style={styles.cardTitle}>{index + 1}.{item.nombre}</Text>
        <Text style={styles.cardDesc}>
          {item.contenido || "Sin descripción"}
        </Text>
      </TouchableOpacity>

      {/* BOTÓN PARA GENERAR PREGUNTAS */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => generarPreguntas(index)}
      >
        <Text style={styles.btnText}>Generar preguntas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Temas de {materiaNombre}</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#1a8917" />
      ) : (
        <FlatList
          data={temas}
          keyExtractor={(item) => item._id}
          renderItem={renderTema}
          ListEmptyComponent={
            <Text style={styles.noData}>No hay temas registrados</Text>
          }
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
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "#1a8917",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardDesc: {
    color: "#555",
    marginTop: 6,
    fontSize: 15,
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#777",
    fontWeight: "600",
  },
  btn: {
    marginTop: 12,
    backgroundColor: "#1a8917",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});