import { View, Text, TouchableOpacity, StyleSheet ,Image} from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/3d.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido(a), {user?.nombre} </Text>

      {/* MENÚ PRINCIPAL */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => navigation.navigate("Materias")}
        >
          <Text style={styles.menuText}>Materias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#2196F3" }]}
          onPress={() => navigation.navigate("ProgresoScreen")}
        >
          <Text style={styles.menuText}>Progreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#FF9800" }]}
          onPress={() => navigation.navigate("Configuracion")}
        >
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÓN CERRAR SESIÓN */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1a8917", // verde intenso
    textAlign: "center",
  },
  menuContainer: {
    width: "100%",
  },
  menuButton: {
    padding: 20,
    borderRadius: 25, // más redondeado
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#E53935",
    borderRadius: 25,
    width: "100%",
    elevation: 3,
  },
  logoutText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginTop: -120,   // espacio desde arriba
    marginBottom: 20,
  }
});