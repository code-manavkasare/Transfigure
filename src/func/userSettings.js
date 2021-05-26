const main_url='https://beacon-backend.herokuapp.com/'
export async function fetchDisplayName (authKey) {

    let url=main_url+'users/getdisplayName/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.displayName;
        }
        else{return ''}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function loginUser (login,password){

            let url=main_url+'users/login/'
            try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: login,
                    password: password,
                }),
                });
                
                
                let json = await response.json();
                if(json.success){
                    return {key:json.authKey,uuID:json.uuID,success:true}
                }
                else{
                    return {success:false,reason:json.reason}
                }
            }  
            catch (error) {
                console.error(error);
                }
            

             
    
}
export async function fetchDisplayTitle (authKey) {

    let url=main_url+'users/getdisplayTitle/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.displayTitle;
        }
        else{return ''}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function fetchMyBio (authKey) {

    let url=main_url+'users/getmyBio/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
        }),
        });                
        let json = await response.json();
        if(json.success){
            return json.about;
        }
        else{return ''}

    }  
    catch (error) {
        console.error(error);
        }
}



export async function updateDisplayName (authKey,displayName) {

    let url=main_url+'users/updatedisplayName/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            displayName:displayName
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
export async function updateDisplayTitle (authKey,displayTitle) {

    let url=main_url+'users/updatedisplayTitle/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            displayTitle:displayTitle
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
export async function updateMyBio (authKey,myBio) {

    let url=main_url+'users/updatemyBio/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            about:myBio
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
export async function contactUsFunc (authKey,message) {

    let url=main_url+'users/contactus/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            message:message
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



export async function updateInfo (authKey,field,value) {

    let url=main_url+'users/updateInfo/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            field:field,
            value:value
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
export async function fetchSettingsInfo (authKey) {

    let url=main_url+'users/getSettingsInfo/'
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
            return json.settings;
        }
        else{return null}

    }  
    catch (error) {
        console.error(error);
        }
}

export async function notificationToggle (authKey,notificationEnabled) {

    let url=main_url+'users/setnotification/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            notificationEnabled
        }),
        });      
        let json = await response.json();
        console.log(json)
        if(json.success){
            return json.success;
        }
        else{return null}

    }  
    catch (error) {
        console.error(error);
        }
}

export async function deleteUserAccount (authKey,reason) {

    let url=main_url+'users/deleteAccount/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
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
export async function updatePassword (authKey,oldPassword,newPassword) {

    let url=main_url+'users/updatePassword/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            oldPassword:oldPassword,
            newPassword:newPassword
        }),
        });      
        let json = await response.json();
        
        if(json.success){
            return true;
        }
        else{
            if('reason' in json){
                return 1;
            }
            else{
                return false;
            }
            
        }

    }  
    catch (error) {
        console.error(error);
        }
}
export async function getAvatar (authKey,uuID) {

    let url=main_url+'users/getAvatar/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            useruuID:uuID
        }),
        });      
        let json = await response.json();
        if(json.success){
            return json.avatar;
        }
        else{return false}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function setAvatar (authKey,base64Img) {

    let url=main_url+'users/updateAvatar/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            base64Img:base64Img
        }),
        });
        console.log(response)      
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



