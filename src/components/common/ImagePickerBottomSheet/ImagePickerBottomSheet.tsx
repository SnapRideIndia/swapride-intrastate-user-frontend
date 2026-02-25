import React from 'react';
import {
    Modal,
    TouchableOpacity,
    View,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { SwText as Text } from '../SwText/SwText';
import { useTheme } from '../../../theme/ThemeProvider';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import PrimaryButton from '../SwButton/PrimaryButton/PrimaryButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImagePickerBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelectCamera: () => void;
    onSelectGallery: () => void;
}

export const ImagePickerBottomSheet = ({
    visible,
    onClose,
    onSelectCamera,
    onSelectGallery,
}: ImagePickerBottomSheetProps) => {
    const { colors } = useTheme();

    const handleCamera = () => {
        onClose();
        onSelectCamera();
    };

    const handleGallery = () => {
        onClose();
        onSelectGallery();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.sheet, { backgroundColor: colors.background_primary }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={[styles.handle, { backgroundColor: colors.border_3 }]} />
                    <Text varient="semi-bold" style={[styles.title, { color: colors.contentPrimary }]}>
                        Choose photo
                    </Text>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[styles.option, { borderColor: colors.border_1 }]}
                            onPress={handleCamera}
                            activeOpacity={0.7}
                        >
                            <FontAwesome6 name="camera" size={28} color={colors.primary} />
                            <View style={styles.optionTextContainer}>
                                <Text varient="semi-bold" style={[styles.optionText, { color: colors.contentPrimary }]}>
                                    Take Photo
                                </Text>
                                <Text style={[styles.optionSubtext, { color: colors.contentSecondary }]}>
                                    Use camera to capture
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.option, { borderColor: colors.border_1 }]}
                            onPress={handleGallery}
                            activeOpacity={0.7}
                        >
                            <FontAwesome6 name="images" size={28} color={colors.primary} />
                            <View style={styles.optionTextContainer}>
                                <Text varient="semi-bold" style={[styles.optionText, { color: colors.contentPrimary }]}>
                                    Choose from Gallery
                                </Text>
                                <Text style={[styles.optionSubtext, { color: colors.contentSecondary }]}>
                                    Pick from your photos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                 
                 <View style={{marginTop: 15}}>
                       <PrimaryButton title={'Close'} onPress={onClose}/>
                 </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 12,
        maxHeight: SCREEN_HEIGHT * 0.5,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
    },
    optionSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    cancelButton:{
        marginTop: 10,

    }
});
