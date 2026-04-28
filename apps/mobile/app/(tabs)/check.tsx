import { AlertCircle, CheckCircle, Clock, Lock, Mic, ScanLine, Search, XCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, verdictColor, verdictLabel } from '@/constants/colors';
import { api, CheckFoodResponse, FoodReason, FoodSearchResult } from '@/lib/api';

// ── stub recent checks (will come from a logged-in user's history) ────────────
type RecentCheck = { name: string; verdict: 'avoid' | 'caution' | 'ok'; checkedAt: string };
const RECENT_CHECKS: RecentCheck[] = [
  { name: 'Grapefruit',  verdict: 'avoid',   checkedAt: 'Yesterday' },
  { name: 'Banana',      verdict: 'caution',  checkedAt: 'Yesterday' },
  { name: 'Blueberry',   verdict: 'ok',       checkedAt: '2 days ago' },
  { name: 'Oatmeal',     verdict: 'ok',       checkedAt: '3 days ago' },
];

// Suggested foods for the empty-state demo
const SUGGESTIONS = ['Apple', 'Grapefruit', 'Banana'];

// ── verdict pill ──────────────────────────────────────────────────────────────
function VerdictPill({ verdict }: { verdict: 'avoid' | 'caution' | 'ok' }) {
  const color = verdictColor[verdict];
  const label = verdictLabel[verdict];
  const Icon = verdict === 'avoid' ? XCircle : verdict === 'caution' ? AlertCircle : CheckCircle;
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${color}18` }}>
      <Icon size={12} color={color} strokeWidth={2.5} />
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

// ── reason card inside the verdict sheet ─────────────────────────────────────
function ReasonCard({ reason }: { reason: FoodReason }) {
  const color = verdictColor[reason.verdict];
  const Icon = reason.verdict === 'avoid' ? XCircle : reason.verdict === 'caution' ? AlertCircle : CheckCircle;
  return (
    <View className="bg-page rounded-2xl p-4 gap-2 border border-sage-100">
      <View className="flex-row items-center gap-2">
        <Icon size={18} color={color} strokeWidth={2} />
        <Text className="font-semibold text-primary flex-1" numberOfLines={1}>
          {reason.trigger_type === 'medication' ? '💊 ' : '⚠️ '}
          {reason.trigger_name}
        </Text>
        <VerdictPill verdict={reason.verdict} />
      </View>
      <Text className="text-sm text-secondary leading-5">{reason.reason}</Text>
      {reason.source && (
        <Text className="text-xs text-tertiary italic">{reason.source}</Text>
      )}
    </View>
  );
}

// ── locked action tile (PRO features) ────────────────────────────────────────
function ProTile({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity
      className="flex-1 bg-card border border-sage-100 rounded-2xl py-4 items-center gap-2"
      activeOpacity={0.7}>
      {icon}
      <Text className="text-xs font-semibold text-secondary">{label}</Text>
      <View className="flex-row items-center gap-1 bg-ai/10 rounded-full px-2 py-0.5">
        <Lock size={9} color={Colors.ai} strokeWidth={2.5} />
        <Text className="text-[10px] font-bold" style={{ color: Colors.ai }}>PRO</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── verdict bottom sheet ──────────────────────────────────────────────────────
function VerdictSheet({
  visible,
  result,
  onClose,
}: {
  visible: boolean;
  result: CheckFoodResponse | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (!result) return null;

  const color  = verdictColor[result.verdict];
  const label  = verdictLabel[result.verdict];
  const Icon   = result.verdict === 'avoid' ? XCircle : result.verdict === 'caution' ? AlertCircle : CheckCircle;
  const summary =
    result.verdict === 'avoid'
      ? `Do not eat — ${result.reasons[0]?.trigger_name ?? 'see details below'}`
      : result.verdict === 'caution'
      ? 'Use caution — limit your portion'
      : 'Safe to eat';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-card" edges={['top', 'bottom']}>
        {/* drag handle */}
        <View className="items-center pt-3 pb-2">
          <View className="w-9 h-1 rounded-full bg-sage-200" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}>

          {/* Food name */}
          <Text className="text-2xl font-bold text-primary">{result.food}</Text>

          {/* Verdict card */}
          <View
            className="rounded-2xl p-5 mt-4 items-center gap-2"
            style={{ backgroundColor: `${color}12` }}>
            <Icon size={36} color={color} strokeWidth={2} />
            <Text className="text-2xl font-bold" style={{ color }}>{label.toUpperCase()}</Text>
            <Text className="text-sm text-center" style={{ color }}>{summary}</Text>
          </View>

          {/* Reasons */}
          {result.reasons.length > 0 && (
            <View className="mt-6 gap-3">
              <Text className="text-base font-semibold text-primary">
                {result.verdict === 'ok' ? 'Notes' : result.verdict === 'avoid' ? 'Why not' : 'Why caution'}
              </Text>
              {result.reasons.map((r, i) => (
                <ReasonCard key={i} reason={r} />
              ))}
            </View>
          )}

          {result.reasons.length === 0 && (
            <View className="mt-6 bg-page rounded-2xl p-4 border border-sage-100">
              <Text className="text-sm text-tertiary">
                No known interactions with your current profile.
              </Text>
            </View>
          )}

          {!result.personalized && (
            <Text className="text-xs text-tertiary mt-4 text-center">
              Add your medications and restrictions in Profile for personalised results.
            </Text>
          )}
        </ScrollView>

        {/* Action buttons */}
        <View
          className="flex-row px-6 gap-3 border-t border-sage-100 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          {result.verdict !== 'avoid' && (
            <TouchableOpacity className="flex-1 bg-brand rounded-xl py-3.5 items-center">
              <Text className="text-white font-semibold">Log it</Text>
            </TouchableOpacity>
          )}
          {result.verdict === 'avoid' && (
            <TouchableOpacity className="flex-1 bg-page border border-sage-200 rounded-xl py-3.5 items-center">
              <Text className="text-secondary font-semibold">Log anyway</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-page border border-sage-200 rounded-xl py-3.5 items-center">
            <Text className="text-secondary font-semibold">Dismiss</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// ── main screen ───────────────────────────────────────────────────────────────
export default function CheckScreen() {
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState<FoodSearchResult[]>([]);
  const [searching, setSearching]   = useState(false);
  const [checking, setChecking]     = useState(false);
  const [verdict, setVerdict]       = useState<CheckFoodResponse | null>(null);
  const [sheetVisible, setSheet]    = useState(false);
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try { setResults(await api.foods.search(q)); }
      catch { setResults([]); }
      finally { setSearching(false); }
    }, 280);
  }, []);

  useEffect(() => { search(query); }, [query, search]);

  const handleSelect = useCallback(async (name: string) => {
    setQuery('');
    setResults([]);
    setChecking(true);
    try {
      const res = await api.foods.check(name);
      setVerdict(res);
      setSheet(true);
    } catch {
      // swallow — TODO: surface error state
    } finally {
      setChecking(false);
    }
  }, []);

  const showResults = results.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-primary">Check a food</Text>
        </View>

        {/* Search input */}
        <View className="mx-6 relative">
          <View className="flex-row items-center bg-card border border-sage-100 rounded-xl px-4 gap-3">
            {checking
              ? <ActivityIndicator size="small" color={Colors.brand} />
              : <Search size={20} color={Colors.tertiary} strokeWidth={2} />}
            <TextInput
              className="flex-1 py-3.5 text-base text-primary"
              placeholder="Search a food..."
              placeholderTextColor={Colors.tertiary}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            <TouchableOpacity>
              <Mic size={20} color={Colors.tertiary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Search results dropdown */}
          {(showResults || searching) && (
            <View className="absolute top-14 left-0 right-0 bg-card rounded-2xl border border-sage-100 shadow-sm z-10 overflow-hidden">
              {searching && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color={Colors.brand} />
                </View>
              )}
              {results.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelect(item.name)}
                  className="flex-row items-center px-4 py-3 border-b border-sage-50 active:bg-page">
                  <Text className="flex-1 text-base text-primary">{item.name}</Text>
                  <Text className="text-xs text-tertiary capitalize">{item.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* PRO action tiles */}
        <View className="flex-row mx-6 mt-4 gap-3">
          <ProTile icon={<ScanLine size={22} color={Colors.tertiary} strokeWidth={2} />} label="Scan menu" />
          <ProTile icon={<ScanLine size={22} color={Colors.tertiary} strokeWidth={2} />} label="Scan label" />
        </View>

        {/* Recent checks */}
        <View className="mt-6 px-6">
          {RECENT_CHECKS.length > 0 ? (
            <>
              <Text className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-3">
                Recent checks
              </Text>
              {RECENT_CHECKS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelect(item.name)}
                  className="flex-row items-center bg-card rounded-2xl px-4 py-3.5 mb-2 border border-sage-100"
                  activeOpacity={0.7}>
                  <Clock size={16} color={Colors.tertiary} strokeWidth={2} style={{ marginRight: 12 }} />
                  <Text className="flex-1 text-base text-primary">{item.name}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-tertiary">{item.checkedAt}</Text>
                    <VerdictPill verdict={item.verdict} />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            /* Empty state */
            <View className="items-center gap-4 pt-8">
              <Text className="text-tertiary text-sm text-center">
                Search a food above to check if it's safe for you.
              </Text>
              <Text className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                Try these
              </Text>
              <View className="flex-row gap-2">
                {SUGGESTIONS.map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => handleSelect(s)}
                    className="bg-card border border-sage-100 rounded-full px-4 py-2">
                    <Text className="text-sm text-secondary font-medium">{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      <VerdictSheet
        visible={sheetVisible}
        result={verdict}
        onClose={() => setSheet(false)}
      />
    </SafeAreaView>
  );
}
