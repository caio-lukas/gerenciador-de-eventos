import React, { useState, useEffect, createElement } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Modal, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // 1. Importação do Picker
import api from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './style';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export interface Evento {
  id: number;
  nome: string; 
  descricao: string;
  data: string;
  localizacao: string;
  imagemUrl: string;
}

const formatarDataParaAPI = (data: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const ano = data.getFullYear();
    const mes = pad(data.getMonth() + 1);
    const dia = pad(data.getDate());
    const hora = pad(data.getHours());
    const minuto = pad(data.getMinutes());
    
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:00`;
  };

const formatarDataVisao = (d: Date) => {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
};

const isoParaDate = (dataIso: string) => {
  if (!dataIso) return new Date();
  try {
    const [dataPart, horaPart] = dataIso.split('T');
    const [ano, mes, dia] = dataPart.split('-');
    const [hora, min] = (horaPart || '00:00').split(':');
    return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(min));
  } catch {
    return new Date();
  }
};

export default function Home({ navigation }: Props) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  // Novos estados para gerenciar a Data e o Picker
  const [dataEvento, setDataEvento] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    buscarEventos();
  }, []);

  const buscarEventos = async () => {
    try {
      setLoadingEventos(true);
      
      const adminIdString = await AsyncStorage.getItem('@EventosBR:adminId');
      const token = await AsyncStorage.getItem('@EventosBR:token');

      console.log("TOKEN RECUPERADO DO STORAGE:", token);
      
      if (!adminIdString || !token) {
        Toast.show({
          type: 'error',
          text1: 'Sessão inválida',
          text2: 'Por favor, faça login novamente.'
        });
        setLoadingEventos(false);
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get(`/eventos/admin/${adminIdString}`);
      
      setEventos(response.data);
    } catch (error: any) {
      console.log('Erro ao buscar eventos:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Erro de conexão',
        text2: 'Não foi possível carregar seus eventos.'
      });
    } finally {
      setLoadingEventos(false);
    }
  };

  const limparCampos = () => {
    setNome('');
    setDescricao('');
    setLocalizacao('');
    setImagemUrl('');
    setDataEvento(new Date());
    setModoEdicao(false);
    setEventoSelecionadoId(null);
  };

  const handleLogout = async () => {
    // Remove o Token
    await AsyncStorage.removeItem('@EventosBR:token');
    
    // Remove o ID do Administrador
    await AsyncStorage.removeItem('@EventosBR:adminId');
    
    // Limpa o cabeçalho do Axios
    delete api.defaults.headers.common['Authorization'];

    // Manda de volta para o Login
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const abrirModalCadastro = () => {
    setModoEdicao(false);
    setEventoSelecionadoId(null);
    setNome('');
    setDescricao('');
    setDataEvento(new Date());
    setLocalizacao('');
    setImagemUrl('');
    setModalVisible(true);
  };

  const abrirModalEdicao = (evento: Evento) => {
    setModoEdicao(true);
    setEventoSelecionadoId(evento.id);
    setNome(evento.nome);
    setDescricao(evento.descricao);
    setDataEvento(isoParaDate(evento.data)); 
    setLocalizacao(evento.localizacao);
    setImagemUrl(evento.imagemUrl);
    setModalVisible(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dataEvento;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    setDataEvento(currentDate);
  };

  const abrirPicker = (mode: 'date' | 'time') => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const salvarEvento = async () => {
    if (!nome.trim() || !descricao.trim() || !localizacao.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha nome, descrição e localização.'
      });
      return;
    }

    setSalvando(true);

    try {
      // Resgata o ID do Admin salvo no momento do Login
      const adminIdString = await AsyncStorage.getItem('@EventosBR:adminId');
      
      if (!adminIdString) {
        Toast.show({ type: 'error', text1: 'Erro de Autenticação', text2: 'Faça login novamente.' });
        setSalvando(false);
        return;
      }

      const payload = {
        nome,
        descricao,
        data: formatarDataParaAPI(dataEvento), 
        localizacao,
        imagemUrl: imagemUrl || '',
        adminId: Number(adminIdString) // Envia o ID para vincular o evento
      };

      // Decide se é Criação (POST) ou Edição (PUT)
      if (modoEdicao && eventoSelecionadoId) {
        await api.put(`/eventos/${eventoSelecionadoId}`, payload);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Evento atualizado.' });
      } else {
        await api.post('/eventos', payload);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Evento criado.' });
      }

      // 5. Fecha o modal, limpa os campos e atualiza a lista
      setModalVisible(false);
      limparCampos(); 
      buscarEventos(); 
      
    } catch (error: any) {
      console.log('Erro ao salvar evento:', error.message, error.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: 'Verifique os dados e tente novamente.'
      });
    } finally {
      setSalvando(false);
    }
  };

  const renderEvento = ({ item }: { item: Evento }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagemUrl || 'https://via.placeholder.com/800x400?text=Sem+Imagem' }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.nome}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
              <Feather name="edit-2" size={20} color={colors.primary} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluirEvento(item.id)}>
              <Feather name="trash-2" size={20} color="#FF3B30" style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.infoText, { marginBottom: 10 }]} numberOfLines={2}>{item.descricao}</Text>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color={colors.textMuted} />
          {/* Mostra a data bonitinha na lista também */}
          <Text style={styles.infoText}>{formatarDataVisao(isoParaDate(item.data))}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.localizacao}</Text>
        </View>
      </View>
    </View>
  );

  const executarExclusao = async (id: number) => {
    try {
      await api.delete(`/eventos/${id}`);
      
      Toast.show({
        type: 'success',
        text1: 'Excluído!',
        text2: 'O evento foi removido com sucesso.'
      });
      
      buscarEventos();
    } catch (error: any) {
      console.log('Erro ao excluir evento:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir',
        text2: 'Não foi possível apagar o evento agora.'
      });
    }
  };

  const excluirEvento = (id: number) => {
    // Verificação de Plataforma
    if (Platform.OS === 'web') {
      const confirmacao = window.confirm("Tem certeza que deseja apagar este evento? Essa ação não pode ser desfeita.");
      if (confirmacao) {
        executarExclusao(id);
      }
    } else {
      // Usa o Alert nativo do iOS/Android
      Alert.alert(
        "Excluir Evento",
        "Tem certeza que deseja apagar este evento? Essa ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: () => executarExclusao(id) }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoTitle}>Eventos<Text style={styles.logoTitleBlue}>.BR</Text></Text>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="log-out" size={24} color={colors.textMuted} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      {loadingEventos ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={eventos}
          key={Platform.OS === 'web' ? 'web-grid' : 'mobile-list'}
          numColumns={Platform.OS === 'web' ? 3 : 1}
          columnWrapperStyle={Platform.OS === 'web' ? { gap: 20, paddingBottom: 20 } : undefined}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvento}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>
              Nenhum evento encontrado. Comece adicionando um!
            </Text>
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Seus Eventos Ativos</Text>
              <TouchableOpacity style={styles.addButton} onPress={abrirModalCadastro}>
                <Feather name="plus" size={16} color={colors.surface} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modoEdicao ? 'Editar Evento' : 'Adicionar Evento'}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x-circle" size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {modoEdicao && (
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>
                  Apenas data e localização podem ser alteradas após a criação do evento.
                </Text>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL da Imagem de Capa</Text>
                <TextInput
                  style={[styles.input, modoEdicao && styles.inputDisabled]}
                  placeholder="Ex: https://site.com/imagem.jpg"
                  placeholderTextColor={colors.placeholder}
                  value={imagemUrl}
                  onChangeText={setImagemUrl}
                  autoCapitalize="none"
                  editable={!modoEdicao}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Evento</Text>
                <TextInput
                  style={[styles.input, modoEdicao && styles.inputDisabled]}
                  placeholder="Ex: Hackathon 2026"
                  placeholderTextColor={colors.placeholder}
                  value={nome}
                  onChangeText={setNome}
                  editable={!modoEdicao}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }, modoEdicao && styles.inputDisabled]}
                  placeholder="Ex: Evento focado em..."
                  placeholderTextColor={colors.placeholder}
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline={true}
                  numberOfLines={3}
                  editable={!modoEdicao}
                />
              </View>

              {/* DatePicker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data e Hora do Evento</Text>
                
                {Platform.OS === 'web' ? (
                  createElement('input', {
                    type: 'datetime-local',
                    value: formatarDataParaAPI(dataEvento).slice(0, 16),
                    onChange: (e: any) => {
                      if (e.target.value) {
                        setDataEvento(new Date(e.target.value));
                      }
                    },
                    style: {
                      width: '100%',
                      height: '48px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border || '#ccc'}`,
                      backgroundColor: colors.surface || '#fff',
                      color: colors.textPrimary || '#333',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }
                  })
                ) : (
                  // Código Mobile (Android / iOS)
                  <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 10, justifyContent: 'center' }]} onPress={() => abrirPicker('date')}>
                        <Text style={{ color: colors.textPrimary }}>
                          {dataEvento.toLocaleDateString('pt-BR')}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={[styles.input, { flex: 1, justifyContent: 'center' }]} onPress={() => abrirPicker('time')}>
                        <Text style={{ color: colors.textPrimary }}>
                          {dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {showPicker && (
                      <DateTimePicker
                        value={dataEvento}
                        mode={pickerMode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
                  </>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Localização</Text>
                <TextInput style={styles.input} placeholder="Ex: Teatro Castro Alves" placeholderTextColor={colors.placeholder} value={localizacao} onChangeText={setLocalizacao} />
              </View>

              <TouchableOpacity style={styles.modalSaveButton} onPress={salvarEvento} disabled={salvando}>
                {salvando ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.modalSaveButtonText}>{modoEdicao ? 'Salvar Alterações' : 'Confirmar Cadastro'}</Text>}
              </TouchableOpacity>
            
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}