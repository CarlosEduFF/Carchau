import { Modal, View, Text, Pressable } from 'react-native';
import styles from './styles';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  confirmText?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
  hideDefaultButton?: boolean; // 🔑 nova prop
}

const CustomModal = ({
  visible,
  onClose,
  message,
  confirmText = 'Entendi!',
  onConfirm,
  children,
  hideDefaultButton = false,
}: CustomModalProps) => {
  const handlePress = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children ? (
            children
          ) : (
            <>
              {message && <Text style={styles.foco}>{message}</Text>}
              {!hideDefaultButton && (
                <Pressable style={styles.modalButton} onPress={handlePress}>
                  <Text style={styles.textStyle}>{confirmText}</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
