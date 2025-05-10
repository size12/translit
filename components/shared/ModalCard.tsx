import { Modal, Pressable, View } from 'react-native';
import React from 'react';

export interface ModalProps {
  children: React.ReactNode;
  isVisible: boolean;
  hideModal: () => void;
}

export default function ModalCard({
  children,
  isVisible,
  hideModal,
}: ModalProps) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={hideModal}
      >
        <Pressable style={{ flex: 1, opacity: 1 }} onPressIn={hideModal} />
        {children}
      </Modal>
    </View>
  );
}
