import React from "react";
import { CustomMarker } from "lib/types";
import { useModal } from "providers/modals";
import MarkerWithIcon from "components/MarkerWithIcon";
import { useTrip } from "providers/trip";

export default function CustomMarkerRow(marker: CustomMarker) {
  const { setSelectedMarkerId } = useTrip();
  const { name } = marker;
  const { open } = useModal();

  const handleClick = () => {
    setSelectedMarkerId(marker.id);
    open("viewMarker", { marker, onDismiss: () => setSelectedMarkerId(undefined) });
  };

  return (
    <li className={"flex items-center gap-2 text-sm cursor-pointer"} title="Click to show on map" onClick={handleClick}>
      <MarkerWithIcon showStroke={false} icon={marker.icon} className="inline-block scale-[.65] -ml-1" />
      <span className="truncate">{name}</span>
      <span className="text-gray-500 ml-auto text-xs"></span>
    </li>
  );
}
