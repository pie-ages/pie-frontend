import { Modal, Pressable, Text, View } from 'react-native';

import { ProductActionButton } from '@/components/ProductActionButton';

import { styles } from './styles';

type ProfileSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export function ProfileSheet({ visible, onClose, onSignOut }: ProfileSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.grabber} />

          <Text style={styles.title}>Perfil</Text>

          <ProductActionButton title="Sair" onPress={onSignOut} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
