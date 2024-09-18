import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';

const Page = () => {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  const router = useRouter();

  const { signUp } = useSignUp();

  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      });

      signUp!.preparePhoneNumberVerification();

      router.push({
        pathname: '/verify/[phone]',
        params: { phone: fullPhoneNumber },
      });
    } catch (err) {
      console.error('Error signing up', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={[defaultStyles.container, { marginBottom: 20 }]}>
        <Text style={defaultStyles.header}>Let's get started</Text>

        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there.
        </Text>

        <View style={{ flex: 1 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { minWidth: 80 }]}
              placeholder="+49"
              placeholderTextColor={Colors.gray}
              value={countryCode}
              onChangeText={(newText) => {
                if (newText === '+') {
                  setCountryCode('');
                } else if (newText.length > 1) {
                  setCountryCode(newText);
                } else {
                  setCountryCode(`+${newText}`);
                }
              }}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Mobile number"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Link href={'/login'} replace asChild>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>
                Already have any account? Log in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
          ]}
          onPress={onSignup}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Page;
