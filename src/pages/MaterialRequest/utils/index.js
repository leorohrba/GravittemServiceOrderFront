const statusHeader = [
    { code: "PEND", color: "orange" },
    { code: "SEPA", color: "blue" },
    { code: "CONC", color: "green" },
    { code: "CANC", color: "gray" },
]

const statusItem = [
    { code: "PEND", color: "orange" },
    { code: "SEPA", color: "blue" },
    { code: "CONC", color: "green" },
    { code: "CANC", color: "gray" },
    { code: "APLI", color: "#00CCEE" },
]

export const getColorStatusHeader = (code) => statusHeader.find(x => x.code === code)?.color
export const getColorStatusItem = (code) => statusItem.find(x => x.code === code)?.color
