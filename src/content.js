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
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        const measureSpan = document.createElement("span");
        measureSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        font-family: ${computedStyle.fontFamily};
        font-size: ${computedStyle.fontSize};
        letter-spacing: ${computedStyle.letterSpacing};
        white-space: pre;


        `;
        measureSpan.textContent = element.value.slice(0, cursorPosition);
        document.body.appendChild(measureSpan);

        const textWidth = measureSpan.getBoundingClientRect().width;
        document.body.removeChild(measureSpan);

        this.el.style.top = `${rect.top + window.scrollY}px`;
        this.el.style.left = `${rect.top + window.scrollX + textWidth}px`;
        this.el.style.height = computedStyle.lineHeight;
        this.el.style.padding = computedStyle.padding;
        this.el.style.fontSize = computedStyle.fontSize;
        this.el.style.fontFamily = computedStyle.fontFamily;
        this.el.style.letterSpacing = computedStyle.letterSpacing;
        this.el.style.lineheight = computedStyle.lineHeight;

        this.el.textContent = suggestion;
        this.el.style.display = "block";
    }

    hide(){
        this.el.style.display = "none";
    }

}

class AICompletion{
    constructor(){
        this.currentEl = null;
        this.suggestion = "";
        this.el = new SuggestionWidget();
        this.cursorPosition = 0;


        this.debouncedGetSuggestions =debounce(
            this.getSuggestions.bind(this),
            500
        );
        this.setupEventListeners();
    }

    async getSuggestions(text, cursorPosition){
        if (!text.trim()){
            this.suggestion = "";
            this.overly.hide();
            return;
        }

        try{
            const suggestion = await getCompletion(text);
            this.suggestion = suggestion.trim();
            if (this.currentEl && this.suggestion){
                this.overlay.show(this.currentEl, this.suggestion, cursorPosition);
            }
        } catch (error){
            console.error("Error getting suggestions:", error);
            this.suggestion = "";
            this.currentEl.hide();
        }
    }
}