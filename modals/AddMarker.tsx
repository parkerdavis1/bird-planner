import React from "react";
import { Header, Body } from "providers/modals";
import Button from "components/Button";
import Field from "components/Field";
import Input from "components/Input";
import { useModal } from "providers/modals";
import { useTrip } from "providers/trip";
import { randomId } from "lib/helpers";
import { MarkerIcon } from "lib/types";
import MarkerWithIcon from "components/MarkerWithIcon";
import clsx from "clsx";
import toast from "react-hot-toast";

type Props = {
  lat: number;
  lng: number;
};

export default function AddMarker({ lat, lng }: Props) {
  const [icon, setIcon] = React.useState<MarkerIcon>();
  const [name, setName] = React.useState("");
  const { close } = useModal();
  const { appendMarker } = useTrip();

  const handleAddMarker = () => {
    if (!icon) return toast.error("Please choose an icon");
    appendMarker({ lat, lng, name, icon, id: randomId(6) });
    close();
  };

  return (
    <>
      <Header>Add Custom Marker</Header>
      <Body>
        <div className="flex gap-2 mb-2">
          <div className="flex flex-col gap-5 w-full">
            <Field label="Name">
              <Input type="text" name="name" value={name} autoFocus onChange={(e: any) => setName(e.target.value)} />
            </Field>
            <div>
              <label>Choose icon</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.values(MarkerIcon).map((it) => (
                  <button
                    type="button"
                    key={it}
                    onClick={() => setIcon(it)}
                    className={clsx("border-2 p-1", icon === it ? "border-blue-500 rounded-md" : "border-transparent")}
                  >
                    <MarkerWithIcon icon={it} className="scale-125" />
                  </button>
                ))}
              </div>
            </div>
            <Button type="button" color="primary" className="mt-2" size="md" onClick={handleAddMarker}>
              Add Marker
            </Button>
          </div>
        </div>
      </Body>
    </>
  );
}
