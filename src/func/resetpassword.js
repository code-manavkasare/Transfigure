const main_url='https://beacon-backend.herokuapp.com/'
export async function sendCode (resetemail) {

            let url=main_url+'users/sendResetEmail/'
            try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: resetemail
                }),
                });                
                let json = await response.json();
                
                if(json.success){return true}
                else{return false;}

            }  
            catch (error) {
                console.error(error);
                }
}
export async function checkCode (code,email) {

    let url=main_url+'users/checkCode/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resetCode: code,
            resetEmail: email
        }),
        });                
        let json = await response.json();
        
        if(json.success){return true;}
        else{return false;}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function resetPassword (email,password) {

    let url=main_url+'users/resetPassword/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resetEmail: email,
            resetPassword: password
        }),
        });                
        let json = await response.json();
        
        if(json.success){return true;}
        else{return false;}

    }  
    catch (error) {
        console.error(error);
        }
}



