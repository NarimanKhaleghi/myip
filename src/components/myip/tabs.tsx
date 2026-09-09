"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "./i18n-provider";
import { TabInfo } from "./tab-info";
import { TabGeo } from "./tab-geo";
import { TabNetwork } from "./tab-network";
import { TabSecurity } from "./tab-security";
import { TabTools } from "./tab-tools";
import type { IPInfo } from "./types";

export function InfoTabs({
  info,
  isLoading,
  userCoords,
  distanceKm,
  activeTab,
  onTabChange,
}: {
  info?: IPInfo;
  isLoading: boolean;
  userCoords?: { lat: number; lon: number } | null;
  distanceKm?: number | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const { t } = useI18n();

  const tabs = [
    { value: "info", label: t("tabInfo") },
    { value: "geo", label: t("tabGeo") },
    { value: "network", label: t("tabNetwork") },
    { value: "security", label: t("tabSecurity") },
    { value: "tools", label: t("tabTools") },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="h-auto p-1.5 bg-muted/50 border border-border/50 backdrop-blur flex-wrap justify-center h-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-xs sm:text-sm px-3 sm:px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6366F1] data-[state=active]:to-[#8B5CF6] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/25"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="info" className="mt-4 sm:mt-6 focus-visible:outline-none">
        <TabInfo info={info} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="geo" className="mt-4 sm:mt-6 focus-visible:outline-none">
        <TabGeo info={info} isLoading={isLoading} distanceKm={distanceKm} />
      </TabsContent>
      <TabsContent value="network" className="mt-4 sm:mt-6 focus-visible:outline-none">
        <TabNetwork info={info} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="security" className="mt-4 sm:mt-6 focus-visible:outline-none">
        <TabSecurity info={info} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="tools" className="mt-4 sm:mt-6 focus-visible:outline-none">
        <TabTools info={info} userCoords={userCoords} />
      </TabsContent>
    </Tabs>
  );
}
