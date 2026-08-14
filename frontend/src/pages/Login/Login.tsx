import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './style';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [gravarSenha, setGravarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const emailSalvo = await AsyncStorage.getItem('@EventosBR:savedEmail');
      const senhaSalva = await AsyncStorage.getItem('@EventosBR:savedPassword');
      const gravarSenhaSalvo = await AsyncStorage.getItem('@EventosBR:remember');

      // Agora carrega tanto o e-mail quanto a senha
      if (gravarSenhaSalvo === 'true' && emailSalvo && senhaSalva) {
        setEmail(emailSalvo);
        setSenha(senhaSalva);
        setGravarSenha(true);
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Por favor, preencha o e-mail e a senha.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'E-mail inválido',
        text2: 'Insira um formato de e-mail válido.'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      const { token } = response.data;
      await AsyncStorage.setItem('@EventosBR:token', token);

      // 3. Salva ou remove a senha dependendo do Switch
      if (gravarSenha) {
        await AsyncStorage.setItem('@EventosBR:savedEmail', email);
        await AsyncStorage.setItem('@EventosBR:savedPassword', senha);
        await AsyncStorage.setItem('@EventosBR:remember', 'true');
      } else {
        await AsyncStorage.removeItem('@EventosBR:savedEmail');
        await AsyncStorage.removeItem('@EventosBR:savedPassword');
        await AsyncStorage.setItem('@EventosBR:remember', 'false');
      }

      Toast.show({
        type: 'success',
        text1: 'Olá!',
        text2: 'Login realizado com sucesso.'
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error: any) {
      console.log("ERRO DE LOGIN:", error.message, error.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Erro ao entrar',
        text2: error.response?.data?.mensagem || 'E-mail ou senha incorretos.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGravarSenha = (valorNovo: boolean) => {
    if (valorNovo === true) {
      if (Platform.OS === 'web') {
        const confirmacao = window.confirm(
          "Aviso de Segurança:\n\nSalvar sua senha neste dispositivo pode permitir que outras pessoas acessem sua conta. Use isso apenas em dispositivos pessoais.\n\nDeseja continuar?"
        );
        if (confirmacao) {
          setGravarSenha(true);
        }
      } else {
        Alert.alert(
          "Aviso de Segurança",
          "Salvar sua senha neste dispositivo pode permitir que outras pessoas acessem sua conta. Use isso apenas em dispositivos pessoais.\n\nDeseja continuar?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Sim, continuar", onPress: () => setGravarSenha(true) }
          ]
        );
      }
    } else {
      setGravarSenha(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        
        <View style={styles.header}>
          <View style={styles.iconPlaceholder}>
            <Feather name="calendar" size={24} color={colors.primary} />
          </View>
          <Text style={styles.logoTitle}>
            Eventos<Text style={styles.logoTitleBlue}>.BR</Text>
          </Text>
          <Text style={styles.subtitle}>Gerencie seus eventos com facilidade</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@eventos.com.br"
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
              placeholder="********"
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

          <View style={styles.switchContainer}>
            <Switch
              value={gravarSenha}
              onValueChange={handleToggleGravarSenha}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.surface : ''}
            />
            <Text style={styles.switchLabel}>Gravar Senha</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.secondaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}