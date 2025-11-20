import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

export default function ProgresoSubtemaScreen({ route ,navigation}) {
    const { subtemaNombre, ejercicios } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progreso en ejercicios de {subtemaNombre}</Text>

            <FlatList
                data={ejercicios}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.question}>{item.pregunta}</Text>
                        <Text style={styles.answer}>Tu respuesta: {item.respuestaUsuario}</Text>

                        <Text
                            style={[
                                styles.retro,
                                { color: item.esCorrecta ? "#1a8917" : "#e53935" },
                            ]}
                        >
                            {item.esCorrecta ? "Correcta" : "Incorrecta"}
                        </Text>

                        <Text style={styles.retroText}>{item.retroalimentacion}</Text>

                        <Text style={styles.date}>
                            {new Date(item.fechaUltimoAvance).toLocaleDateString()}
                        </Text>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.homeButtonText}>Regresar a Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
    },
    title: {
        marginTop: 60,
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#1a8917",
    },
    card: {
        backgroundColor: "#FFF",
        padding: 18,
        marginBottom: 15,
        borderRadius: 20,
        elevation: 4, // sombra Android
        shadowColor: "#000", // sombra iOS
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    answer: {
        marginTop: 5,
        fontSize: 15,
        color: "#555",
    },
    retro: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    retroText: {
        marginTop: 6,
        fontSize: 14,
        color: "#444",
        fontStyle: "italic",
    },
    date: {
        marginTop: 12,
        fontSize: 13,
        color: "#777",
        textAlign: "right",
    },
    homeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#1a8917",
        borderRadius: 25,
        marginBottom: 45,
        alignItems: "center",
        elevation: 3,
    },
    homeButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});