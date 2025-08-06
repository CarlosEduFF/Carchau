import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  message,
  confirmText = 'Entendi!',
  onConfirm,
  children,
}) => {
  const handlePress = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children ? (
            children
          ) : (
            <Text style={styles.foco}>{message}</Text>
          )}
          <Pressable
            style={styles.modalButton}
            onPress={handlePress}
          >
            <Text style={styles.textStyle}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  foco: {
    color: '#f2a51a',
    fontSize: 15,
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#f2a51a',
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
});
