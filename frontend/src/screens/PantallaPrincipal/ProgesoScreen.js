import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function ProgresoScreen({ navigation }) {
  const [progreso, setProgreso] = useState({});

  useEffect(() => {
    cargarProgreso();
  }, []);

  const cargarProgreso = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      console.log("Usuario guardado:", storedUser);

      const userObj = JSON.parse(storedUser);
      const userId = userObj._id || userObj.id;

      const res = await api.get(`/progreso/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgreso(res.data.progreso || {});
    } catch (error) {
      console.log(error);
    }
  };

  const materias = Object.keys(progreso);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Progreso</Text>

      {materias.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes progreso registrado </Text>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colores[index % colores.length] },
              ]}
              onPress={() =>
                navigation.navigate("ProgresoMateriaScreen", {
                  materiaNombre: item,
                  temas: progreso[item],
                })
              }
            >
              <Text style={styles.cardTitle}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const colores = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFF9C4", "#D1C4E9"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F7E6", 
  },
  title: {
    marginTop:60,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a8917",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#777",
    fontWeight: "600",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});