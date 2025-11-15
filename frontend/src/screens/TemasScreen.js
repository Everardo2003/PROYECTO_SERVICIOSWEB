import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

export default function TemasScreen({ route, navigation }) {
    const { materiaId, materiaNombre } = route.params;
    console.log(materiaId);
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
            console.log(index);
            const res = await api.post(`/generar-preguntas`,
                {
                    materiaId,
                    index,
                    cantidad,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Preguntas generadas:", res.data);
            alert("Preguntas generadas correctamente. Revisa tu progreso.");

        } catch (error) {
            console.log("Error al generar preguntas:", error.response?.data || error);
            alert("Error generando preguntas");
        }
    };

    const renderTema = ({ item,index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Subtemas", {
                        materiaId,
                        id: item._id,
                        temaNombre: item.nombre,
                    })
                }
            >
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={{ color: "#555", marginTop: 4 }}>
                    {item.contenido || "Sin descripción"}
                </Text>
            </TouchableOpacity>

            {/* BOTON PARA GENERAR PREGUNTAS */}
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
            <Text style={styles.title}>Temas de {materiaNombre}</Text>

            {cargando ? (
                <ActivityIndicator size="large" color="#007bff" />
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
    container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 45
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    noData: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#888",
    },
    btn: {
        marginTop: 10,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 8,
        alignItems: "center"
    },
    btnText: {
        color: "white",
        fontWeight: "bold"
    }
});
