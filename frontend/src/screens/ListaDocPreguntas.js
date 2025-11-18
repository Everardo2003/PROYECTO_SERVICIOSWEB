import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaDocumentosScreen({ route, navigation }) {
  const { temaNombre } = route.params;
  console.log(temaNombre);
  const [documentos, setDocumentos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // 🔥 1) Cargar documentos del usuario
      const docsRes = await api.get("/preguntas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const docsFiltrados = docsRes.data.filter(
        (d) => d.tema === temaNombre
      );

      setDocumentos(docsFiltrados);

      // 🔥 2) Cargar estadísticas por documento
      const statsRes = await api.get("/progreso/usuario/estadisticas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(statsRes.data.estadisticas || {});
    } catch (err) {
      console.log("Error cargando documentos", err);
    } finally {
      setLoading(false);
    }
  };

  const obtenerStatsDocumento = (docId) => {
    for (const materia of Object.values(stats)) {
      for (const tema of Object.values(materia)) {
        if (tema[docId]) return tema[docId];
      }
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pregunta del tema: {temaNombre}</Text>

      <FlatList
        data={documentos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const docStats = obtenerStatsDocumento(item._id);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("DocPreguntasScreen", {
                  documentoId: item._id,
                  temaNombre,
                })
              }
            >
              <Text style={styles.cardTitle}>
                Documento: {item._id.substring(0, 6)}...
              </Text>

              {docStats ? (
                <Text style={styles.stats}>
                  Progreso: {docStats.correctas}/{docStats.totalPreguntas} (
                  {docStats.progreso}%)
                </Text>
              ) : (
                <Text style={styles.stats}>Sin progreso</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  stats: { marginTop: 8, fontSize: 15, color: "#555" },
});
