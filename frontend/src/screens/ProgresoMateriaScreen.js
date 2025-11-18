import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ProgresoMateriaScreen({ route, navigation }) {
    const { materiaNombre, temas } = route.params;

    const listaTemas = Object.keys(temas);
    console.log(listaTemas);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{materiaNombre}</Text>

            <FlatList
                data={Object.keys(temas)}   // <-- AQUI SE MUESTRAN TODOS LOS TEMAS
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("ProgresoTemaScreen", {
                                materiaNombre,
                                temaNombre: item,
                                subtemas: temas[item]
                            })
                        }
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
