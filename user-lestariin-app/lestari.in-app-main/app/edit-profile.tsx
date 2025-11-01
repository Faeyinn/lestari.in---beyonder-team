import { BottomNav } from '@/components/navigation/BottomNav';
import { EditProfileHeader } from '@/components/edit-profile/EditProfileHeader';
import { FormInput } from '@/components/edit-profile/FormInput';
import { FormPicker } from '@/components/edit-profile/FormPicker';
import { ProfileAvatar } from '@/components/edit-profile/ProfileAvatar';
import { SaveButton } from '@/components/edit-profile/SaveButton';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('Pekerjaan');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Logika simpan data
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sukses', 'Profil berhasil diperbarui.');
    }, 1500);
  };

  const handlePickJob = () => {
    // Di aplikasi nyata, ini akan membuka Modal atau ActionSheet
    Alert.alert('Pilih Pekerjaan', 'Fitur ini akan segera hadir!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Melengkung */}
          <EditProfileHeader />

          {/* Konten Form */}
          <View style={styles.contentContainer}>
            {/* Avatar */}
            <ProfileAvatar />

            {/* Form */}
            <FormInput
              label="Nama"
              placeholder="Enter your Name"
              value={name}
              onChangeText={setName}
              animationDelay={300}
            />
            <FormPicker
              label="Pekerjaan"
              value={job}
              onPress={handlePickJob}
              animationDelay={400}
            />
            <FormInput
              label="No.HP"
              placeholder="Masukkan No. HP"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              animationDelay={500}
            />

            {/* Tombol Simpan */}
            <View style={styles.buttonWrapper}>
              <SaveButton
                title="Simpan"
                onPress={handleSave}
                loading={loading}
                animationDelay={600}
              />
            </View>
          </View>
        </ScrollView>

        {/* Navigasi Bawah */}
        <BottomNav activeRoute="profile" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Latar belakang abu-abu muda
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Ruang untuk BottomNav
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  buttonWrapper: {
    marginTop: 16,
  },
});