import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Linking } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

type QrScannerViewProps = {
  onQrScanned: (token: string) => void;
  isActive?: boolean;
};

const QrScannerView: React.FC<QrScannerViewProps> = ({ onQrScanned, isActive = true }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    } catch {
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (!isActive) return;
      const first = codes[0];
      if (first?.value) {
        onQrScanned(first.value);
      }
    },
  });

  // Initial loading while we ask for permission or wait for the camera device
  if (hasPermission === null || !device) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  // Permission denied → show card with retry/settings CTA
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Camera permission needed</Text>
          <Text style={styles.permissionText}>
            {Platform.OS === 'ios'
              ? 'We need access to your camera to scan the bus QR. You can grant access in Settings.'
              : 'We need access to your camera to scan the bus QR. You can grant access in App Settings.'}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            activeOpacity={0.8}
            onPress={async () => {
              const status = await Camera.requestCameraPermission();
              if (status === 'granted') {
                setHasPermission(true);
              } else if (Platform.OS === 'android') {
                Linking.openSettings().catch(() => {});
              } else {
                setHasPermission(false);
              }
            }}
          >
            <Text style={styles.permissionButtonText}>
              {Platform.OS === 'ios' ? 'Open camera permission' : 'Allow camera access'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.hint}>Align the QR code within the frame</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionCard: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  wrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  hint: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default QrScannerView;
