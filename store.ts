import { create } from 'zustand';

// Define the shape of the store state
interface StoreState {
    savedValues: string[];
    setSavedValues: (values: string[]) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    inputSuggestions: string[];
    setInputSuggestions: (suggestions: string[]) => void;
}

// Create the store using Zustand
const useStore = create<StoreState>((set) => ({
    savedValues: [],
    setSavedValues: (values) => set({ savedValues: values }),
    inputValue: '',
    setInputValue: (value) => set({ inputValue: value }),
    inputSuggestions: [],
    setInputSuggestions: (suggestions) => set({ inputSuggestions: suggestions }),
}));

export default useStore;