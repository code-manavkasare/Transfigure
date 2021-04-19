const main_url = "https://beacon-backend.herokuapp.com/";
export async function getOneQuote(authKey, quoteID) {
  let url = main_url + "quotes/getOne/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return json.quote[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function fetchrecentlySearched(authKey) {
  let url = main_url + "quotes/getrecentlySearched/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return json.recentlySearched;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
}
export async function deleteQuote(authKey, quoteID) {
  let url = main_url + "quotes/delete/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addRecentlySearched(authKey, searchWord) {
  let url = main_url + "quotes/updaterecentlySearched/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        searchWord: searchWord,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function deleteCommentOfQuoteFunc(authKey, quoteID, commentID) {
  let url = main_url + "quotes/deleteCommentOfQuote/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentID: commentID,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function deleteCommentOfCommentFunc(
  authKey,
  quoteID,
  commentID,
  addedByUuid,
  replyID
) {
  let url = main_url + "quotes/deleteCommentOfComment/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentID: commentID,
        addedByUuid: addedByUuid,
        replyID: replyID,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRecentlySearched(authKey, deleteWord) {
  let url = main_url + "quotes/deleterecentlySearched/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        deleteWord: deleteWord,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getRandomQuote(authKey, offset, searchWord) {
  let url = main_url + "quotes/getRandomQuote/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        offset: offset,
        searchWord: searchWord,
      }),
    });
    let json = await response.json();
    console.log(json);
    if (json.success) {
      return {
        currentUser: json.currentUser,
        quote: json.quote,
        favorite: json.favorite,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function addremovefavorites(authKey, quoteID) {
  let url = main_url + "quotes/addtofavorites/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addQuote(
  authKey,
  style,
  title,
  quoteText,
  shareWith,
  backgroundColor,
  imagetoSend,
  imageChosen
) {
  let url = main_url + "quotes/add/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        style: style,
        title: title,
        quoteText: quoteText,
        shareWith: shareWith,
        backgroundColor: backgroundColor,
        imagetoSend: imagetoSend,
        imageChosen: imageChosen,
      }),
    });
    let json = await response.json();

    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function likeQuote(authKey, quoteID) {
  let url = main_url + "quotes/like/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function dislikeQuote(authKey, quoteID) {
  let url = main_url + "quotes/dislike/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function replyToComment(authKey, quoteID, commentID, replyText) {
  let url = main_url + "quotes/replytocomment/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentID: commentID,
        replyText: replyText,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function replyToQuote(authKey, quoteID, commentText) {
  let url = main_url + "quotes/addComment/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentText: commentText,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function likeComment(authKey, quoteID, commentID) {
  let url = main_url + "quotes/likeComment/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentID: commentID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function dislikeComment(authKey, quoteID, commentID) {
  let url = main_url + "quotes/dislikeComment/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        commentID: commentID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function reportQuote(authKey, quoteID, reason) {
  let url = main_url + "reports/quote/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        quoteID: quoteID,
        reason: reason,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
export async function getUserQuotes(authKey, userUUID) {
  let url = main_url + "quotes/getNumUserQuotes/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        uuID: userUUID,
      }),
    });
    let json = await response.json();
    if (json.success) {
      return {
        quotes: json.quotes,
        quotesLength: json.quotesLength,
        buildsLength: json.buildsLength,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUserPostsOfDay(authKey, userUUID, date) {
  let url = main_url + "quotes/getAllPosts/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey: authKey,
        uuID: userUUID,
        date: date,
      }),
    });
    let json = await response.json();
    console.log(json, 'json')
    if (json.success) {
      return {
        posts: json.posts
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}
