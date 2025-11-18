import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

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
                headers: { Authorization: `Bearer ${token}` }
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

            <FlatList
                data={materias}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("ProgresoMateriaScreen", {
                                materiaNombre: item,
                                temas: progreso[item]
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
