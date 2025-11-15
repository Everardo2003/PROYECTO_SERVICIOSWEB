import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

export default function MateriasScreen({ navigation }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMaterias = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No hay token guardado");
        return;
      }

      const res = await api.get("/materias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMaterias(res.data);
    } catch (error) {
      console.error("Error al cargar materias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10 }}>Cargando materias...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F7F9FC" }}>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 , marginTop:45}}>
        Materias
      </Text>

      {materias.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30, color: "#777" }}>
          No hay materias disponibles.
        </Text>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Temas", { materiaId: item._id ,materiaNombre: item.nombre})}
              style={{
                padding: 20,
                backgroundColor: "white",
                marginBottom: 12,
                borderRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.nombre}</Text>
              <Text style={{ color: "#555", marginTop: 4 }}>
                {item.descripcion || "Sin descripción"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
