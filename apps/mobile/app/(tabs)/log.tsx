import { BookOpen } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

export default function LogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <BookOpen size={40} color={Colors.tertiary} strokeWidth={1.5} />
        <Text className="text-lg font-semibold text-primary">Food Log</Text>
        <Text className="text-sm text-tertiary text-center">
          Coming in the next stage — track daily meals and see running nutrient totals.
        </Text>
      </View>
    </SafeAreaView>
  );
}
