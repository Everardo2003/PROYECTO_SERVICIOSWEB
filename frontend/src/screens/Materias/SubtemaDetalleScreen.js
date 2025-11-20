import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function SubtemaDetalleScreen({ route, navigation }) {
  const { materiaId, temaId, id, temaNombre } = route.params;
  const [subtema, setSubtema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ejerciciosResueltos, setEjerciciosResueltos] = useState([]); // 👈 aquí guardamos progreso con esCorrecta

  useEffect(() => {
    cargarSubtema();
    cargarProgreso();
  }, []);

  const cargarSubtema = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get(`/materias/subtemas/${temaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const listaSubtemas = res.data.subtemas || [];
      const encontrado = listaSubtemas.find((s) => s._id === id);
      setSubtema(encontrado);
    } catch (error) {
      console.log("Error cargando subtema:", error.response?.data || error);
    }
    setLoading(false);
  };

  const cargarProgreso = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      const userObj = JSON.parse(storedUser);
      const userId = userObj._id || userObj.id;
      const res = await api.get(`/progreso/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔥 Adaptación: recorrer el objeto de progreso y extraer preguntas con su estado esCorrecta
      const progreso = res.data.progreso || {};
      const ejercicios = [];

      Object.values(progreso).forEach((temas) => {
        Object.values(temas).forEach((subtemas) => {
          Object.values(subtemas).forEach((ejerciciosArr) => {
            ejerciciosArr.forEach((ej) => {
              ejercicios.push({
                pregunta: ej.pregunta,
                esCorrecta: ej.esCorrecta,
              });
            });
          });
        });
      });

      setEjerciciosResueltos(ejercicios);
    } catch (error) {
      console.log("Error cargando progreso:", error.response?.data || error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a8917" />
        <Text style={styles.loadingText}>Cargando subtema...</Text>
      </View>
    );
  }

  if (!subtema) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Subtema no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{subtema.nombre}</Text>

      {/* CONTENIDO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contenido</Text>
        <Text style={styles.contentText}>{subtema.contenido}</Text>
      </View>

      {/* EJERCICIOS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ejercicios</Text>

        {subtema.ejercicios?.length ? (
          subtema.ejercicios.map((ej, index) => {
            // ✅ Verificar si este ejercicio fue respondido correctamente
            const progresoEj = ejerciciosResueltos.find(
              (resuelto) => resuelto.pregunta === ej.pregunta
            );
            const yaCorrecto = progresoEj?.esCorrecta === true;

            return (
              <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseTitle}>
                  {index + 1}. {ej.pregunta}
                </Text>

                {ej.opciones.map((op, i) => (
                  <Text key={i} style={styles.optionText}>
                    • {op}
                  </Text>
                ))}

                {/* BOTÓN RESOLVER EJERCICIO */}
                {yaCorrecto ? (
                  <TouchableOpacity
                    style={[styles.resolveButton, styles.disabledButton]}
                    disabled
                  >
                    <Text style={styles.resolveButtonText}>
                      Ya lo resolviste correctamente. Ve a tu progreso para revisar retroalimentación
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.resolveButton}
                    onPress={() =>
                      navigation.navigate("ResolverEjercicioScreen", {
                        materiaId,
                        temaId,
                        subtemaNombre: subtema.nombre,
                        pregunta: ej.pregunta,
                        opciones: ej.opciones,
                        temaNombre,
                      })
                    }
                  >
                    <Text style={styles.resolveButtonText}>Resolver ejercicio</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.noExercises}>No hay ejercicios</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#E6F7E6" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 45,
    textAlign: "center",
    color: "#1a8917",
  },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#1a8917" },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 20,
    elevation: 3,
  },
  exerciseCard: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 4,
  },
  exerciseTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" },
  optionText: { fontSize: 16, marginLeft: 10, color: "#555" },
  noExercises: { fontSize: 16, color: "#777", fontStyle: "italic", textAlign: "center", marginTop: 10 },
  resolveButton: {
    marginTop: 12,
    backgroundColor: "#1a8917",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
  },
  resolveButtonText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  disabledButton: {
    backgroundColor: "#ccc", // gris para indicar bloqueo
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E6F7E6" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E6F7E6" },
  errorText: { fontSize: 18, color: "red", fontWeight: "bold" },
});