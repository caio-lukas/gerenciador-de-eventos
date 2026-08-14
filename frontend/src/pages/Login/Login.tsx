import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Efeito para carregar dados salvos caso "Gravar Senha" tenha sido ativado previamente
  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const emailSalvo = await AsyncStorage.getItem('@EventosBR:savedEmail');
      const gravarSenhaSalvo = await AsyncStorage.getItem('@EventosBR:rememberEmail');

      if (gravarSenhaSalvo === 'true' && emailSalvo) {
        setEmail(emailSalvo);
        setGravarSenha(true);
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      const { token } = response.data;

      // Salva o Token JWT na memória do aparelho
      await AsyncStorage.setItem('@EventosBR:token', token);

      // Tratamento da funcionalidade "Gravar Senha" / Lembrar E-mail
      if (gravarSenha) {
        await AsyncStorage.setItem('@EventosBR:savedEmail', email);
        await AsyncStorage.setItem('@EventosBR:rememberEmail', 'true');
      } else {
        await AsyncStorage.removeItem('@EventosBR:savedEmail');
        await AsyncStorage.setItem('@EventosBR:rememberEmail', 'false');
      }

      // Redireciona para a Home limpando o histórico para impedir navegação de volta via botão de voltar
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error: any) {
      // Adicione este console.log para ver o erro real no terminal do VS Code
      console.log("ERRO DE LOGIN:", error.message, error.response?.data);

      const mensagemErro = error.response?.data?.mensagem || 'Falha na conexão com o servidor.';
      Alert.alert('Erro no Login', mensagemErro);
    } finally {
      setLoading(false);
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
              onValueChange={setGravarSenha}
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

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}