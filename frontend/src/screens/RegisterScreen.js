import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../api/axiosClient";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!nombre || !correo || !password || !password2) {
      return setError("Todos los campos son obligatorios");
    }

    if (password !== password2) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const res = await api.post("/usuarios", {
        nombre,
        correo,
        password,
      });

      if (res.status === 201 || res.data) {
        Alert.alert(
          "Cuenta creada",
          "Tu cuenta fue creada correctamente",
          [
            {
              text: "Aceptar",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      } else {
        setError(res.data.msg || "Ocurrió un error");
      }
    } catch (error) {
      console.log("Error al registrar:", error);

      if (error.response?.data?.msg) {
        setError(error.response.data.msg); // Error del backend
      } else {
        setError("No se pudo registrar el usuario");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    textAlign: "center",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
