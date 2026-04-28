import { format, differenceInDays } from 'date-fns';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SemiCircleGauge } from '@/components/gauge';
import { Colors } from '@/constants/colors';

// ── stub data (will come from API once auth exists) ──────────────────────────
const TRANSPLANT_DATE = new Date('2025-10-01');
const USER_NAME = 'Cristian';

// Today's nutrient snapshot — profile-driven in production
const NUTRIENTS = [
  { label: 'Potassium', used: 1240, limit: 2000, unit: 'mg' },
  { label: 'Sodium',    used: 940,  limit: 2000, unit: 'mg' },
  { label: 'Fluid',     used: 1.2,  limit: 2.0,  unit: 'L'  },
];

const LAST_MEAL  = { name: 'Oatmeal with blueberries', time: '8:24 AM' };
const NEXT_MED   = { name: 'Tacrolimus 2mg', time: '8:00 PM' };
// ─────────────────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function DateStrip() {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2].map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return { offset, d };
  });

  return (
    <View className="flex-row justify-center gap-2 px-6 mt-5">
      {days.map(({ offset, d }) => {
        const isToday = offset === 0;
        return (
          <TouchableOpacity
            key={offset}
            className={`items-center rounded-xl py-2 px-3 ${isToday ? 'bg-brand' : 'bg-card border border-sage-100'}`}
            activeOpacity={0.7}>
            <Text
              className={`text-[11px] font-semibold uppercase tracking-wider ${isToday ? 'text-white' : 'text-tertiary'}`}>
              {format(d, 'EEE')}
            </Text>
            <Text
              className={`text-base font-bold mt-0.5 ${isToday ? 'text-white' : 'text-primary'}`}>
              {format(d, 'd')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function StatBlock({ label, used, limit, unit }: (typeof NUTRIENTS)[number]) {
  const pct = Math.round((used / limit) * 100);
  const isHigh = pct >= 80;
  return (
    <View className="flex-1 bg-card rounded-2xl p-4 border border-sage-100">
      <Text className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">
        {label}
      </Text>
      <Text className={`text-lg font-bold mt-1 ${isHigh ? 'text-caution' : 'text-primary'}`}>
        {used}
        <Text className="text-xs font-normal text-tertiary"> {unit}</Text>
      </Text>
      <View className="h-1.5 bg-sage-100 rounded-full mt-2 overflow-hidden">
        <View
          className={`h-full rounded-full ${isHigh ? 'bg-caution' : 'bg-brand'}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </View>
      <Text className="text-[11px] text-tertiary mt-1">{pct}% used</Text>
    </View>
  );
}

export default function TodayScreen() {
  const dayCount = useMemo(
    () => differenceInDays(new Date(), TRANSPLANT_DATE),
    [],
  );

  // Tightest restriction determines the gauge (lowest headroom)
  const tightest = NUTRIENTS.reduce((a, b) =>
    a.used / a.limit > b.used / b.limit ? a : b,
  );
  const gaugePct = Math.round((tightest.used / tightest.limit) * 100);

  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="px-6 pt-6">
          <Text className="text-3xl font-bold text-primary">
            {greeting()}, {USER_NAME}
          </Text>
          <Text className="text-sm text-tertiary mt-1">
            Day {dayCount} post-transplant · {format(new Date(), 'MMMM d')}
          </Text>
        </View>

        {/* Date strip */}
        <DateStrip />

        {/* Today's status card */}
        <View className="mx-6 mt-4 bg-card rounded-2xl border border-sage-100 py-6 items-center">
          <Text className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-4">
            Today's budget
          </Text>
          <SemiCircleGauge
            percentage={gaugePct}
            label={tightest.label}
            sublabel={`${tightest.used} / ${tightest.limit} ${tightest.unit}`}
          />
          <View className="flex-row gap-3 px-4 mt-5 w-full">
            {NUTRIENTS.map(n => (
              <StatBlock key={n.label} {...n} />
            ))}
          </View>
        </View>

        {/* Last meal / Next medication */}
        <View className="flex-row mx-6 mt-4 gap-3">
          <View className="flex-1 bg-sage-100 rounded-2xl p-4">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Last logged
            </Text>
            <Text className="text-base font-semibold text-primary mt-1" numberOfLines={2}>
              {LAST_MEAL.name}
            </Text>
            <Text className="text-xs text-tertiary mt-1">{LAST_MEAL.time}</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: '#FFF8ED' }}>
            <Text
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: '#B8882A' }}>
              Next med
            </Text>
            <Text className="text-base font-semibold text-primary mt-1" numberOfLines={2}>
              {NEXT_MED.name}
            </Text>
            <Text className="text-xs text-tertiary mt-1">{NEXT_MED.time}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
