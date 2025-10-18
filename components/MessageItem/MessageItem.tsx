import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import images from '~/constants/images';
import { Message } from '~/types/';
import styles from './styles';

interface MessageItemProps {
  item: Message;
  userId: string | undefined;
  UserImage?: string | null;
  perfilImage?: string | null;
}

 const MessageItem: React.FC<MessageItemProps> = ({ item, userId, UserImage, perfilImage }) => {
  const isMyMessage = item.user._id === userId;

  return (
    <View style={isMyMessage ? styles.myMessageContainer : styles.messageContainer}>
      {isMyMessage ? (
        <View style={styles.myMessageContent}>
          <View style={styles.messageTextContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
          <Image
            style={styles.userIcon}
            source={UserImage ? { uri: UserImage } : images.defaultProfileImage}
          />
        </View>
      ) : (
        <View style={styles.messageContent}>
          <Image
            style={styles.userIcon}
            source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage}
          />
          <View style={styles.messageTextContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MessageItem;