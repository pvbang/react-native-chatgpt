import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, Image } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import styles from './styles';

const logo = require('../images/logo.png');

const API_URL = 'https://api.openai.com/v1/completions';
const YOUR_API_KEY = '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';
const MAX_TOKENS = 1000;

export default function MainScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firstMessage();
  }, []);

  const firstMessage = () => {
    setMessages([
      {
        _id: 1,
        text: 'Xin chào! Tôi có thể giúp gì cho bạn.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT by PV Bang',
          avatar: logo,
        },
      },
    ]);
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const value = messages[0].text;
    callApi(value);
  }, []);

  const callApi = async value => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${YOUR_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: value,
        max_tokens: MAX_TOKENS,
        temperature: 0,
      }),
    });

    const data = await res.json();
    if (data) {
      const value = data?.choices[0]?.text.trimStart();
      console.log(value);
      addNewMessage(value);
    }
  };

  const addNewMessage = data => {
    const value = {
      _id: Math.random(999999999),
      text: data,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'ChatGPT',
        avatar: logo,
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, value));
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        renderSend={(props) => {
          return (
            <Send {...props}>
              <View style={styles.sendView}>
                <Image source={require('../images/send.png')} resizeMode={'center'} />
              </View>
            </Send>
          );
        }}
        messages={messages}
        placeholder='Nhập câu hỏi của bạn...'
        dateFormat='DD/MM/YYYY'
        textInputStyle={styles.textInputStyle}
        // renderUsernameOnMessage = {true}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
}