import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, type PingResponse, type HealthResponse } from "@/lib/api";
import "../global.css";

type Status = "loading" | "ok" | "error";

export default function HomeScreen() {
  const [status, setStatus] = useState<Status>("loading");
  const [ping, setPing] = useState<PingResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, h] = await Promise.all([api.ping(), api.ready()]);
        if (cancelled) return;
        setPing(p);
        setHealth(h);
        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-sage-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
      >
        <View className="pt-8 pb-12">
          <Text className="text-sage-700 text-sm font-medium tracking-wider uppercase">
            Graft
          </Text>
          <Text className="text-sage-900 mt-2 text-4xl font-bold">
            Hello.
          </Text>
          <Text className="text-sage-600 mt-3 text-base leading-relaxed">
            Nutrition and dietary management for solid organ transplant recipients.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100">
          <Text className="text-sage-500 text-xs font-medium tracking-wider uppercase mb-4">
            Backend Connection
          </Text>

          {status === "loading" && (
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color="#476847" />
              <Text className="text-sage-700">Connecting to API...</Text>
            </View>
          )}

          {status === "ok" && (
            <View className="gap-3">
              <Row label="API" value={ping?.message ?? "—"} ok />
              <Row label="Version" value={ping?.version ?? "—"} />
              <Row
                label="Database"
                value={health?.db ?? "—"}
                ok={health?.db === "ok"}
              />
            </View>
          )}

          {status === "error" && (
            <View>
              <Text className="text-red-700 font-medium mb-2">
                Could not reach API
              </Text>
              <Text className="text-red-600 text-sm font-mono">
                {error}
              </Text>
              <Text className="text-sage-600 text-xs mt-4">
                Make sure the Go API is running and EXPO_PUBLIC_API_URL is set
                to your Mac&apos;s LAN IP if testing on a physical device.
              </Text>
            </View>
          )}
        </View>

        <Text className="text-sage-400 text-xs text-center mt-auto pb-4 pt-12">
          v0.1.0 · {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-sage-600 text-sm">{label}</Text>
      <View className="flex-row items-center gap-2">
        {ok !== undefined && (
          <View
            className={`w-2 h-2 rounded-full ${
              ok ? "bg-green-500" : "bg-amber-500"
            }`}
          />
        )}
        <Text className="text-sage-900 font-medium">{value}</Text>
      </View>
    </View>
  );
}
