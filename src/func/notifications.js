import {API_URL} from '@env'

const main_url = API_URL;
export async function getNotifications (authKey) {

    let url=main_url+'notifications/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey
        }),
        });                
        let json = await response.json();
        
        if(json.success){
            return json.notifications;
        }
        else{return [];}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function deleteNotification (authKey,notificationID) {

    let url=main_url+'notifications/delete'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            notificationID:notificationID
        }),
        });                
        let json = await response.json();
        
        if(json.success){
            return true;
        }
        else{return false}

    }  
    catch (error) {
        console.error(error);
        return false;
        }
}
export async function getAllPostsNotifications (authKey) {

    let url=main_url+'notifications/getAllPosts'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.notifications;
        }
        else{return false;}

    }  
    catch (error) {
        console.error(error);
        return false;
        }
}
export async function getNotifLength (authKey) {

    let url=main_url+'notifications/getlengtheverything'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.notificationslength;
        }
        else{return false;}

    }  
    catch (error) {
        console.error(error);
        return false;
        }
}
export async function getMyPostsNotification (authKey) {

    let url=main_url+'notifications/getMyPosts'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.notifications;
        }
        else{return false;}

    }  
    catch (error) {
        console.error(error);
        return false;
        }
}

