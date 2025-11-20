import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import api from "../../api/axiosClient";

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
          "Cuenta creada ",
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
        setError(error.response.data.msg);
      } else {
        setError("No se pudo registrar el usuario");
      }
    }
  };

  return (
    <View style={styles.container}>
      

      <Text style={styles.title}>Creacion de Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
        placeholderTextColor="#888"
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#e6f7e6", // verde claro tipo duolingo
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a8917", // verde intenso
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 25, // estilo pill
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#1a8917",
    fontSize: 16,
    width: "100%",
  },
  btn: {
    backgroundColor: "#1a8917",
    padding: 16,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});