var currentNumBoxes = 0;
var config = { attributes: true, childList: true, characterData: true, subtree:true };

function sort_marketboxes(a,b)
{
    aText = a.childNodes[0].childNodes[0].childNodes[1].childNodes[1].innerText.split('·')[1].trim();
    bText = b.childNodes[0].childNodes[0].childNodes[1].childNodes[1].innerText.split('·')[1].trim();
    if(convertTimeToNumber(aText) < convertTimeToNumber(bText))
        return -1;
    else    
        return 1;
}

function convertTimeToNumber(timeText)
{
   var matchNum = timeText.match(/\d+/);
   if(timeText.indexOf("second") >= 0)
   {
        return matchNum != null ? parseInt(matchNum[0])*0.1 : 0.1;
   }
   else if(timeText.indexOf("minute") >= 0)
   {
        return matchNum != null ? parseInt(matchNum[0]) : 1;
   }
   else if(timeText.indexOf("hour") >= 0)
   {
        return matchNum != null ? parseInt(matchNum[0])*60 : 60;
   }
   else if(timeText.indexOf("day") >= 0)
   {
        return matchNum != null ? parseInt(matchNum[0])*60*24 : 60*24;
   }
   else if(timeText.indexOf("week") >= 0)
   {
        return 60*60*24*7;
   }
}

var observer = new MutationObserver(function(mutations){
    if(mutations.filter(m=>m.type === "childList").length > 0)
    {
        var marketboxes = $("a[data-testid='marketplace_feed_item']");
        if(marketboxes.length != currentNumBoxes)
        {
            currentNumBoxes = marketboxes.length;   
        }
        else
        {
            return;
        }
        if(currentNumBoxes > 0)
        {
            var grps = [[marketboxes[0].parentElement]];
            
            for(let i=1;i<marketboxes.length;i++)
            {
                if(marketboxes[i].parentElement.parentElement == grps[grps.length-1][0].parentElement)
                {   
                    grps[grps.length-1].push(marketboxes[i].parentElement)
                }
                else
                {
                    grps.push([marketboxes[i]]);
                }
            }

            observer.disconnect();

            grps.forEach((g)=>{
                let parentElement = g[0].parentNode;
                if(g.length > 1)
                    $(g).sort(sort_marketboxes).prependTo(parentElement);    
            });

            observer.observe(document.body, config);                    
        }
    }
    
});;

observer.observe(document.body, config);