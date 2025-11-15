import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MateriasScreen from "../screens/MateriasScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import TemasScreen from "../screens/TemasScreen";
import SubtemasScreen from "../screens/SubtemasScreen";
import SubtemaDetalleScreen from "../screens/SubtemaDetalleScreen";
import ResolverEjercicioScreen from "../screens/ResolverEjercicioScreen";

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
