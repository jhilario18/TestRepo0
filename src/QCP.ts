export function onBeforePriceRules(quoteModel, lineModels){
    lineModels.forEach(function (line) {
        if(line.record.SBQQ__StartDate__c == null){
            if(line.record.SBQQ__Group__c == null || line.record.SBQQ__Group__r.SBQQ__StartDate__c == null){
                line.record.Custom_Effective_Start_Date__c = quoteModel.record.SBQQ__StartDate__c;
            } else {
                line.record.Custom_Effective_Start_Date__c = line.record.SBQQ__Group__r.SBQQ__StartDate__c;
            }
        } else {
            line.record.Custom_Effective_Start_Date__c = line.record.SBQQ__StartDate__c;
        }
    });
    return Promise.resolve();
}

export function onAfterCalculate (quoteModel, lineModels, conn){
    var totalNetCost = 0;
    var wifiapQuantity;
    var laptop15Quantity = 0;
    /*var discountAmount;

    var conditions = {
        Name: quoteModel.record['Promo_Code__c']
    };

    var fields = ['Name', 'Discount__c'];

    return conn.sobject('Promo_Code__c')
    .find(conditions,fields)
    .execute(function (err, promoCodes){
        if (err) {
            return Promise.reject(err);
        } else {
            if(promoCodes.length > 0){
                discountAmount = promoCodes[0].Discount__c;
            }

            lineModels.forEach(function (line){
                line.record.SBQQ__Discount__c = discountAmount;
            });
        }
    });*/

    lineModels.forEach(function (line){
        if(line.record.SBQQ__RequiredBy__c == null){
            line.record.Custom_Hardware_Counts__c = 0;
        }
        if(line.record.SBQQ__ProductCode__c == 'LAPTOP15'){
            laptop15Quantity += line.record.SBQQ__Quantity__c;
        }
    })

    lineModels.forEach(function (line){
        if(line.record.SBQQ__ProductFamily__c == 'Hardware' && line.record.Is_Computer__c == true){
            if(line.parentItem != null){
                line.parentItem.record.Custom_Hardware_Counts__c += line.record.SBQQ__Quantity__c;
            }
            totalNetCost += line.record.Net_Cost__c;
        }
    })
    lineModels.forEach(function (line){
        if(line.record.SBQQ__ProductFamily__c == 'Hardware' && line.record.Is_Computer__c == true){
            line.record.Total_Cost_of_Computer_Hardware_Products__c = totalNetCost;
        }
    })

    wifiapQuantity = Math.ceil(laptop15Quantity / 12);    
    lineModels.forEach(function(line){
        if(line.record.SBQQ__ProductCode__c == 'WIFIAP'){
            line.record.SBQQ__Quantity__c = wifiapQuantity;
        }
    })
    return Promise.resolve();
}

/*export function isFieldEditableForObject(fieldName, quoteOrLine, objectName){
    if(objectName == 'QuoteLine__c' && fieldName == 'SBQQ__AdditionalDiscount__c'){
        if(quoteOrLine.SBQQ__Quantity__c > 10){
            return false;
        }
    }
}

export function isFieldVisibleForObject(fieldName, quoteOrLine, objectName){
    if(objectName == 'QuoteLine__c' && fieldName == 'SBQQ__NetPrice__c'){
        if(quoteOrLine.SBQQ__Quantity__c > 10){
            return false;
        }
    }
}*/