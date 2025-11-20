import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosClient";

export default function ConfigurationScreen({ navigation }) {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const userObj = JSON.parse(storedUser);
        const userId = userObj._id || userObj.id;

        setId(userId);
        setNombre(userObj.nombre);
        setRol(userObj.rol);
        setCorreo(userObj.correo);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const actualizarDatos = async () => {
        setError("");

        if (!correo) return setError("⚠️ El correo no puede ir vacío");

        if (password && password !== password2) {
            return setError("⚠️ Las contraseñas no coinciden");
        }

        try {
            const token = await AsyncStorage.getItem("token");

            const body = { nombre, correo, rol };
            if (password.trim() !== "") {
                body.password = password;
            }

            await api.put(`/usuarios/${id}`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newUser = { _id: id, nombre, correo, rol };
            await AsyncStorage.setItem("user", JSON.stringify(newUser));

            Alert.alert(
                "✅ Cuenta actualizada",
                "Tu información ha sido actualizada correctamente.",
                [{ text: "Aceptar", onPress: () => navigation.navigate("Home") }]
            );
        } catch (err) {
            console.log("Error al actualizar:", err);
            setError("❌ No se pudo actualizar la información");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración de Cuenta</Text>

            {/* Nombre (NO editable) */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={[styles.input, styles.disabled]} value={nombre} editable={false} />

            {/* Rol (NO editable) */}
            <Text style={styles.label}>Rol</Text>
            <TextInput style={[styles.input, styles.disabled]} value={rol} editable={false} />

            {/* Correo editable */}
            <Text style={styles.label}>Correo</Text>
            <TextInput
                style={styles.input}
                placeholder="Nuevo correo"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
            />

            <Text style={styles.subtitle}>Cambiar contraseña (opcional)</Text>

            <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar nueva contraseña"
                secureTextEntry
                value={password2}
                onChangeText={setPassword2}
            />

            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.btn} onPress={actualizarDatos}>
                <Text style={styles.btnText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => navigation.navigate("Home")} // o navigation.goBack()
            >
                <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25,
        textAlign: "center",
        marginTop: 50,
        color: "#1a8917", // verde intenso
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    subtitle: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
        color: "#1a8917",
    },
    input: {
        backgroundColor: "#FFF",
        padding: 14,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: "#e5e5e5",
        color: "#777",
    },
    btn: {
        backgroundColor: "#1a8917",
        padding: 16,
        borderRadius: 25,
        marginTop: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    btnText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "600",
    },
    cancelBtn: {
        backgroundColor: "#f44336", // rojo para cancelar
        marginTop: 15,
    },

});