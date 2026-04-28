import { User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <User size={40} color={Colors.tertiary} strokeWidth={1.5} />
        <Text className="text-lg font-semibold text-primary">Profile</Text>
        <Text className="text-sm text-tertiary text-center">
          Coming soon — transplant profile, medications, restrictions, and care team.
        </Text>
      </View>
    </SafeAreaView>
  );
}
