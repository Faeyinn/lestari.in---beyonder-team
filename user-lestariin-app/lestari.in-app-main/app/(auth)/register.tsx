import { GoogleSignInButton } from '@/components/login/GoogleSignInButton';
import { LoginButton } from '@/components/login/LoginButton';
import { LoginInput } from '@/components/login/LoginInput';
import { apiService } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 160;
const LOGO_SIZE = 88;

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.signup({ name, email, password });
      Alert.alert('Success', 'Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google Sign Up logic here
    console.log('Google Sign Up pressed');
  };

  const handleLogin = () => {
    // Navigate to login screen
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with curved background */}
          <View style={styles.header}>
            <Animated.View
              entering={FadeInUp.delay(100).duration(600).springify()}
              style={styles.curvedBackground}
            />
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.logoContainer}
            >
              <View style={styles.logoCircle}>
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            <Animated.Text
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={styles.title}
            >
              Register
            </Animated.Text>

            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Nama</Text>
              <LoginInput
                placeholder="Masukkan Nama Lengkap Anda"
                value={name}
                onChangeText={setName}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(500).duration(600).springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Email</Text>
              <LoginInput
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).duration(600).springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Password</Text>
              <LoginInput
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(700).duration(600).springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Confirm Password</Text>
              <LoginInput
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(800).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <LoginButton
                title="Register"
                onPress={handleRegister}
                loading={loading}
                variant="primary"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(900).duration(600).springify()}
              style={styles.googleButtonContainer}
            >
              <GoogleSignInButton onPress={handleGoogleSignUp} signUp />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(1000).duration(600).springify()}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  curvedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 6,
    backgroundColor: '#4A7C59',
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    transform: [{ scaleX: 2 }],
  },
  logoContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT - LOGO_SIZE / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: Math.round(LOGO_SIZE * 0.55),
    height: Math.round(LOGO_SIZE * 0.55),
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: LOGO_SIZE / 2 + 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  googleButtonContainer: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 14,
    color: '#2D5F4F',
    fontWeight: '600',
  },
});