import React, {useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import appUrl from "../../RestApi/AppUrl";
import axios from "axios";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
    SafeAreaView
} from "react-native";

const VaccineFirstList = ({navigation}) => {

    const [phone, setPhone] = useState("");
    const [registeredList, setRegisteredList] = useState([]);

    useEffect(()=>{
        AsyncStorage.getItem('phone').then(value =>{
            setPhone(value)

            const url = appUrl.VaccinationRegisteredFirstList;
            let jsonObject = {phone:value};
            let config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
            };
            console.log(url)
            axios.post(url, JSON.stringify(jsonObject), config)
                .then(function (response) {
                    if (response.data.status == '1')
                    {
                        setRegisteredList(response.data.myData)
                        setPhone(value);
                    }else if (response.data.status == '0')
                    {
                        Alert.alert(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {
                registeredList.length == 0  ?
                    (<Text style={styles.dataStatus}>No data found</Text>) :
                    (<FlatList
                        data={registeredList}
                        keyExtractor={item => item.application_id.toString()}
                        renderItem={({item}) =>(
                            <TouchableOpacity
                                onPress={()=>{
                                    // console.log(item.synchronize_id)
                                    AsyncStorage.setItem('user_phone', item.user_phone);
                                    AsyncStorage.setItem('service_type', "vaccineFirst");
                                    AsyncStorage.setItem('application_id', item.application_id);
                                    AsyncStorage.setItem('synchronize_id', item.synchronize_id);

                                    const url = appUrl.OtpSend;
                                    let jsonObject = {phone:phone};
                                    let config = {
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
                                    };
                                    axios.post(url, JSON.stringify(jsonObject), config)
                                    .then(function (response) {
                                        if (response.data.status == '1')
                                        {
                                            navigation.navigate("Vaccine Volunteer otp")
                                        }else if (response.data.status == '0')
                                        {
                                            Alert.alert(response.data.message)
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                                }}
                            >
                                <View style={styles.mainCard}>
                                    <Text style={styles.mainCardName}>Name: {item.user_name}</Text>
                                    <Text style={styles.mainCardVaccine}>Vaccine: {item.name_of_vaccine}</Text>
                                    <Text style={styles.mainCardPhone}>Phone: {item.user_phone}</Text>
                                    <Text style={styles.mainCardReg}>Reg. ID: {item.application_id}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />)
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        height:'100%'
    },
    mainCard: {
        backgroundColor: '#fff',
        padding:15,
        margin:10,
        borderRadius:5,
    },
    mainCardName:{
        color:'#0055A1',
        fontWeight:"bold",
    },
    mainCardVaccine:{
        fontWeight:"bold",
    },
    mainCardPhone:{

    },
    mainCardError:{

    },
    mainCardReg:{
        color:'#000'
    },
    dataStatus:{
        color: '#eece05',
        textAlign:"center",
        marginTop: 100,
        fontWeight:"bold",
    },
});

export default VaccineFirstList;