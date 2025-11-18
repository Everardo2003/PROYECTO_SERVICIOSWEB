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

export default function DocPreguntasScreen({ route, navigation }) {
  const { documentoId } = route.params;
  const [preguntas, setPreguntas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDocumento();
  }, []);

  const cargarDocumento = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await api.get("/preguntas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const documento = res.data.find((d) => d._id === documentoId);

      setPreguntas(documento?.preguntas || []);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando preguntas...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas del documento</Text>

      <FlatList
        data={preguntas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("ResponderPreguntaIA", {
                pregunta: item.pregunta,
                preguntasGeneradasId: documentoId,
              })
            }
          >
            <Text style={styles.question}>{item.pregunta}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  question: { fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
