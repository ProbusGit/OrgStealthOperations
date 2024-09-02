import {customText} from 'react-native-paper';
import fontConfig from '../../theme/fonts/fontConfig';
// Use this instead of importing `Text` from `react-native-paper`
export const Text = customText<typeof fontConfig>();
