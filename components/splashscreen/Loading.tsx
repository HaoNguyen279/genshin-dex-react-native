import React from 'react';
import { View, ActivityIndicator , Modal} from 'react-native';


const LoadingModal : React.FC<{visible: boolean}> = ({visible}) => {
    return (
        <Modal
        visible={visible}
        transparent={true}
        animationType="fade">
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <ActivityIndicator size="large" color="#65ddfd" />
            </View>
        </Modal>
    )};

export default LoadingModal;
