import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/authContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await login(correo, password);

    if (!res.ok) {
      setError(res.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

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

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Ingresar</Text>
      </TouchableOpacity>

      {/* 🔹 BOTÓN PARA REGISTRARSE */}
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>¿No tienes cuenta? Crear usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkBtn: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
