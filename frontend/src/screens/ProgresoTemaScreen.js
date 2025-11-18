import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ProgresoTemaScreen({ route, navigation }) {
    const { temaNombre, subtemas } = route.params;

    const listaSubtemas = Object.keys(subtemas);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{temaNombre}</Text>

            <FlatList
                data={listaSubtemas}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            if (item === "Preguntas generadas por la IA") {

                                const preguntasIA = subtemas[item];

                                // 🔥 OBTENEMOS EL ID REAL DEL DOCUMENTO
                                const docId = preguntasIA.length > 0 ? preguntasIA[0].docId : null;

                                navigation.navigate("PreguntaProgresoScreen", {
                                   temaNombre,
                                    preguntas: preguntasIA
                                });

                            } else {
                                navigation.navigate("ProgresoSubtemaScreen", {
                                    subtemaNombre: item,
                                    ejercicios: subtemas[item],
                                });
                            }
                        }}
                    >
                        <Text style={styles.cardTitle}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 80 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    cardTitle: { fontSize: 18, fontWeight: "bold" }
});
