import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
}

export default function Login({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Login</Text>

            <Button title="Entrar (Ir pra home)" onPress={() => navigation.navigate('Home')} />
            <Button title="Criar nova conta" onPress={() => navigation.navigate('Cadastro')} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});