import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando das suas pages
import Login from './src/pages/Login/Login';
import Cadastro from './src/pages/Cadastro/Cadastro';
import Home from './src/pages/Home/Home';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
}

// todo: As telas ainda não estão implementadas
// elas apenas tem links para redirecionar a fim de testar
// o funcionamento das rotas.
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        <Stack.Screen 
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home"
          component={Home}
          options={{ title: "Eventos.BR", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
