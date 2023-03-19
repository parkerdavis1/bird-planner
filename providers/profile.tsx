import React from "react";
import { useUser } from "providers/user";
import { Address, Profile } from "lib/types";
import { subscribeToProfile, setProfileValue, appendProfileLifelist, removeProfileLifelist } from "lib/firebase";
import toast from "react-hot-toast";

interface ContextT extends Profile {
  setLifelist: (lifelist: string[]) => Promise<void>;
  appendLifelist: (speciesCode: string) => Promise<void>;
  removeLifelist: (speciesCode: string) => Promise<void>;
  setRadius: (radius: number) => Promise<void>;
  setAddress: (address: Address) => Promise<void>;
  reset: () => void;
}

const initialState: Profile = {
  lifelist: [],
  radius: 50,
  address: undefined,
};

export const ProfileContext = React.createContext<ContextT>({
  ...initialState,
  setLifelist: async () => {},
  appendLifelist: async () => {},
  removeLifelist: async () => {},
  setRadius: async () => {},
  setAddress: async () => {},
  reset: () => {},
});

type Props = {
  children: React.ReactNode;
};

const ProfileProvider = ({ children }: Props) => {
  const [state, setState] = React.useState<Profile>(initialState);
  const { user } = useUser();
  const uid = user?.uid;

  React.useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToProfile((profile) => setState(profile));
    return () => unsubscribe();
  }, [uid]);

  const setLifelist = async (lifelist: string[]) => {
    setState((state) => ({ ...state, lifelist }));
    try {
      await setProfileValue("lifelist", lifelist);
    } catch (error) {
      toast.error("Error saving life list");
    }
  };

  const appendLifelist = async (speciesCode: string) => {
    setState((state) => ({ ...state, lifelist: [...state.lifelist, speciesCode] }));
    try {
      await appendProfileLifelist(speciesCode);
    } catch (error) {
      toast.error("Error saving changes");
    }
  };

  const removeLifelist = async (speciesCode: string) => {
    setState((state) => ({ ...state, lifelist: state.lifelist.filter((code) => code !== speciesCode) }));
    try {
      await removeProfileLifelist(speciesCode);
    } catch (error) {
      toast.error("Error saving changes");
    }
  };

  const setRadius = async (radius: number) => {
    setState((state) => ({ ...state, radius }));
    try {
      await setProfileValue("radius", radius);
    } catch (error) {}
  };

  const setAddress = async (address: Address) => {
    setState((state) => ({ ...state, address }));
    try {
      await setProfileValue("address", address);
    } catch (error) {}
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <ProfileContext.Provider
      value={{
        lifelist: state.lifelist || [],
        radius: state.radius || 50,
        address: state.address,
        setLifelist,
        appendLifelist,
        removeLifelist,
        setRadius,
        setAddress,
        reset,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => {
  const state = React.useContext(ProfileContext);
  return { ...state };
};

export { ProfileProvider, useProfile };
