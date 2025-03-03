const debalance = (func, wait)=>{
    let timeout;
    return (...args)=> {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }
}

const getCompletion = async message => {
    const response = await fetch('http://localhost:3000/api/chat',{
    method: "POST",
    headers: {
        "Content-Type": "application/json",

    },
    body: JSON.stringify({message}),
})

    if (!response.ok){
        throw new Error("Failed to fetch completion");

    }

    const data = await response.json();

    try{
        const parseResponse= typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        return parseResponse.response || parseResponse;
    } catch(e){
        return data.response
    }

    
}



class SuggestionWidget{
    constructor(){
        this.el = document.createElement("div");
        this.el.className = "ai-suggestion-widget";
        this.el.style.cssText =`
        position: absolute;
        pointer-events: none;
        cokor: #9CA3AF;
        font-family: monospace;
        white-space: pre;
        z-index:10000;
        background: transparent;

        `;
        document.body.appendChild(this.el);

    }
    show(element, suggestion, cursorPosition){
        
    }
}