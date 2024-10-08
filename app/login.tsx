import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const Page = () => {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  const router = useRouter();

  const { signIn } = useSignIn();

  const onSignin = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor: any = supportedFirstFactors?.find(
          (factor: any) => {
            return factor.strategy === 'phone_code';
          },
        );

        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });

        router.push({
          pathname: '/verify/[phone]',
          params: { phone: fullPhoneNumber, signin: 'true' },
        });
      } catch (err) {
        console.error('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === 'form_identifier_not_found') {
            Alert.alert('Error', err.errors[0].message);
          }
        }
      }
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
