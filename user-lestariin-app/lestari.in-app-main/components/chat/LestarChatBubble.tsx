import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LestarChatBubbleProps {
  message: string;
  isBot: boolean;
  index: number;
}

const botIcon = require('@/assets/images/icon.png');

export const LestarChatBubble: React.FC<LestarChatBubbleProps> = ({
  message,
  isBot,
  index,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      style={[styles.container, !isBot && styles.userContainer]}
    >
      {isBot && (
        <View style={styles.botAvatarContainer}>
          <View style={styles.botAvatar}>
            <Image source={botIcon} style={styles.botAvatarImage} resizeMode="contain" />
          </View>
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {message}
          </Text>
        </View>

        {/* secondary bubble removed for bot per request.
            Keep secondary bubble only for user messages if needed */}
        {!isBot && (
          <View style={[styles.secondaryBubble, styles.userSecondaryBubble]} />
        )}
      </View>

      {!isBot && (
        <View style={styles.userAvatarContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botAvatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  botAvatarImage: {
    width: 28,
    height: 28,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  userAvatarContainer: {
    marginLeft: 8,
    marginTop: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 16,
  },
  bubbleWrapper: {
    flex: 1,
    maxWidth: '75%',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#4A9D6F',
    borderTopLeftRadius: 4,
  },
  // user bubble changed to bright green
  userBubble: {
    backgroundColor: '#34D399', // terang green
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  secondaryBubble: {
    height: 28,
    marginTop: 4,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // keep user secondary bubble subtle (optional)
  userSecondaryBubble: {
    backgroundColor: '#CFFAE6',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  // make user text white for contrast with bright green
  userText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
});