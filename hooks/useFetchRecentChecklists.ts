import React from "react";
import { RecentChecklist } from "lib/types";
import { randomId } from "lib/helpers";
import { useQuery } from "@tanstack/react-query";

export default function useFetchRecentChecklists(region?: string, count: number = 10) {
  const { data, isLoading, error } = useQuery<RecentChecklist[]>({
    queryKey: [
      `https://api.ebird.org/v2/product/lists/${region}`,
      { maxResults: count * 2, key: process.env.NEXT_PUBLIC_EBIRD_KEY },
    ],
    enabled: !!region,
  });

  const groupedChecklists = React.useMemo(() => {
    if (!data) return [];
    const grouped = data.reduce((acc, item) => {
      const key = `${item.obsDt}-${item.obsTime || randomId(5)}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: RecentChecklist[] });
    return Object.values(grouped);
  }, [data]);

  return { checklists: data, groupedChecklists, isLoading, error };
}
