import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import Login from "../Component/Login";
import LoadScreen from '../Component/LoadScreen'; // Екран завантаження
// import { useState } from "react";

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView>
            {loading && <LoadScreen />} 
            <Login navigation={navigation} setLoading={setLoading}/>
        </SafeAreaView>
    );
};

export default LoginScreen;