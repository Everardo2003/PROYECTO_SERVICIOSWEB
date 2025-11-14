import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {user?.nombre || "Estudiante"} </Text>

      {/* MENÚ PRINCIPAL */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("Materias")}
        >
          <Text style={styles.menuText}>Materias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("Progresos")}
        >
          <Text style={styles.menuText}>Progreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
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
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  menuContainer: {
    width: "100%",
  },
  menuButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#E53935",
    borderRadius: 10,
    width: "100%",
  },
  logoutText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
