import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import LoginScreen from "../screens/InicioSesion/LoginScreen";
import HomeScreen from "../screens/PantallaPrincipal/HomeScreen";
import MateriasScreen from "../screens/PantallaPrincipal/MateriasScreen";
import RegisterScreen from "../screens/InicioSesion/RegisterScreen";
import ConfigurationScreen from "../screens/PantallaPrincipal/ConfigurationScreen";
import TemasScreen from "../screens/Materias/TemasScreen";
import SubtemasScreen from "../screens/Materias/SubtemasScreen";
import SubtemaDetalleScreen from "../screens/Materias/SubtemaDetalleScreen";
import ResolverEjercicioScreen from "../screens/Materias/ResolverEjercicioScreen";
import ProgresoScreen from "../screens/PantallaPrincipal/ProgesoScreen";
import ProgresoTemaScreen from "../screens/Progreso/ProgresoTemaScreen";
import ProgresoMateriaScreen from "../screens/Progreso/ProgresoMateriaScreen";
import ListaDocumentosScreen from "../screens/Preguntas/ListaDocPreguntas";
import DocPreguntasScreen from "../screens/Preguntas/DocPreguntasScreen";
import ResponderPreguntaIA from "../screens/Preguntas/ResponderPreguntaIA";
import ProgresoSubtemaScreen from "../screens/Progreso/ProgresoSubtemaScreen";


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, cargando } = useContext(AuthContext);

  if (cargando) return null; // Pantalla de carga opcional

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Materias" component={MateriasScreen} />
          <Stack.Screen name="Configuracion" component={ConfigurationScreen} />
          <Stack.Screen name="Temas" component={TemasScreen} />
          <Stack.Screen name="Subtemas" component={SubtemasScreen} />
          <Stack.Screen name="SubtemaDetalleScreen" component={SubtemaDetalleScreen} />
          <Stack.Screen name="ResolverEjercicioScreen" component={ResolverEjercicioScreen} />
          <Stack.Screen name="ProgresoScreen" component={ProgresoScreen} />
          <Stack.Screen name="ProgresoMateriaScreen" component={ProgresoMateriaScreen} />
          <Stack.Screen name="ProgresoTemaScreen" component={ProgresoTemaScreen} />
          <Stack.Screen name="PreguntaProgresoScreen" component={ListaDocumentosScreen} />
          <Stack.Screen name="DocPreguntasScreen" component={DocPreguntasScreen} />
          <Stack.Screen name="ResponderPreguntaIA" component={ResponderPreguntaIA} />
          <Stack.Screen name="ProgresoSubtemaScreen" component={ProgresoSubtemaScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
