const main_url='https://beacon-backend.herokuapp.com/'
export async function getReflection (authKey) {

    let url=main_url+'reflections/getReflection/'
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
            return {ref:json.reflection};
        }
        else{return false}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function likeReflection (authKey) {

    let url=main_url+'reflections/like/'
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
        console.log(json)
        if(json.success){
            return true;
        }
        else{return false}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function dislikeReflection (authKey) {

    let url=main_url+'reflections/dislike/'
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
            return true;
        }
        else{return false}

    }  
    catch (error) {
        console.error(error);
        }
}
export async function addCommentReflection (authKey,commentText) {

    let url=main_url+'reflections/addComment/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            commentText:commentText
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
export async function replyToCommentReflection (authKey,replyText,commentID) {

    let url=main_url+'reflections/replyToComment/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            replyText:replyText,
            commentID:commentID
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
export async function likeCommentReflection (authKey,commentID) {

    let url=main_url+'reflections/likeComment/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            commentID:commentID
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
export async function dislikeCommentReflection (authKey,commentID) {

    let url=main_url+'reflections/dislikeComment/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            commentID:commentID
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
export async function reportReflection (authKey,reflectionID,reason) {

    let url=main_url+'reports/reflection/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authKey: authKey,
            reflectionID:reflectionID,
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