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
import api from "../api/axiosClient";

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
        console.log("Usuario guardado:", storedUser);
        if (!storedUser) return;

        const userObj = JSON.parse(storedUser);
        const userId = userObj._id || userObj.id;

        console.log("ID cargado desde AsyncStorage:", userId);

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

        if (!correo) return setError("El correo no puede ir vacío");

        if (password && password !== password2) {
            return setError("Las contraseñas no coinciden");
        }

        try {
            const token = await AsyncStorage.getItem("token");

            const body = {
                nombre,
                correo,
                rol,
            };

            if (password.trim() !== "") {
                body.password = password;
            }

            const res = await api.put(`/usuarios/${id}`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // GUARDAR NUEVO USUARIO EN STORAGE
            const newUser = {
                _id: id,
                nombre,
                correo,
                rol,
            };
            await AsyncStorage.setItem("user", JSON.stringify(newUser));

            // MOSTRAR ALERTA SIEMPRE QUE TODO SALGA BIEN
            Alert.alert(
                "Cuenta actualizada",
                "Tu información ha sido actualizada correctamente.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => navigation.navigate("Home"),
                    },
                ]
            );

        } catch (err) {
            console.log("Error al actualizar:", err);
            setError("No se pudo actualizar la información");
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración de Cuenta</Text>

            {/* Nombre (NO editable) */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={[styles.input, styles.disabled]}
                value={nombre}
                editable={false}
            />

            {/* Rol (NO editable) */}
            <Text style={styles.label}>Rol</Text>
            <TextInput
                style={[styles.input, styles.disabled]}
                value={rol}
                editable={false}
            />

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, backgroundColor: "#f0f0f0" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", marginTop: 35 },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 5 },
    input: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    disabled: {
        backgroundColor: "#e5e5e5",
        color: "#777",
    },
    btn: { backgroundColor: "#007bff", padding: 15, borderRadius: 10 },
    btnText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" },
    error: { color: "red", marginBottom: 15, textAlign: "center" },
});
