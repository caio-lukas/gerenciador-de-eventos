import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

export default function Cadastro({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Cadastro</Text>
      
      {/* goBack() não precisa do nome da rota, ele apenas remove a tela atual da pilha */}
      <Button title="Voltar para Login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});