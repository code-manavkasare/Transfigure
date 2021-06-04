import {API_URL} from '@env'

const main_url = API_URL;
export async function getFriends (authKey) {

    let url=main_url+'friends/'
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
            return json.friends;
        }
        else{return []}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function getNewFriends (authKey,skip,word) {

    let url=main_url+'friends/new'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            skip:skip,
            searchWord:word
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.newFriends;
        }
        else{return []}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function sendFriendRequest (authKey,uuID) {

    let url=main_url+'friends/add'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            uuID:uuID
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
export async function removeFriend (authKey,uuID) {

    let url=main_url+'friends/delete'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            frienduuID:uuID
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
export async function handleFriendRequest(authkey,accepted,friendID){



        let url=main_url
        if(accepted){url+='friends/accept/'}
        else{url+='friends/decline/'}

            try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authKey: authkey,
                    frienduuID:friendID
                }),
                });                
                let json = await response.json();
                if(json.success){
                    return true;
                }
                else{
                    return false;
                }
            }  
            catch (error) {
                console.error(error);
                return false;
                }    
        
    
    
    
}


