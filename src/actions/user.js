import textResource from "../components/textLoader"

const main_url='https://beacon-backend.herokuapp.com/' 
export const updateKey = authKey => {
    return {
        type: UPDATE_KEY,
        payload: authKey
    }
}
export const updateUuid = uuID => {
    return {
        type: UPDATE_UUID,
        payload: uuID
    }
}

export const updateEmail = email => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}
export const updatePassword = password => {
    return {
        type: UPDATE_PASSWORD,
        payload: password
    }
}

export const updateNotifications = notifications => {
    return {
        type: UPDATE_NOTIFICATIONS,
        payload: notifications
    }
}

export const updateQuotes = (quote) => {
    return {
        type: UPDATE_QUOTES,
        payload: {quoteID:quote.quoteID,quoteInside:quote}
    }
}

export const returnNothing = () => {
    return {
        type: UPDATE_NOTHING,
        payload: null
    }
}



export  const loginUser =()  =>  {

    return async (dispatch, getState) => {
        
            const { email,password} = getState().user
                                        //merchant,terminal
            let url=main_url+'users/login/'
            let key=''
            let uuID=''
            try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                });
                
                
                let json = await response.json();
                if(json.success){
                    key=json.authKey
                    uuID=json.uuID
                }
                else{
                    key=json.reason
                }
                
               await dispatch(updateKey(key))
               await dispatch(updateUuid(uuID))
            }  
            catch (error) {
                console.error(error);
                }
            

             
    }
}




export  const registerUser =(values)  =>  {

    return async (dispatch, getState) => {
        
            const { firstName,lastName,email,password} = values

            let url=main_url+'users/register/'
            let key=''
            try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    password:password,
                    email:email
                }),
                });                
                let json = await response.json();
                return (json)
                
                
               
            }  
            catch (error) {
                console.error(error);
                }
            

             
    }
}

export const handleFriendRequest=(accepted,friendID,notificationID)=>{
    return async (dispatch, getState) => {
        const { authKey} = getState().user

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
                    authKey: authKey,
                    frienduuID:friendID
                }),
                });                
                let json = await response.json();
                if(json.success){
                    await dispatch(deleteNotification(notificationID))
                }
            }  
            catch (error) {
                console.error(error);
                }    
        
    
    
    }
}
export const getAllQuotes=(notifications)=>{
    return async (dispatch, getState) => {
        const { authKey} = getState().user

        let url=main_url+'quotes/getOne/'
        let fetchedQuotes=[]
        for(let i=0;i<notifications.length;i++){
            if('quoteID' in notifications[i]){
                let id=notifications[i].quoteID
                if(!fetchedQuotes.includes(id)){
                    fetchedQuotes.push(id)
        try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authKey: authKey,
                quoteID:id

            }),
            });                
            let json = await response.json();
            if(json.success){
                await dispatch(updateQuotes(json.quote[0]))
                
            }
        }  
        catch (error) {
            console.error(error);
            }
        }    
        }
           
    }
    
    }
}
export  const getNotifications =()  =>  {

    return async (dispatch, getState) => {
        
            const { authKey} = getState().user

            let url=main_url+'notifications/'
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
                    
                    if('notifications' in json){
                        let reversed=[].concat(json.notifications).reverse()
                        try{
                            await dispatch(updateNotifications(reversed))
                            await dispatch(getAllQuotes(reversed))
                        }
                        catch(error){console.log(error)}
                    
                }
                    else{
                        return(dispatch(updateNotifications([])))
                    } 
                }
                else{
                    return dispatch(returnNothing())
                }
                
               
            }  
            catch (error) {
                console.error(error);
                }       
    }
}


export  const deleteNotification =(notificationID)  =>  {

    return async (dispatch, getState) => {
        
            const { authKey} = getState().user

            let url=main_url+'notifications/delete/'
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
                    
                    return dispatch(getNotifications())
                }
                else{
                    return dispatch(getNotifications())
                }
                
               
            }  
            catch (error) {
                console.error(error);
                }
            

             
    }
}


export const translateText =(text)  =>  {
    return (dispatch, getState) => {
        let { languageCode } = getState().user
        return textResource[text+'.'+languageCode]
    }
}

export const setLanguage = lang => {
    console.log(lang,"langhugcfgvjhku")
    return {
        type: SET_LANGUAGE,
        payload: lang
    }
}


export const UPDATE_KEY = 'UPDATE_KEY'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS'
export const UPDATE_QUOTES = 'UPDATE_QUOTES'
export const UPDATE_NOTHING = 'UPDATE_NOTHING'
export const UPDATE_NEW_QUOTES = 'UPDATE_NEW_QUOTES'
export const UPDATE_UUID = 'UPDATE_UUID'
export const SET_LANGUAGE = 'SET_LANGUAGE'














