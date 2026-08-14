import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Cabeçalho
  header: {
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Espaço para a barra de status do celular
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  logoTitleBlue: {
    color: colors.primary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 10,
    display: 'none', 
  },
  // Corpo da página
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // Card de Evento
  card: {
    flex: Platform.OS === 'web' ? 1 : 0, 
    minWidth: Platform.OS === 'web' ? 280 : '100%', 
    maxWidth: Platform.OS === 'web' ? 400 : '100%', 
    aspectRatio: Platform.OS === 'web' ? 1 : undefined, 
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: Platform.OS === 'web' ? 0 : 20, 
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    flex: Platform.OS === 'web' ? 1 : 0,
    height: Platform.OS === 'web' ? undefined : 200, 
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 15,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 8,
  },
  // Modal de Adicionar Evento
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textSecondary,
  },
    inputDisabled: {
    backgroundColor: colors.disabledBackground || '#f0f0f0',
    color: colors.textMuted,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});