import { Trip, Target } from "lib/types";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { uploadFile } from "lib/firebase";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novermber",
  "December",
];

export const englishCountries = [
  "US",
  "CA",
  "AU",
  "GB",
  "NZ",
  "IE",
  "GH",
  "SG",
  "BZ",
  "ZA",
  "IN",
  "DM",
  "MT",
  "AG",
  "KE",
  "JM",
  "GD",
  "GY",
  "BW",
  "LR",
  "BB",
  "CM",
  "NG",
  "GM",
  "TT",
  "BS",
];

export const isRegionEnglish = (region: string) => {
  const regionCode = region.split(",")[0];
  return englishCountries.includes(regionCode);
};

export function truncate(string: string, length: number): string {
  return string.length > length ? `${string.substring(0, length)}...` : string;
}

// Adapted from https://www.geodatasource.com/developers/javascript
export function distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number, metric = true): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (metric) {
      dist = dist * 1.609344;
    }
    return parseFloat(dist.toFixed(2));
  }
}

export const markerColors = [
  "#bcbcbc",
  "#8f9ca0",
  "#9bc4cf",
  "#aaddeb",
  "#c7e466",
  "#eaeb1f",
  "#fac500",
  "#e57701",
  "#ce0d02",
  "#ad0002",
];

export const getMarkerColor = (count: number) => {
  if (count === 0) return markerColors[0];
  if (count <= 15) return markerColors[1];
  if (count <= 50) return markerColors[2];
  if (count <= 100) return markerColors[3];
  if (count <= 150) return markerColors[4];
  if (count <= 200) return markerColors[5];
  if (count <= 250) return markerColors[6];
  if (count <= 300) return markerColors[7];
  if (count <= 400) return markerColors[8];
  if (count <= 500) return markerColors[9];
  return markerColors[0];
};

export const getMarkerColorIndex = (count: number) => {
  const color = getMarkerColor(count);
  return markerColors.indexOf(color);
};

export const radiusOptions = [
  { label: "20 mi", value: 20 },
  { label: "50 mi", value: 50 },
  { label: "100 mi", value: 100 },
  { label: "200 mi", value: 200 },
  { label: "300 mi", value: 300 },
  { label: "400 mi", value: 400 },
  { label: "500 mi", value: 500 },
];

export const getBounds = async (regionString: string) => {
  try {
    const regions = regionString.split(",");
    const boundsPromises = regions.map((region) =>
      fetch(`https://api.ebird.org/v2/ref/region/info/${region}?key=${process.env.NEXT_PUBLIC_EBIRD_KEY}`).then((res) =>
        res.json()
      )
    );
    const boundsResults = await Promise.all(boundsPromises);
    const combinedBounds = boundsResults.reduce(
      (acc, bounds) => {
        return {
          minX: Math.min(acc.minX, bounds.bounds.minX),
          maxX: Math.max(acc.maxX, bounds.bounds.maxX),
          minY: Math.min(acc.minY, bounds.bounds.minY),
          maxY: Math.max(acc.maxY, bounds.bounds.maxY),
        };
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
    return combinedBounds;
  } catch (error) {
    toast.error("Error getting region info");
    return null;
  }
};

export const getCenterOfBounds = ({ minX, minY, maxX, maxY }: Trip["bounds"]) => {
  const lat = (minY + maxY) / 2;
  const lng = (minX + maxX) / 2;
  return { lat, lng };
};

export const getLatLngFromBounds = (bounds?: Trip["bounds"]) => {
  if (!bounds) return { lat: null, lng: null };
  const { minX, minY, maxX, maxY } = bounds;
  const lat = (minY + maxY) / 2;
  const lng = (minX + maxX) / 2;
  return { lat, lng };
};

export const randomId = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const translate = async (string: string) => {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: string }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (!json.text) throw new Error();
    return json.text;
  } catch (error) {
    toast.error("Error translating");
    return string;
  }
};

