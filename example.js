const arr1 =    ['dog','cat','fish','poodle','square','triangle']
const arr2 =    ['dog','cat','fish','pund','poodle','square','triangle','Work']

var x =0;
while(x<arr2.length){
    if(arr1.indexOf(arr2[x])===-1){
        console.log(arr2[x])
    }
    x++

}