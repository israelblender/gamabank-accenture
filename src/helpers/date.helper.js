
const calcMonthReference = (increment)=>{
    const dt = new Date()
    dt.setMonth(dt.getMonth()+increment)
    return dt.toISOString().substr(0, 7)
}

const dateCurrent = ()=>{
    const dt = new Date()
    return dt.toISOString().split('T')[0]
}
module.exports = {calcMonthReference, dateCurrent}