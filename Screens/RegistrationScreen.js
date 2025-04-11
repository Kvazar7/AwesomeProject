import React, { useState } from 'react';
import Registration from '../Component/Registration';
import LoadScreen from '../Component/LoadScreen'; // Екран завантаження

const RegistrationScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
        {loading && <LoadScreen />} 
        <Registration navigation={navigation} setLoading={setLoading} />
        </>
    );
};

export default RegistrationScreen;
