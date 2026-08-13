import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styles } from './style';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

// Dados falsos (Mock) para testar o layout antes de conectar na API
const mockEventos = [
  {
    id: '1',
    titulo: 'Festival de Primavera 2026',
    data: '14 de Setembro, 2026',
    localizacao: 'Parque Ibirapuera, São Paulo',
    imagemUrl: 'https://images.unsplash.com/photo-1533174000276-24b7a32bb4c4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    titulo: 'Copa de Surf Universitária',
    data: '15 de Novembro, 2026',
    localizacao: 'Praia Mole, Florianópolis',
    imagemUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800',
  },
];

export default function Home({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estados do formulário do Modal
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const abrirModalCadastro = () => {
    setModoEdicao(false);
    setTitulo('');
    setData('');
    setLocalizacao('');
    setImagemUrl('');
    setModalVisible(true);
  };

  const abrirModalEdicao = (evento: any) => {
    setModoEdicao(true);
    setTitulo(evento.titulo);
    setData(evento.data);
    setLocalizacao(evento.localizacao);
    setImagemUrl(evento.imagemUrl);
    setModalVisible(true);
  };

  const renderEvento = ({ item }: { item: typeof mockEventos[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
      
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
              <Feather name="edit-2" size={20} color={colors.primary} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="trash-2" size={20} color="#FF3B30" style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.data}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.localizacao}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Header Fixo */}
      <View style={styles.header}>
        <Text style={styles.logoTitle}>
          Eventos<Text style={styles.logoTitleBlue}>.BR</Text>
        </Text>
        
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Feather name="log-out" size={24} color={colors.textMuted} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Feather name="user" size={20} color={colors.surface} />
          </View>
        </View>
      </View>

      {/* Lista de Eventos */}
      <FlatList
        data={mockEventos}
        keyExtractor={(item) => item.id}
        renderItem={renderEvento}
        contentContainerStyle={styles.content}
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

      {/* Modal de Adicionar/Editar Evento */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modoEdicao ? 'Editar Evento' : 'Adicionar Evento'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x-circle" size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL da Imagem de Capa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: https://site.com/imagem.jpg"
                  placeholderTextColor={colors.placeholder}
                  value={imagemUrl}
                  onChangeText={setImagemUrl}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título do Evento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Hackathon 2026"
                  placeholderTextColor={colors.placeholder}
                  value={titulo}
                  onChangeText={setTitulo}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 18 de Outubro, 2026"
                  placeholderTextColor={colors.placeholder}
                  value={data}
                  onChangeText={setData}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Localização</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Teatro Castro Alves"
                  placeholderTextColor={colors.placeholder}
                  value={localizacao}
                  onChangeText={setLocalizacao}
                />
              </View>

              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={() => setModalVisible(false)} // Simula o salvamento e fecha o modal
              >
                <Text style={styles.modalSaveButtonText}>
                  {modoEdicao ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </Text>
              </TouchableOpacity>
            
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}