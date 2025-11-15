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

export default function SubtemasScreen({ route, navigation }) {
    const { materiaId,id, temaNombre } = route.params;
    const temaId=id;
    const [subtemas, setSubtemas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarSubtemas();
    }, []);

    const cargarSubtemas = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log(materiaId)
            const res = await api.get(`/materias/subtemas/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSubtemas(res.data.subtemas || []);
            
        } catch (error) {
            console.log("Error cargando subtemas:", error.response?.data || error);
        }

        setLoading(false);
    };

    const renderSubtema = ({ item }) => (
        <TouchableOpacity
            
            style={styles.card}
            onPress={() =>
                navigation.navigate("SubtemaDetalleScreen", {
                    materiaId,
                    temaId,
                    id: item._id,
                    temaNombre,
                })
            }
        >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Subtemas de {temaNombre}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={subtemas}
                    keyExtractor={(item) => item._id}
                    renderItem={renderSubtema}
                    ListEmptyComponent={
                        <Text style={styles.noData}>No hay subtemas registrados</Text>
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
});
