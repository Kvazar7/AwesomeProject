import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import Login from "../Component/Login";
import LoadScreen from '../Component/LoadScreen'; // Екран завантаження

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading && <LoadScreen />} 
            <Login navigation={navigation} setLoading={setLoading}/>
        </>
    );
};

export default LoginScreen;