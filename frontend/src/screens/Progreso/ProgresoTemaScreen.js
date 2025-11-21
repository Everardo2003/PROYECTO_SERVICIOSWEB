import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function ProgresoTemaScreen({ route, navigation }) {
  const { temaNombre, subtemas } = route.params;
  const listaSubtemas = Object.keys(subtemas);

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      <Text style={styles.title}>{temaNombre}</Text>

      {listaSubtemas.length === 0 ? (
        <Text style={styles.emptyText}>🚀 Aún no tienes progreso en este tema, ¡sigue aprendiendo!</Text>
      ) : (
        <FlatList
          data={listaSubtemas}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (item === "Preguntas generadas por la IA") {
                  const preguntasIA = subtemas[item];
                  navigation.navigate("PreguntaProgresoScreen", {
                    temaNombre,
                    preguntas: preguntasIA,
                  });
                } else {
                  navigation.navigate("ProgresoSubtemaScreen", {
                    subtemaNombre: item,
                    ejercicios: subtemas[item],
                  });
                }
              }}
            >
              <Text style={styles.cardTitle}>{item}</Text>
              <Text style={styles.cardSubtitle}>Haz clic para continuar ➝</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#E6F7E6", // verde claro tipo Duolingo
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
    marginTop: 50,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a8917", // verde intenso Duolingo
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#555",
    fontStyle: "italic",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 15,
    borderRadius: 25, // más redondeado
    elevation: 4, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a8917",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },
});