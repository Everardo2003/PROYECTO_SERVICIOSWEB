import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, } from "react-native";
import api from "../api/axiosClient";
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
                headers: { Authorization: `Bearer ${token}` }
            });

            const prog = res.data.progreso;
            // ----------------------------
            // 🚨 NUEVA VALIDACIÓN QUE PEDISTE
            // Si YA EXISTE un progreso de este subtema, bloquear
            // ----------------------------
            setRetro(prog.retroalimentacion);
            if (prog?.esCorrecta== true) {
                Alert.alert(
                    "Bien hecho",
                    retro,
                    [
                        {
                            text: "Ir a progreso",
                            onPress: () => navigation.navigate("ProgresoScreen"),
                        }
                    ]
                );
                return;
            }

            // Si es nuevo → mostrar retro

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
                <Text key={i} style={styles.option}>• {op}</Text>
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
        marginTop: 45,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    option: {
        fontSize: 16,
        marginLeft: 10,
    },
    input: {
        backgroundColor: "white",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginTop: 15,
        minHeight: 100,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    retroBox: {
        backgroundColor: "#e9ffe8",
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#a9dca3",
    },
    retroText: {
        fontSize: 16,
    },
});
