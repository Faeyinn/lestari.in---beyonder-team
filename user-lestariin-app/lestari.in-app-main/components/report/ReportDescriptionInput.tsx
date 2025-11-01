import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface ReportDescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const ReportDescriptionInput: React.FC<ReportDescriptionInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Masukkan deskripsi atau pesan yang ingin anda sampaikan',
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top" // Untuk Android
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 180, // Tinggi minimal text area
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
});