import { useEffect, useState, useCallback } from "react";
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

export default function DocPreguntasScreen({ route, navigation }) {
  const { documentoId } = route.params;
  const [preguntas, setPreguntas] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      // 🔵 1. Cargar preguntas del documento
      const resPreguntas = await api.get("/preguntas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const documento = resPreguntas.data.find((d) => d._id === documentoId);
      setPreguntas(documento?.preguntas || []);

      // 🔵 2. Cargar progreso del documento
      const resProgreso = await api.get(`/progreso/usuario/${documentoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgreso(resProgreso.data || []);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [documentoId])
  );

  const obtenerEstadoPregunta = (preguntaTexto) => {
    const p = progreso.find((x) => x.pregunta === preguntaTexto);
    if (!p) return "no-contestada";
    if (p.esCorrecta === true) return "correcta";
    if (p.esCorrecta === false) return "incorrecta";
    return "no-contestada";
  };

  const obtenerRetroalimentacion = (preguntaTexto) => {
    const p = progreso.find((x) => x.pregunta === preguntaTexto);
    return p?.retroalimentacion || null;
  };

  const colorEstado = {
    correcta: "#1a8917", // verde intenso tipo Duolingo
    incorrecta: "#f44336",
    "no-contestada": "#9e9e9e",
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a8917" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );

  const totalPreguntas = preguntas.length;
  const correctas = progreso.filter((p) => p.esCorrecta === true).length;
  const porcentaje = totalPreguntas
    ? Math.round((correctas / totalPreguntas) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progreso: {correctas} / {totalPreguntas} ({porcentaje}%)
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${porcentaje}%` }]} />
        </View>
      </View>

      <Text style={styles.title}>Contesta las siguientes preguntas:</Text>

      <FlatList
        data={preguntas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const estado = obtenerEstadoPregunta(item.pregunta);
          const retro = obtenerRetroalimentacion(item.pregunta);
          const bloqueada = estado === "correcta";

          return (
            <TouchableOpacity
              style={[
                styles.card,
                { borderLeftColor: colorEstado[estado] },
                bloqueada && { backgroundColor: "#d4f8d4" }, // verde claro si completada
              ]}
              onPress={() =>
                navigation.navigate("ResponderPreguntaIA", {
                  pregunta: item,
                  preguntasGeneradasId: documentoId,
                  numeroPregunta: index + 1,
                  totalPreguntas: preguntas.length,
                  preguntas: preguntas,
                })
              }
              disabled={bloqueada}
            >
              <Text style={styles.question}>{index + 1}. {item.pregunta}</Text>

              <Text style={[styles.estado, { color: colorEstado[estado] }]}>
                {estado === "correcta"
                  ? "Correcta"
                  : estado === "incorrecta"
                    ? "Incorrecta"
                    : "No contestada"}
              </Text>

              {retro && <Text style={styles.retro}>{retro}</Text>}
            </TouchableOpacity>
          );
        }}
      />

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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a8917",
    marginTop: 10, // 👈 para que no se encime con el botón
  },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 6,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  estado: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
  },
  retro: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
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
  progressContainer: {
    marginTop: 60,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
    color: "#1a8917",
  },
  progressBar: {
    width: "100%",
    height: 14,
    backgroundColor: "#ddd",
    borderRadius: 7,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1a8917",
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