
import { useLocalization as useLocalizationContext } from '../context/LocalizationContext';

// This is a re-export for semantic separation, the core logic is in the context file.
export const useLocalization = useLocalizationContext;