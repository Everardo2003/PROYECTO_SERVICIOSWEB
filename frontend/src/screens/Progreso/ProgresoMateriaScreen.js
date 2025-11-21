import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ProgresoMateriaScreen({ route, navigation }) {
  const { materiaNombre, temas } = route.params;
  const listaTemas = Object.keys(temas);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{materiaNombre}</Text>

      {listaTemas.length === 0 ? (
        <Text style={styles.emptyText}>No hay progreso en esta materia</Text>
      ) : (
        <FlatList
          data={listaTemas}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colores[index % colores.length] }]}
              onPress={() =>
                navigation.navigate("ProgresoTemaScreen", {
                  materiaNombre,
                  temaNombre: item,
                  subtemas: temas[item],
                })
              }
            >
              <Text style={styles.cardTitle}> {item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const colores = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFF9C4", "#D1C4E9"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F7E6", // verde claro tipo duolingo
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "#1a8917",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    marginTop: 60,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a8917",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#777",
    fontWeight: "600",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});