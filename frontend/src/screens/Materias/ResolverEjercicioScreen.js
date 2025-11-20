import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import api from "../../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResolverEjercicioScreen({ route, navigation }) {
  const { materiaId, temaId, pregunta, opciones, subtemaNombre, temaNombre } = route.params;
  const [respuesta, setRespuesta] = useState("");
  const [retro, setRetro] = useState("");

  const enviarRespuesta = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const body = {
        materiaId,
        temaNombre,
        subtemaNombre,
        pregunta,
        respuestaUsuario: respuesta,
      };

      const res = await api.post("/progreso/ejercicio", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const prog = res.data.progreso;
      setRetro(prog.retroalimentacion);

      if (prog?.esCorrecta == true) {
        Alert.alert(
          "Bien hecho",
          retro,
          [{ text: "Ir a progreso", onPress: () => navigation.navigate("ProgresoScreen") }]
        );
        return;
      }
    } catch (error) {
      console.log("Error evaluando la respuesta", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resolver ejercicio</Text>

      <Text style={styles.question}>{pregunta}</Text>

      {/* Opciones si existen */}
      {opciones?.map((op, i) => (
        <View key={i} style={styles.optionBox}>
          <Text style={styles.option}>• {op}</Text>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Escribe tu respuesta aquí..."
        multiline
        value={respuesta}
        onChangeText={setRespuesta}
      />

      <TouchableOpacity style={styles.button} onPress={enviarRespuesta}>
        <Text style={styles.buttonText}>Enviar respuesta</Text>
      </TouchableOpacity>

      {retro ? (
        <View style={styles.retroBox}>
          <Text style={styles.retroText}>{retro}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
  },
  title: {
    marginTop: 45,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a8917",
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  optionBox: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  option: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    minHeight: 100,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4FC3F7", // azul claro para diferenciar
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  retroBox: {
    backgroundColor: "#d4f8d4", // verde suave
    borderRadius: 20,
    padding: 15,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#a9dca3",
    elevation: 2,
  },
  retroText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});