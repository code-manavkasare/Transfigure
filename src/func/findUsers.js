import {API_URL} from '@env'

const main_url = API_URL;
export async function getOneUser (authKey,userID) {

    let url=main_url+'users/getOne/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            userID:userID
        }),
        });                
        let json = await response.json();
        if(json.success){
            return {user:json.user,avatar:json.avatar};
        }
        else{return null}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function reportUser (authKey,userID,reason) {

    let url=main_url+'reports/user/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            userID:userID,
            reason:reason
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
        }
}

