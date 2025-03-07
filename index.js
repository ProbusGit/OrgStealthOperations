import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

let ForegroundService = Platform.OS === 'android' ? require('@supersami/rn-foreground-service').default : null;
if (ForegroundService) {
    const config = {
        config: {
            alert: true,
            onServiceErrorCallBack: function () {
                console.warn('[ReactNativeForegroundService] onServiceErrorCallBack', arguments);
            },
        }
    };
    ForegroundService.register(config);
}
AppRegistry.registerComponent(appName, () => App);















