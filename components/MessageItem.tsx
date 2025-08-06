import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import images from '~/constants/images';
import { Message } from '~/types/Message';

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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#022036',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginVertical: 5,
    },
    messageContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    myMessageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    messageTextContainer: {
        maxWidth: '80%',
        backgroundColor: '#f0f0f0',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
    },
    messageText: {
        fontSize: 16,
    },
    messageAndImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    userIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        margin: 10,
    },
});


export default MessageItem;
