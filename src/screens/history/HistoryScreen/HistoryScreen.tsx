import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './HistoryScreen.styles'
import { SwText as Text } from '../../../components/common/SwText/SwText'

const HistoryScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <Text>History Screen</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HistoryScreen

const styles = StyleSheet.create({})