import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function ResponderPreguntaIA({ route, navigation }) {
  const { pregunta, preguntasGeneradasId, numeroPregunta, totalPreguntas, preguntas } = route.params;
  const [loading, setLoading] = useState(false);
  const [seleccion, setSeleccion] = useState(null);
  const [retro, setRetro] = useState(null);
  const [correcta, setCorrecta] = useState(null);

  const responder = async (opcion) => {
    setSeleccion(opcion);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await api.post(
        "/progreso/responder",
        {
          preguntasGeneradasId,
          pregunta: pregunta.pregunta,
          respuestaUsuario: opcion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRetro(data.progreso.retroalimentacion);
      setCorrecta(data.progreso.esCorrecta);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const avanzar = () => {
    const siguienteIndex = numeroPregunta; // porque numeroPregunta ya es index+1
    if (siguienteIndex < totalPreguntas) {
      navigation.replace("ResponderPreguntaIA", {
        pregunta: preguntas[siguienteIndex], // 👈 siguiente pregunta
        preguntasGeneradasId,
        numeroPregunta: siguienteIndex + 1,
        totalPreguntas,
        preguntas,
      });
    } else {
      // Si ya no hay más preguntas, regresa al listado
      navigation.navigate("DocPreguntasScreen", { documentoId: preguntasGeneradasId });
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Número de pregunta */}
      <Text style={styles.subtitle}>
        Pregunta {numeroPregunta} del diseño algorítmico ({numeroPregunta}/{totalPreguntas})
      </Text>

      {/* Texto de la pregunta */}
      <Text style={styles.title}>{pregunta.pregunta}</Text>

      {/* Opciones */}
      {pregunta.opciones.map((opcion, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => responder(opcion)}
          style={[
            styles.option,
            seleccion === opcion && styles.optionSelected,
          ]}
        >
          <Text style={styles.optionText}>{opcion}</Text>
        </TouchableOpacity>
      ))}

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#58CC02" style={{ marginTop: 20 }} />}

      {/* Retroalimentación */}
      {retro && (
        <View
          style={[
            styles.feedback,
            { backgroundColor: correcta ? "#DFFFD6" : "#FFD6D6" },
          ]}
        >
          <Text style={styles.feedbackText}>{retro}</Text>
        </View>
      )}

      {/* Botón para avanzar si es correcta */}
      {correcta && (
        <TouchableOpacity style={styles.nextButton} onPress={avanzar}>
          <Text style={styles.nextButtonText}>Avanzar a la siguiente pregunta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F9F0", // verde muy claro
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "#58CC02",
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
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 10,
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a8917", // verde Duolingo
  },
  option: {
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0", // verde suave al seleccionar
    borderColor: "#58CC02",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  feedback: {
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    color: "#333",
  },
  nextButton: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#58CC02",
    borderRadius: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});