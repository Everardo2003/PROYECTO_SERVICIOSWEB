import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

export default function SubtemaDetalleScreen({ route, navigation }) {
    const { materiaId,temaId, id, temaNombre } = route.params;
    console.log(materiaId);
    const [subtema, setSubtema] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarSubtema();
    }, []);

    const cargarSubtema = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log(api.defaults.baseURL);
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
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
                    subtema.ejercicios.map((ej, index) => (
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
                        </View>
                    ))
                ) : (
                    <Text style={styles.noExercises}>No hay ejercicios</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 45,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 22,
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    exerciseCard: {
        backgroundColor: "white",
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    optionText: {
        fontSize: 15,
        marginLeft: 10,
    },
    noExercises: {
        fontSize: 16,
        color: "#777",
        fontStyle: "italic",
    },
    resolveButton: {
        marginTop: 10,
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 8,
    },
    resolveButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
});
