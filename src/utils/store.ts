import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
    id: 'mepay_agent_id',
    encryptionKey: 'mepay_agent_password',
});