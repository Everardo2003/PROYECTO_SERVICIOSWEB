import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api
 from "../../api/axiosClient";
export default function ResponderPreguntaIA({ route }) {
    const { pregunta, preguntasGeneradasId } = route.params;
    const [loading, setLoading] = useState(false);
    const [seleccion, setSeleccion] = useState(null);
    const [retro, setRetro] = useState(null);
    const [correcta, setCorrecta] = useState(null);

    const responder = async (opcion) => {
        setSeleccion(opcion);
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");
            const {data}  = await api.post("/progreso/responder",
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

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 45 }}>
                {pregunta.pregunta}
            </Text>

            {pregunta.opciones.map((opcion, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => responder(opcion)}
                    style={{
                        padding: 14,
                        borderWidth: 1,
                        borderRadius: 10,
                        marginBottom: 12,
                        backgroundColor: seleccion === opcion ? "#d0e7ff" : "#fff",
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{opcion}</Text>
                </TouchableOpacity>
            ))}

            {loading && (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            )}

            {retro && (
                <View
                    style={{
                        marginTop: 20,
                        padding: 16,
                        backgroundColor: correcta ? "#d4f8d4" : "#ffd6d6",
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{retro}</Text>
                </View>
            )}
        </View>
    );
}
