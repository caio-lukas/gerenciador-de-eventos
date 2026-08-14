import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante para salvar o token
import Toast from 'react-native-toast-message'; // Importando o Toast
import api from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './style';

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

export default function Cadastro({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Por favor, preencha todos os campos.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'E-mail inválido',
        text2: 'Por favor, insira um endereço de e-mail válido.'
      });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'As senhas não coincidem.'
      });
      return;
    }

    if (senha.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'A senha deve ter no mínimo 8 caracteres.'
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        nome,
        email,
        senha
      });

      const loginResponse = await api.post('/auth/login', {
        email,
        senha
      });

      const { token } = loginResponse.data;
      await AsyncStorage.setItem('@EventosBR:token', token);

      Toast.show({
        type: 'success',
        text1: 'Bem-vindo!',
        text2: 'Conta criada e login realizado com sucesso.'
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error: any) {
      console.log("ERRO DE CADASTRO:", error.message, error.response?.data);
      const mensagemErro = error.response?.data?.mensagem || 'Erro ao realizar cadastro. Verifique os dados.';
      
      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: mensagemErro
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Criar nova conta</Text>
          </View>

          <Text style={styles.subtitle}>
            Comece a organizar seus eventos corporativos e sociais hoje mesmo com a nossa plataforma moderna.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nome do Administrador</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setMostrarSenha(!mostrarSenha)}
              >
                <Feather name={mostrarSenha ? "eye" : "eye-off"} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Repita a senha escolhida"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                <Feather name={mostrarConfirmarSenha ? "eye" : "eye-off"} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.primaryButtonText}>Confirmar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerTextLink}>Faça Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}