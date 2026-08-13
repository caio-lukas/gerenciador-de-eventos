import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Switch
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
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
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
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