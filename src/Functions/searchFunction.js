import React from 'react'

export default function searchFunction(searchTerm, anime) {
    if(searchTerm === ""){
        return true;
    }else{
        let foundMatch = false;
        if ((anime.toUpperCase()).includes(searchTerm.toUpperCase())){
            foundMatch = true;
        }
        return foundMatch;
    }
}
