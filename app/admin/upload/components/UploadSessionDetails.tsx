// components/shared/UploadSessionDetails.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type Props = {
  prefecture: string;
  setPrefecture: (val: string) => void;
  area: string;
  setArea: (val: string) => void;
  surfSpot: string;
  setSurfSpot: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  sessionTime: string;
  setSessionTime: (val: string) => void;
  disabled: boolean;
  formErrors: Record<string, string>;
};

export default function UploadSessionDetails({
  prefecture,
  setPrefecture,
  area,
  setArea,
  surfSpot,
  setSurfSpot,
  date,
  setDate,
  sessionTime,
  setSessionTime,
  disabled,
  formErrors,
}: Props) {
  const [startRaw = "", endRaw = ""] = sessionTime?.split(" - ") ?? [];
  const [startHour = "", startMinute = ""] = startRaw.split(":");
  const [endHour = "", endMinute = ""] = endRaw.split(":");

  const handleTimeChange = (
    type: "start" | "end",
    part: "hour" | "minute",
    value: string
  ) => {
    let sH = startHour || "00";
    let sM = startMinute || "00";
    let eH = endHour || "00";
    let eM = endMinute || "00";

    if (type === "start") {
      if (part === "hour") sH = value;
      if (part === "minute") sM = value;
    } else {
      if (part === "hour") eH = value;
      if (part === "minute") eM = value;
    }

    const formattedStart = `${sH.padStart(2, "0")}:${sM.padStart(2, "0")}`;
    const formattedEnd = `${eH.padStart(2, "0")}:${eM.padStart(2, "0")}`;
    setSessionTime(`${formattedStart} - ${formattedEnd}`);
  };

  const renderTimeSelect = (
    value: string,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    range: number
  ) => (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="border rounded p-1"
    >
      {[...Array(range).keys()].map((n) => {
        const val = n.toString().padStart(2, "0");
        return (
          <option key={val} value={val}>
            {val}
          </option>
        );
      })}
    </select>
  );

  return (
    <>
      {[
        {
          id: "prefecture",
          label: "都道府県",
          val: prefecture,
          set: setPrefecture,
          placeholder: "e.g. 千葉",
        },
        {
          id: "area",
          label: "エリア",
          val: area,
          set: setArea,
          placeholder: "e.g. 千葉北",
        },
        {
          id: "surfSpot",
          label: "サーフスポット",
          val: surfSpot,
          set: setSurfSpot,
          placeholder: "e.g. 一宮海岸",
        },
      ].map(({ id, label, val, set, placeholder }) => (
        <div key={id}>
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            value={val}
            onChange={(e) => set(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          {formErrors[id] && (
            <p className="text-sm text-red-500 mt-1">{formErrors[id]}</p>
          )}
        </div>
      ))}

      <div>
        <Label htmlFor="date">日にち</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={disabled}
        />
        {formErrors.date && (
          <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>
        )}
      </div>

      <div>
        <Label>セッション時間</Label>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Start Time */}
          <div className="flex items-center gap-1">
            {renderTimeSelect(
              startHour,
              (e) => handleTimeChange("start", "hour", e.target.value),
              24
            )}
            :
            {renderTimeSelect(
              startMinute,
              (e) => handleTimeChange("start", "minute", e.target.value),
              60
            )}
          </div>

          <span className="text-gray-500">〜</span>

          {/* End Time */}
          <div className="flex items-center gap-1">
            {renderTimeSelect(
              endHour,
              (e) => handleTimeChange("end", "hour", e.target.value),
              24
            )}
            :
            {renderTimeSelect(
              endMinute,
              (e) => handleTimeChange("end", "minute", e.target.value),
              60
            )}
          </div>
        </div>
        {formErrors.sessionTime && (
          <p className="text-sm text-red-500 mt-1">{formErrors.sessionTime}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          ※ 時刻は24時間表記（例：14:00 〜 16:30）
        </p>
      </div>
    </>
  );
}