export const getTzFromLatLng = async (lat: number, lng: number) => {
  try {
    const res = await fetch(`/api/get-tz?lat=${lat}&lng=${lng}`);
    const json = await res.json();
    if (!json.timezone) throw new Error();
    return json.timezone;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const dateTimeToRelative = (date: string, timezone?: string) => {
  if (!timezone || !date) return "";
  const today = dayjs().tz(timezone).format("YYYY-MM-DD");
  const yesterday = dayjs().tz(timezone).subtract(1, "day").format("YYYY-MM-DD");
  const dateFormatted = dayjs(date).tz(timezone).format("YYYY-MM-DD");
  if (dateFormatted === today) return "Today";
  if (dateFormatted === yesterday) return "Yesterday";
  const result = dayjs.tz(date, timezone).fromNow().replace(" ago", "").replace("an ", "1 ").replace("a ", "1 ");

  return result;
};

type Params = {
  [key: string]: string | number | boolean;
};

export const get = async (url: string, params: Params, showLoading?: boolean) => {
  const cleanParams = Object.keys(params).reduce((accumulator: any, key) => {
    if (params[key]) accumulator[key] = params[key];
    return accumulator;
  }, {});

  const queryParams = new URLSearchParams(cleanParams).toString();

  if (showLoading) toast.loading("Loading...", { id: url });
  const res = await fetch(`${url}?${queryParams}`, {
    method: "GET",
  });
  if (showLoading) toast.dismiss(url);

  let json: any = {};

  try {
    json = await res.json();
  } catch (error) {}
  if (!res.ok) {
    if (res.status === 404) throw new Error("Route not found");
    if (res.status === 405) throw new Error("Method not allowed");
    if (res.status === 504) throw new Error("Operation timed out. Please try again.");
    throw new Error(json.message || "An error ocurred");
  }
  return json;
};

export const uploadMapboxImg = async (bounds: Trip["bounds"]) => {
  const id = uuidv4();
  const res = await fetch(
    `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/[${bounds?.minX},${bounds?.minY},${bounds?.maxX},${bounds?.maxY}]/300x185@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}&padding=30`
  );
  const blob = await res.blob();
  const file = new File([blob], `${id}.png`, { type: "image/png" });
  const url = await uploadFile(file);
  return url;
};

const getDataInRange = (data: number[], start: number, end: number) => {
  if (start <= end) return data.slice(start - 1, end);
  return [...data.slice(0, end), ...data.slice(start - 1)];
};

type ParseTargetProps = {
  file: File;
  startMonth?: number;
  endMonth?: number;
  cutoff?: string;
};

type ParseTargetResponse = {
  items: Target[];
  N: number;
  yrN: number;
};

export const parseTargets = async ({
  file,
  startMonth = 1,
  endMonth = 12,
  cutoff,
}: ParseTargetProps): Promise<ParseTargetResponse> => {
  return new Promise((resolve, reject) => {
    try {
      Papa.parse(file, {
        header: true,
        delimiter: "\t",
        complete: async function (results: any) {
          const startWeek = startMonth * 4 - 3;
          const endWeek = endMonth * 4;
          const data = results.data.filter((it: any) => it[""] !== "");
          const sampleSizes = data[2].__parsed_extra.slice(0, 48).map((it: string) => Number(it));
          const sampleSizesInRange = getDataInRange(sampleSizes, startWeek, endWeek);
          const N = sampleSizesInRange.reduce((acc, it) => acc + it, 0);
          const yrN = sampleSizes.reduce((acc: number, it: number) => acc + it, 0);
          const species = data.slice(3).map((it: any) => {
            const name = it[""].split(" (")[0];
            const counts = it.__parsed_extra.slice(0, 48).map((it: string, i: number) => sampleSizes[i] * Number(it));
            const countsInRange = getDataInRange(counts, startWeek, endWeek);
            const sumCountsInRange = countsInRange.reduce((acc, it) => acc + it, 0);
            const sumCountsYr = counts.reduce((acc: number, it: number) => acc + it, 0);
            const percent = (sumCountsInRange / N) * 100;
            const percentYr = (sumCountsYr / yrN) * 100;
            const rounded =
              percent >= 1
                ? Math.round(percent)
                : percent >= 0.1
                ? Math.round(percent * 10) / 10
                : Math.round(percent * 100) / 100;

            const roundedYr =
              percentYr >= 1
                ? Math.round(percentYr)
                : percentYr >= 0.1
                ? Math.round(percentYr * 10) / 10
                : Math.round(percentYr * 100) / 100;

            return { name, percent: rounded, percentYr: roundedYr };
          });

          const sorted = species.sort((a: Target, b: Target) => b.percent - a.percent);

          const filtered = cutoff
            ? // Providing cutoff only applies to trip months percent (used for regions)
              sorted.filter((it: Target) => it.percent >= Number(cutoff.replace("%", "")))
            : sorted.filter((it: Target) => it.percent >= 5 || it.percentYr >= 5);

          // Fetch to species codes
          const res = await fetch("/api/com-name-codes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(filtered),
          });
          const withCodes = await res.json();
          resolve({
            items: withCodes,
            N,
            yrN,
          });
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

//https://decipher.dev/30-seconds-of-typescript/docs/debounce/
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
