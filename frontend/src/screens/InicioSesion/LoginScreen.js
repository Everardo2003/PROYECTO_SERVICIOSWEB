import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "../../context/authContext";


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
      <Image
        source={require("../../assets/3d.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Inicio de Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
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

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}> Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>¿No tienes cuenta?  Crear usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // coloca los elementos arriba
    alignItems: "center",         // centra horizontalmente
    padding: 30,
    backgroundColor: "#e6f7e6",   // verde claro tipo duolingo
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#1a8917",             // verde intenso
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 25,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#1a8917",
    fontSize: 16,
    width: "100%",                // ocupa todo el ancho
  },
  btn: {
    backgroundColor: "#1a8917",
    padding: 16,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkBtn: {
    marginTop: 25,
  },
  linkText: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginTop: 40,   // espacio desde arriba
    marginBottom: 30,
  }
});