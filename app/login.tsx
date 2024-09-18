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
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const Page = () => {
  const [countryCode, setCountryCode] = useState('+49');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  const onSignin = async (type: SignInType) => {
    if (type === SignInType.Phone) {
    } else {
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={[defaultStyles.container, { marginBottom: 20 }]}>
        <Text style={defaultStyles.header}>Welcome back</Text>

        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
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

        <View style={{ gap: 20 }}>
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              phoneNumber !== '' ? styles.enabled : styles.disabled,
            ]}
            onPress={() => onSignin(SignInType.Phone)}
          >
            <Text style={defaultStyles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View
              style={{
                flex: 1,
                height: StyleSheet.hairlineWidth,
                backgroundColor: Colors.gray,
              }}
            />
            <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
            <View
              style={{
                flex: 1,
                height: StyleSheet.hairlineWidth,
                backgroundColor: Colors.gray,
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              { flexDirection: 'row', gap: 16, backgroundColor: '#fff' },
            ]}
            onPress={() => onSignin(SignInType.Email)}
          >
            <Ionicons name="mail" size={24} color={'#000'} />
            <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
              Continue with email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              { flexDirection: 'row', gap: 16, backgroundColor: '#fff' },
            ]}
            onPress={() => onSignin(SignInType.Google)}
          >
            <Ionicons name="logo-google" size={24} color={'#000'} />
            <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
              Continue with gmail
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              { flexDirection: 'row', gap: 16, backgroundColor: '#fff' },
            ]}
            onPress={() => onSignin(SignInType.Apple)}
          >
            <Ionicons name="logo-apple" size={24} color={'#000'} />
            <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
              Continue with apple
            </Text>
          </TouchableOpacity>
        </View>
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
