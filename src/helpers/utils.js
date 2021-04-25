export function formatTime(second) {
    let i = 0
    let h = 0
    let s = parseInt(second)
    if (s >= 60) {
        i = parseInt(s / 60)
        s = parseInt(s % 60)
        if (i >= 60) {
            h = parseInt(i / 60)
            i = parseInt(i % 60)
        }
    }
    // 补零
    const zero = (v) => (v >> 0 < 10 ? `0${v}` : v)
    if (h > 0) return [zero(h), zero(i), zero(s)].join(":")
    return [zero(i), zero(s)].join(":")
}

export function createRandomNum(minNum, maxNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
}

export function priceRandom(price) {
    let number

    if (Number(price) < 999 && Number(price) > 999999) {
        return "pice out the range"
    }
    const slicePrice = String(price)
        .toString()
        .slice(0, -3)

    do {
        number = Math.floor(Math.random() * 199)
    } while (number < 100)

    return String(slicePrice) + String(number)
}

export function kFormatter(num) {
    return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " K"
        : Math.sign(num) * Math.abs(num)
}

export function numberWithCommas(x) {
    var parts = x.toString().split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return parts.join(",")
}

export const logger = (...messages) => {
    console.log(process.env.MODE)
}

export const objIsEmpty = (obj) => {
    return Object.keys(obj).length === 0
}
