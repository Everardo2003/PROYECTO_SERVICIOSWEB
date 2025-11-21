import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ListaDocumentosScreen({ route, navigation }) {
  const { temaNombre } = route.params;
  const [documentos, setDocumentos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const cargarDocumentos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      // 🔥 1) Cargar documentos del usuario
      const docsRes = await api.get("/preguntas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const docsFiltrados = docsRes.data.filter((d) => d.tema === temaNombre);
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

  useFocusEffect(
    useCallback(() => {
      cargarDocumentos();
    }, [temaNombre])
  );

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
        <ActivityIndicator size="large" color="#1a8917" />
        <Text style={styles.loadingText}>Cargando documentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Preguntas del tema: {temaNombre}</Text>

      <FlatList
        data={documentos}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => {
          const docStats = obtenerStatsDocumento(item._id);
          const completado =
            docStats && docStats.correctas === docStats.totalPreguntas;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                completado && {
                  backgroundColor: "#d4f8d4",
                  borderColor: "#1a8917",
                },
              ]}
              onPress={() =>
                navigation.navigate("DocPreguntasScreen", {
                  documentoId: item._id,
                  temaNombre,
                })
              }
              disabled={completado}
            >
              <Text style={styles.cardTitle}>
                Documento {index + 1} – {temaNombre}
              </Text>

              {docStats ? (
                completado ? (
                  <Text style={[styles.stats, { color: "#1a8917" }]}>
                    Completado
                  </Text>
                ) : (
                  <Text style={styles.stats}>
                    Progreso: {docStats.correctas}/{docStats.totalPreguntas} (
                    {docStats.progreso}%)
                  </Text>
                )
              ) : (
                <Text style={styles.stats}>Sin progreso</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* 🔵 Botón para regresar a Home */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>Regresar a Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
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
    marginTop: 60, // 👈 para que no se encime con el botón
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a8917",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#1a8917",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  stats: {
    marginTop: 8,
    fontSize: 15,
    color: "#555",
  },
  homeButton: {
    marginTop: 25,
    padding: 15,
    marginBottom: 45,
    backgroundColor: "#1a8917",
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});